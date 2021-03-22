// timers

// pedding callabck

// idel

// poll

// check

// close callback

/**
 * 1 timers: setTimeout, setInterval的回调
 *
 * 2 pedding  推迟到下一个循环迭代的I/o回调  比如 fs.readFile(path, callback)
 *
 * 3 idle, prepare 系统内部使用
 *
 * 4 poll 执行与I/o相关的回调 除了 timers， close callback，setImmediate 其他回调都在这里执行
 *
 * 5 check setImediat回调
 *
 * 6 close callbackss 一些关闭回调 socket.on('close', () => {});
 */

/**
 * setImediate 和 setTimeout 区别
 *
 * 基本行为类似 但是在不同时机下调用，行为会发生改变
 *
 * setImediate 在当前poll阶段完成后执行
 *
 * setTimeout 以毫秒最小，执行脚本
 *
 *
 */

// 1.主模块执行

setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('imemediate')
})

// 在主模块中并且timeout为0的时候，输出顺序不固定
// 因为 两种情况
// timers队列可能为空 => check immediate => timers timeout
// timers队列可能不为空 timers timeout => check immediate

// 2. 在同一个i/o回调中 immediate 总是在timeout前边；

const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)

  setImmediate(() => {
    console.log('imemediate')
  })
})

// process nexttick 在每个阶段执行后都会执行nexttick

/**
 * 微任务
 *
 * Node
 *
 * nextTick > promise.then
 *
 */
const fs = require('fs');
async function async1() {
  console.log('async1 start');
  await async2();
  // new Promise((resplve) => {
  //   console.log('async2');
  //   resplve()
  // }).then(() => {
  //   console.log('async1 end')
  // })
  console.log('async1 end')
}

async function async2() {
  console.log('async2');
}

console.log('script start');

fs.readFile(__filename, () => {
  console.log('fsstart')
  setTimeout(() => {
    console.log('fstimeout')
  }, 0)

  setImmediate(() => {
    console.log('fsimemediate')
  })
})

setTimeout(() => {
  console.log('setTimeout0');
  setTimeout(() => {
    console.log('setTimeout1');
  }, 0)
  setImmediate(() => console.log('immediate'))
}, 0)

process.nextTick(() => console.log('nextTick'));

async1();

new Promise((resolve) => {
  console.log('promise1')
  resolve();
  console.log('promise2')
}).then(() => {
  console.log('promise 3')
})

console.log('script end')


// 'script start'
// 'async1 start'
// 'async2'
// 'promise1'
// 'promise2
// 'script end
// nextTick
// async1 end
// promise 3
// setTimeout0
// immediate
// setTimeout1
// fsstart
// fsimemediate
// fstimeout





