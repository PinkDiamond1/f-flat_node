import is from '@sindresorhus/is';

import { VocabValue } from './vocabulary-value';

import { Word, Sentence } from './words';
import { rewrite } from '../utils/rewrite';
import { SEP } from '../constants';

const hasOwnProperty = Object.prototype.hasOwnProperty;

type D = { [key: string]: VocabValue };

export class Vocabulary {
  static makePath(key: string) {
    if (key.length < 3) return [key];
    return String(key)
      .toLowerCase()
      .split(SEP);
  }

  protected readonly root: D;
  protected readonly scope: D;
  protected readonly locals: D;

  constructor(parent?: Vocabulary) {
    this.root = parent?.root || Object.create(null);
    this.scope = Object.create(parent?.locals || this.root);
    this.locals = Object.create(this.scope);
  }

  get(key: string): VocabValue {
    const path = Vocabulary.makePath(key);
    return path.reduce((curr, key) => {
      if (!curr) {
        return;
      }
      let value = curr[key];
      while (value instanceof Word) {
        // TODO: Alias?
        key = value.value;
        value = this.locals[key];
      }
      return value;
    }, this.locals);
  }

  set(key: string, value: VocabValue): void {
    const path = Vocabulary.makePath(key);
    if (path.length > 1) {
      throw new Error(`Invalid definition key: ${key}`);
    }

    key = path.shift();
    if (hasOwnProperty.call(this.locals, key)) {
      throw new Error(`Cannot overwrite local definition: ${key}`);
    }

    const ukey = this._hash(key);

    this.root[ukey] = value;
    this.locals[key] = new Word(ukey); // TODO: Alias?

    // Compile
    this.root[ukey] = this.compile(value);
  }

  compile(action: any): any {
    if (action instanceof Word) {
      let value = this.locals[action.value];
      while (value instanceof Word) {
        // TODO: Alias?
        action = value;
        value = this.locals[action.value];
      }
      return action;
    }

    if (action instanceof Sentence) {
      const value = this.compile(action.value);
      return new Sentence(value, action.displayString);
    }

    if (Array.isArray(action)) {
      return action.reduce((p, i) => {
        const n = this.compile(i);
        p.push(n);
        return p;
      }, []);
    }

    if (is.plainObject(action)) {
      return Object.keys(action).reduce((p, key) => {
        const n = this.compile(action[key]);
        p[key] = n;
        return p;
      }, {});
    }

    return action;
  }

  words(): string[] {
    const keys: string[] = [];
    for (const prop in this.locals) {
      // eslint-disable-line guard-for-in
      keys.push(prop);
    }
    return keys.filter(_ => !_.startsWith('_'));
  }

  localWords(): string[] {
    return Object.keys(this.locals).filter(_ => !_.startsWith('_'));
  }

  scopedWords(): string[] {
    return Object.keys(this.scope).filter(_ => !_.startsWith('_'));
  }

  use(dict: { [key: string]: VocabValue }) {
    Object.keys(dict).forEach(key => {
      const value = dict[key];
      this.scope[key] = value;
    });
  }

  compiledLocals() {
    return Object.keys(this.locals).reduce((acc, key) => {
      if (!key.startsWith('_')) {
        acc[key] = this.locals[key];
      }
      return acc;
    }, {});
  }

  rewrite(x: Word | Sentence) {
    return rewrite(this.locals, x);
  }

  /**
   * Not yet a hash, use symbols?
   */
  private _hash(key: string) {
    let ukey: string;
    do {
      ukey = Math.random()
        .toString(36)
        .slice(2);
    } while (this.root[ukey]);
    return `_${key}#${ukey}`;
  }
}
