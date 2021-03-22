// [a, b, c]
function sleep (n) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, n * 1000);
  })
}

const handlers = [
  async function (ctx, next) {
    console.log('1-1')
    await next()
    console.log('1-2')
  },
  async function (ctx, next) {
    console.log('2-1')
    await next()
    console.log('2-2')
  },
  async function (ctx, next) {
    console.log('3-1')
    await sleep(2);
    // await next();
    console.log('3-2')
  }
]
/**
 *
 * @param {*} handlers Function[]
 *
 * @return function fnCompose
 *
 * @function fnCompose
 * @params fnCompose => ctx next
 * @return Promise
 *
 * 执行第0个中间件， 并将ctx next 传入
 * fnCompose function () {}
 *
 * 执行第i中间件， 并返回promise
 * function next() {}
 *
 */
function compose(middlewars) {
  return function(ctx, next) {
    let index = -1;
    // 执行第i个中间件
    function dispatch(i) {
      if(index >= i) {
        return Promise.reject('next called multiple time');
      }

      const fn = middlewars[i];

      index = i;

      if(i === middlewars.length) fn = next;

      if(!fn) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i + 1))
        );
      } catch (e) {
        return Promise.reject(e);
      }

    }
    // 执行第0个中间件
    return dispatch(0);
  }
}

const fnCompose = compose(handlers)
const context = {};

fnCompose(context, () => console.log('next')).then(() => {
  console.log('通过ctx.body 设置res.end')
}).catch(err => {
  console.log('err', err)
})


function composes(middlewares) {
  return function(ctx, next) {
    let index = -1;
    function dispatch (i) {
      if(index >= i) {
        return Promise.reject('next called multiple times');
      }

      const fn = middlewares[i];

      if(i === middlewares.length) fn = next;

      if(!fn) {
        return Promise.reject('fn is not reject')
      }

      index = i;

      try {
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i+1))
        )
      } catch (e) {
        return Promise.reject('err', e)
      }
    }
    dispatch(0)
  }
}