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
}