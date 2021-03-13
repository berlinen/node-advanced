const baseMongodb = require("./lib/baseMongodb")();

/**
 *
 * @description 设置响应数据
 * @param object res http res
 * @param boolean ret boolean
 * @param string message string
 * @param object dataInfo object
 * @param int httpStatus
 */
function setResInfo({res, ret, message, dataInfo, httpStatus = 200}) {
 
  let retInfo = {};
  if(!ret) {
    retInfo = {
      ret: -1,
      message: message ? message : 'error',
      data: {}
    };
  } else {
    retInfo = {
      ret: 0,
      message: message ? message : 'success',
      data: dataInfo ? dataInfo : {}
    }
  }
  res.writeHead(httpStatus, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify(retInfo));
  res.end();
  return;
}
/**
 *
 * @description db 数据查询
 * @param object queryOption
 */
async function queryData (queryOption) {
  const client = await baseMongodb.getClient();
  const collection = client.db('nodejs_column').collection('content');
  const queryArr = await collection.find(queryOption).toArray();

  return queryArr;
};

module.exports = {
  setResInfo,
  queryData
}