const fsPromise = require('fs').fsPromise;
const fs = require('fs');

const logFilePath = `${__dirname}/../log`;
const fileStreams = {};
const cacheLogStr = {};

/**
 * 日志模块
 */

class Log {
  /**
   *
   * @param {*} cacheEnable 是否开启
   * @param {*} cacheTime // 缓存事件
   * @param {*} maxLen  // 最大文件个数
   * @param {*} maxFileStream // 最大单个文件大小
   */
  constructor(cacheEnable = true, cacheTime = 2000, maxLen = 100000, maxFileStream = 1000) {
    this.cacheTime = cacheTime;
    this.cacheEnable = cacheEnable;
    this.maxLen = maxLen;
    this.maxFileStream = maxFileStream;
    this.currentFileStreamNum = 0;
  }

  /**
   * @description 启动日志定时写入
   */
  start() {
    this._intervalWrite();
  }

  /**
   * @description 写入日志
   * @param {string}} fileType 日志模块
   * @param {string|json} logInfo 日志信息
   */
  info (fileType, logInfo) {
    if(!fileType || !logInfo) {
      return;
    }
    this._flush(fileType, logInfo);
  }
  /**
   * @description 定时写入文件
   */
  _intervalWrite() {
    setInterval(() => {
      if(Object.keys(cacheLogStr).length < 1) { // 空数据不处理
        return;
      }

      for(let fileType in cacheLogStr) { // 遍历需要写入的日志信息
        if(cacheLogStr[fileType]) {// 空数据，需要清理句柄
          this._clean(fileType).then();
          continue;
        }
        // 写入日志，写入完成后，需要清理当前的日志缓存，注意这里可能会导致日志丢失
        this._addLog(fileType, cacheLogStr[fileType]).then(() => {
          cacheLogStr[fileType] = '';
        })
      }
    }, this.cacheTime)
  }
  /**
   * @description 根据缓存情况，判断是否将日志写入文件，还是写入缓存
   * @param {string}} fileType 日志模块
   * @param {string|json} logInfo 日志信息
   */
  _flush(fileType, logInfo) {
    if(!fileType) { // 数据校验
      return
    }
    let logStr = logInfo;

    if(typeof logInfo === 'object') {
      logStr = JSON.stringify(logInfo)
    }

    if(logStr === '' || !logStr) {
      return;
    }

    if(!this.cacheEnable) { // 缓存关闭，直接写日志
      return this._addLog(fileType, cacheLogStr[fileType])
    }

    if(!cacheLogStr[fileType]) {// 判断是否已经有缓存
      return cacheLogStr[fileType] = `${logStr}`;
    }

    if(cacheLogStr[fileType].length < this.maxLen) {
      // 判断是否已经超出缓存最大长度
      return cacheLogStr[fileType] = `${cacheLogStr[fileType]}\n${logStr}`;
    } else {
      return this._addLog(fileType, cacheLogStr[fileType]);
    }
  }
  /**
   * @description 将日志信息，根据文件流写入文件
   * @param {*} fileType 日志文件
   * @param {*} data 日志字符串信息
   */
  async _addLog(fileType, data) {
    const fileStream = await this._getFileStream(fileType);
    try {
      fileStream.write(`${data}\n`, 'utf8')
    } catch(err) {
      console.log(err)
    }
  }
  /**
   * @desc 获取日志路径
   * @param {*} fileType
   */
  _getFilePath(fileType) {
    return `${logFilePath}/${fileType}.log`
  }
  /**
   * @desc 获取文件流句柄
   * @param {string} fileType
   */
  async _getFileStream(fileType) {
    if(fileStreams[fileType]) {
      return fileStreams[fileType]
    }
    const filePath = this._getFilePath(fileType);

    await fsPromise.stat(filePath).catch(async err => {
      if(err.code === 'ENOENT') {
        await fsPromise.writeFile(filePath, '');
      }
    })

    const fileStream = fs.createWriteStream(filePath, { encoding: 'utf-8', flags: 'a' });

    if(this.currentFileStreamNum < this.maxFileStream) {
      this.currentFileStreamNum++;
      return fileStreams[fileType] = fileStream;
    }

    return fileStream;
   }
   /**
    * @description 清理短期未使用的句柄和缓存对象，避免缓存过大，或者未使用文件占用空间
    * @param {*} fileType
    */
   async _clean(fileType) {
    let fileStream = await this._getFileStream(fileType)

    delete cacheLogStr[fileType];
    delete fileStreams[fileType];

    this.currentFileStreamNum--;

    if(!fileStream) return;
    fileStream.end();
   }
}

module.exports = Log;