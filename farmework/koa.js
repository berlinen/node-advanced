const Koa = require('koa');
const Router = require('koa-router');
// koa-static
// koa-boody
// koa-premeter // 校验参数

const app = new Koa();
const router = new Router();

function sleep (n) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, n * 1000);
  })
}

// router.get('/', (ctx, next) => {
//   console.log('on')
//   ctx.body = 'Hello World!';
// })

// koa 中间件
app.use(async (ctx, next) => {
  // ctx.req === ctx.resquest.req ctx封装
  // ctx.res === ctx.response.res  ctx封装
  // ctx.resquest 原声node request
  // ctx.response 原声node response
  // koa => context
  // koa -> 中间件 1.0 generator 2.0 async
  // 可以使用异步
  await sleep(2);
  ctx.body = '222';
  // setTimeout(() => {
  //   ctx.body = '222'; //不会输出
  // }, 2000)
  console.log('gloabal middleware');
  await next();
})


app
  .use(router.routes())
  .use(router.allowedMethods());

// 错误事件
app.on('error', function(err, ctx) {
  console.log(err);
  ctx.res.send('error');
})

app.listen(3001, () => {
  console.log('app started on 3001 port')
})