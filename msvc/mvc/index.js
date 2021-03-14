const http = require('http');
const url = require('url');
const querystring = require('querystring');

const { setResInfo } = require('./util');

const routerMapping = {
  '/v1/contents': {
    controller: 'content',
    method: 'list'
  },
  './v1/test': {
    controller: 'test',
    method: 'test'
  }
}

const server = http.createServer(async (req, res) => {
  const pathname = url.parse(req.url).pathname;

  if(!routerMapping[pathname]) {
    return setResInfo({
      res,
      ret: false,
      msessage: 'path not found',
      dataInfo: null,
      httpStatus: 404
    })
  }

  const ControllerClass = require(`./controller/${routerMapping[pathname]['controller']}`)

  try {

    const controllerObj = new ControllerClass(res, req);
     // 判断是否为异步 promise 方法，如果是则使用 await
    if(controllerObj[routerMapping[pathname]['method']][Symbol.toStringTag] === 'AsyncFunction') {
      return await controllerObj[routerMapping[pathname]['method']]();
    } else {
      return controllerObj[routerMapping[pathname]['method']]();
    }
  } catch (err) {
    console.log('console.error();', err);
    return setResInfo({
      ret: false,
      res,
      message: 'server error',
      dataInfo: null,
      httpStatus: 500
    })
  }
})

server.listen(3000, () => console.log('server start http://127.0.0.1:3000'))
