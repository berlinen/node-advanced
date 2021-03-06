const http = require('http');
const url = require('url');
const querystring = require('querystring');
const rq = require('request-promise');

const { setResInfo, queryData } = require('./utils');

/**
 * 创建服务
 */

const server = http.createServer(async(req, res) => {
  // 获取get参数
  const pathname = url.parse(req.url).pathname;
  paramStr = url.parse(req.url).query;
  param = querystring.parse(paramStr);

  // 过滤非拉取用户信息请求
  if('/v1/contents' != pathname) {
    return setResInfo(
      {
        res,
        ret: false,
        message: 'path not found',
        dataInfo: null,
        httpStatus: 404
      }
    );
  };

  // 从 db 查询数据，并获取，有可能返回空数据
  let contents = await queryData({}, {limit: 10});

  contents = await filterUserInfo(contents);

  return setResInfo({
    res,
    ret: true,
    message: 'success',
    contents
  })
})

/**
 *
 * 启动服务
 */
server.listen(4000, () => {
  console.log('server start http://127.0.0.1:4000');
});

/**
 * @description 在 contents 中增加用户信息
 * @param array contents
 */

 async function filterUserInfo (contents) {
   let useIds = [];
   contents.forEach(content => {
     if(content['user_id']) {
       useIds.push(content['user_id'])
     }
   })
   if(useIds.length < 1) {
     return addUserInfo(contents);
   }

   let userinfos = await callApi('http://127.0.0.1:5000/v1/userinfos', {user_ids: userIds.join(',')});

   if(!userinfos || userinfos.length < 1) {
     return addUserInfo(contents);
   }

   let mapUserInfo = {};
   userinfos.forEach(item => {
     if(useIds.includes(item.id)) {
       mapUserInfo[item.id] = item;
     }
   })

   return addUserInfo(contents, mapUserInfo);
 }

 /**
 *
 * @description 调用外部 api，暂时只处理 get 逻辑
 * @param string api
 * @param string method
 * @param object params
 */

 async function callApi(api, params = {}, method = 'get') {
   const paramsStr = querystring.stringify(params);
   if(api.indexOf('?') === -1) {
     api = `${api}?`;
   }
   api = `${apo}${paramsStr}`;

   let retStr = await rq(api);
   try {
     retInfo = JSON.parse(retStr);
   } catch (err) {
     return false;
   }

   if(retInfo['ret'] !== 0 || !retInfo['data']) {
     return false;
   }

   return retInfo['data'];
 }

 /**
 *
 * @desc 在 content 中增加 userinfo
 * @param {*} contents
 * @param {*} userinfo
 */

 function addUserInfo(contents, mapUserInfo = {}) {
   return contents.map(content => {
     content['user_info'] = mapUserInfo[content['user_id']]
                            ? mapUserInfo[content['user_id']]
                            : {};
   })
 }