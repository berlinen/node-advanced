/**
 * params 字节长度
 */
const buffer = new ArrayBuffer(8);

const init16Buffer = new Int16Array(buffer); // [ 0, 0, 0, 0 ]

const unit8 = new Uint8Array(2); //[ 0, 0 ]



// node.js
// 创建一个长度为10， 填充为1的Buffer
const buf1 = Buffer.alloc(10, 1);

// allocUnsafe 比 alloc 更快 但是 allocUnsafe 创建的缓冲区可能存在旧数据；
const buf2 = Buffer.allocUnsafe(10)

const buf3 = Buffer.from('hello wrold', 'ascii'); // <Buffer 68 65 6c 6c 6f 20 77 72 6f 6c 64>

const buf4 = Buffer.from('hello wrold', 'base64'); // <Buffer 85 e9 65 a3 0a e8 95>


console.log(buf3)
console.log(buf4.toString('base64'))


