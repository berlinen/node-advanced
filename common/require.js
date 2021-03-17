const vm = require('vm');
const path = require('path');
const fs = require('fs');

function _require(filename) {
  const pathToFile = path.resolve(__dirname, filename);
  const content = fs.readFileSync(pathToFile, 'utf-8');

  const wrapper = [
    '(function(require, module, exports) {',
    '})'
  ]

  const wrappedContent = wrapper[0] + content + wrapper[1];
  // 通过vm注入内容
  const script = new vm.Script(wrappedContent, {
    filename: 'index.js'
  })

  const module = {
    exports: {}
  };

  const func = script.runInThisContext();

  func(_require, module, module.exports);
  return module.exports;
}

global._require = _require;

