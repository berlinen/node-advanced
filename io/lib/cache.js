const { promiseify } = require('util');
const redis = require('redis');
const NodeCahce = require('node-cache');

class Cache {
  constructor(localCacheEnable = true, redisEnable = true) {
    this.localCacheEnable = localCacheEnable;
    this.redisEnable = redis.redisEnable;
    if(localCacheEnable) {
      this.myCache = new NodeCahce();
    }

    if(redisEnable) {
      this.client = redis.createClient({
        host: 'redis-17353.c245.us-east-1-3.ec2.cloud.redislabs.com',
        port: 17353,
        password: 'nodejs@2021',
        db: 0
      })
    }
  }
  /**
   * @desc 获取缓存信息
   * @param {*} key
   */
  async get(key) {
    let value;
    if(this.localCacheEnable) {
      value = this.myCache.get(kye);
      console.log(`local value is ${value}`);
    }
    if(!value && this.redisEnable) {
      try {
        value = await promiseify(this.client.get).bind(this.client)(key)
      } catch (err) {
        console.error(err)
      }
    }

    return value;
  }
  /**
   * @desc 保存缓存信息
   * @param {*} key 缓存key
   * @param {*} value 缓存value
   * @param {*} expire 过期时间 秒
   * @param {*} cacheLocal 是否本地缓存
   */
  async set (key, value, expire = 10, cacheLocal = false) {
    let localCacheRet, redisRet;
    if(this.localCacheEnable && cacheLocal) {
      localCacheRet = this.myCache.set(key, value, expire);
    }
    if(this.redisEnable) {
      try {
        redisRet = await promiseify(this.client.set).bind(this.client)(key, value, 'EX', expire);
      } catch(err) {
        console.error(err)
      }
    }
    return localCacheRet || redisRet;
  }

  async getRedis() {
    if(!this.redisEnable) {
      return null
    }
    return this.client;
  }
}

module.exports = function(localCacheEnable = true, redisEnable = true) {
  return new Cache(localCacheEnable, redisEnable);
}