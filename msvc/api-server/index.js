const htttp = require('http');
const url = require('url');
const querystring = require('querystring');
const { setResInfo, queryData } = require('./utils');

/**
 * 创建http
 *
 */

 const server = htttp.createServer(async(req, res) => {
  // 获取get参数
  const pathname = url.parse(req.url).pathname;
  paramStr = url.parse(req.url).query;
  param = querystring.parse(paramStr);
  console.log('param', param)
  // 过滤非拉取用户信息请求
  if('/v1/userinfo' !== pathname) {
    return setResInfo({
      res,
      ret: false,
      message: 'path not found',
      dataInfo: null,
      httpStatus: 404
    });
  };
  //参数校验，没有包含参数时返回错误
  if(!param || !param['user_ids']) {
    return setResInfo({
      res,
      ret: false,
      message: 'params err'
    })
  };

  // 从db 查询数据， 并获取， 有可能返回值
  const userInfo = await queryData({
    id: {
      $in: param['user_ids'].split(',')
    }
  });

  return setResInfo({
    res,
    ret: true,
    message: 'success',
    dataInfo: userInfo
  })

 });

 /**
  * 启动服务
  */

  server.listen(5000, () => {
    console.log('server start http://127.0.0.1:5000');
  });