const htttp = require('http');
const url = require('url');
const querystring = require('querystring');

const baseMongo = require('./lib/baseMongodb')();

/**
 * 创建http
 *
 */

 const server = htttp.createServer(async(req, res) => {
  // 获取get参数
  const pathname = url.parse(req.url).pathname;

 });

 /**
  * 启动服务
  */

  server.listen(5000, () => {
    console.log('server start http://127.0.0.1:5000');
  });