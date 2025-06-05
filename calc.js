const mathLib = typeof require === 'function' ? require('mathjs') : math;

function evaluate(expr) {
  return mathLib.evaluate(expr);
}

if (typeof module !== 'undefined') {
  module.exports = { evaluate };
}
