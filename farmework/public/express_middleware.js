// function a () {
//   console.log('1-1');
//   b();
//   console.log('1-2')
// }

// function b () {
//   console.log('2-1');
//   c();
//   console.log('2-2')
// }

// function c () {
//   console.log('3-1');
//   console.log('3-2')
// }

// a()


// [
//   [a, b, c], // Functiom[]
//   [d]
// ]

// [a, b, c] a b c 手动执行a 由a自己决定何时执行b b自己决定何时zhixing1c
/**
 *
 * @param {*} handlers Function[]
 * @return undefined
 * 执行第0个中间件，并将next函数传入
 *
 * 实现一个next函数，执行第i中间件，并将next传入
 *
 * [a, b, c] a -> b -> c
 *
 */
function innerProcess(handlers, outNext) {
  let idx = 0;

  function next() {
    if(idx >= handlers.length) return outNext();
    handlers[idx++](next);
  }

  next()
}
/**
 *
 * @param {*} handlers 是一个二维数组 Function[][]
 * [
 *  [a, b,c]
 *  [d,e]
 * ]
 */
function outerProcess (handlers, done) {
  let idx = 0;

  function next() {
    if(idx >= handlers.length) return done();
    innerProcess(handlers[idx++], next);
  }

  next();
}

const middlewars = [
  [
    function a (next) {
      console.log('1-1');
      next();
      console.log('1-2')
    },

    function b (next) {
      console.log('2-1');
      next();
      console.log('2-2')
    },

    function c (next) {
      console.log('3-1');
      next();
      console.log('3-2')
    }
  ],
  [
    function d (next) {
      console.log('4-1');
      next();
      console.log('4-2')
    },

    function e (next) {
      console.log('5-1');
      next();
      console.log('5-2')
    },

    function f (next) {
      console.log('6-1');
      next();
      console.log('6-2')
    }
  ],
  [
    function g (next) {
      console.log('7-1');
      next();
      console.log('7-2')
    },

    function h (next) {
      console.log('8-1');
      next();
      console.log('8-2')
    },

    function i (next) {
      console.log('9-1');
      console.log('9-2')
      next();
    }
  ]
]

outerProcess(middlewars, () => console.log('done'));


function inner (handlers, nextFunc) {
  let idx = 0
  function next() {
    if(idx >= handlers.length) return nextFunc();
    handlers[idx++](next)
  }
  next()
}

function outer(handlers, done) {
  let idx = 0;
  function next() {
    if(idx >= handlers.length) return done();
    inner(handlers[idx++], next);
  }
  next();
}