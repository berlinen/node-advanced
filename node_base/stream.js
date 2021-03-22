const fs = require('fs');
const path = require('path');
// Readable

// fs.createReadStream(path.resolve(__dirname, './text.js')).pipe(process.stdout)
const rr = fs.createReadStream(path.resolve(__dirname, './text.js'));

// rr.on('readable', (data) => {
//   process.nextTick(() => console.log(`readable: ${rr.read()}`))
// })

// rr.on('end', () => {
//   console.log('done')
// })
// 流式消耗迭代器中书籍
const Readable = require('stream').Readable;

// 创建可读流的时候 需要继承Readable 并且实现_read方法
// _read 是生产数据的逻辑
// _read 方法通过push(data)将数据放入可读流
// 读完生产数据后 push(null)
// 可读流结束后 不能再调用push（data）
class ToReabable extends Readable {
  constructor (iterator) {
    super();
    this.iterator = iterator;
  }

  _read() {
    const res = this.iterator.next();
    if(res.done) {
      // 数据源已经消耗完了， 通过psuh null 通知流
      return this.push(null);
    }
    process.nextTick(() => this.push(res.value + '\n'))
  }
}

const iterator = function (limit, conntent) {

  return {
    next: function() {
      if(limit--) {
        return {
          done: false,
          value: `current content is ${JSON.stringify(conntent)}`
        }
      }
      return {
        done: true
      }
    }
  }
}(2, rr)

const readable = new ToReabable(iterator);

readable.on('data', data => process.stdout.write(data))

readable.on('end',() => process.stdout.write('done'))
// writable
const Writeable = require('stream').Writable;

const writeable = Writeable();

writeable._write = function(data, enc, next) {
  // 将流中数据输出
  process.stdout.write(data.toString().toUpperCase());
  // 写入完成，通知流传入下一个数据
  process.nextTick(next)
}

writeable.on('finish', () => process.stdout.write('done'))


writeable.write('a' + '\n')
writeable.write('c' + '\n')
writeable.write('d' + '\n')
writeable.write('e' + '\n')

writeable.end()

// Duplex
const Duplex = require('stream').Duplex;

const duplex = Duplex();
// 生产数据
duplex._read = function() {
  this._readNum = this._readNum || 0;

  if(this._readNum > 1) {
    this.push(null)
  } else {
    this.push(`${this._readNum++}`);
  }
}

duplex._write = function (buf, enc, next) {
  process.stdout.write(`_write ${buf.toString()} \n`)
  next();
}

duplex.on('data', data => console.log(`ondata = ${data.toString()}`))

duplex.write('a')
duplex.write('b')
duplex.write('c')
duplex.write('d')
duplex.write('e')

duplex.on('finish', () => console.log('done'))

duplex.end();
// TransForm
// 可读中数据0， 1
// 可写流中的数据a，b, c

// 在Transform中可写端写入的数据，经过自动变换后可以自动添加到可读流
