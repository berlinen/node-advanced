module.exports = "hello i am module"

exports.vara = '';

module.exports = '';
// error
exports = '';

let obj = {
  key: {}
}

// obj.key = 'key'

// const key = obj.key;

var key = obj.key;

// key.key = 'key';

key = "key"

console.log(obj);