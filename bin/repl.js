
import {Stack} from '../src/stack';
import repl from 'repl';
import util from 'util';

const initialPrompt = 'f♭>';
const inspectOptions = { showHidden: false, depth: null, colors: true };

const args = process.argv.slice(2).join(' ');

let f = new Stack(args);
let buffer = '';

if (args !== '') {
  console.log(util.inspect(f.stack, inspectOptions) + '\n');
  process.exit();
}

console.log('** Welcome to f♭ **\n');

const stackRepl = repl.start({
  prompt: initialPrompt + ' ',
  eval: f_eval,
  writer: writer,
  ignoreUndefined: false,
  useColors: true,
  useGlobal: false
})
.on('reset', (context) => {
  f = new Stack('"Welcome to f♭" println');
});

stackRepl.defineCommand('.', {
  help: 'print stack',
  action: function () {
    console.log(writer(f));
    this.displayPrompt();
  }
});

function writer (_) {
  const depth = '>'.repeat(_.depth);
  stackRepl.setPrompt(initialPrompt + depth + ' ');

  return util.inspect(_.stack, inspectOptions) + '\n';
}

function f_eval (code, context, filename, cb) {
  code = code
    .replace(/^\(([\s\S]*)\n\)$/m, '$1')
    .replace('[\s]', ' ')
    .trim();

  if (code.slice(0, 1) === '({' && code[code.length - 1] === ')') {
    code = code.slice(1, -1); // remove "(" and ")"
  }

  code = buffer + code;

  const qcount = (code.match(/\`/g) || []).length;

  if (code[code.length - 1] === '\\' || qcount % 2 === 1) {
    buffer = code.slice(0, -1) + '\n';
  } else {
    buffer = '';
    f.eval(code, function () {
      // console.log('done', arguments);
      cb(null, f);
    });
  }
}
