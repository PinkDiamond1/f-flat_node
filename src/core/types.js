import { typed, Action, Just, Seq, BigNumber } from '../types';

export default {
  types: typed.types,
  type: typed('type', {
    Array: x => 'array', // eslint-disable-line no-unused-vars
    BigNumber: x => 'number', // eslint-disable-line no-unused-vars
    Complex: x => 'complex', // eslint-disable-line no-unused-vars,
    Date: x => 'date', // eslint-disable-line no-unused-vars
    any: x => typeof x
  }),
  number: typed('number', {
    'Date': x => x.valueOf(),
    any: x => new BigNumber(x)
  }),
  'number?': typed('number_', {
    'BigNumber | Complex | number': () => true,
    any: () => false
  }),
  'complex?': typed('complex_', {
    Complex: a => !a.im.isZero(),
    'BigNumber | number | any': () => false
  }),
  string: typed('string', {
    Array: String,
    any: String
  }),
  valueof: x => x.valueOf(),
  // number: x => processNumeric(String(x.valueOf())),
  itoa: x => String.fromCharCode(x),
  atoi: x => x.charCodeAt(0),
  atob: x => new Buffer(x, 'base64').toString('binary'),
  btoa: x => new Buffer(x, 'binary').toString('base64'),
  boolean: Boolean,
  ':': a => Just.of(new Action(a)),
  array: n => new Array(n),
  integer: a => a | 0,
  'null?': 'null =',
  nan: NaN,
  'string?': 'type "string" =',
  'boolean?': 'type "boolean" =',
  of: (a, b) => (a.constructor ? new a.constructor(b) : undefined),
  empty: a => (a.empty ? a.empty() : new a.constructor()),
  'is?': (a, b) => a === b,
  'nothing?': a => a === null || typeof a === 'undefined',

  date: a => new Date(a),
  now: () => new Date(),
  'date-expand': a => new Seq([a.getFullYear(), a.getMonth() + 1, a.getDate()])
};
