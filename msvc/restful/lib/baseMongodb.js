/**
 * @description 封装 mongodb api
 */
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://berlin:berlin0211@cluster0-shard-00-00.jioi1.mongodb.net:27017,cluster0-shard-00-01.jioi1.mongodb.net:27017,cluster0-shard-00-02.jioi1.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-whlnqq-shard-0&authSource=admin&retryWrites=true&w=majority";

let baseMongodb;

class BaseMongodb {
  constructor () {
    this.mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    this.mongoClient.connect(err => {
      if(err){
          console.log('connect db error', err);
          return;
      }
      this.client = this.mongoClient;
    });
  }

  async getClient() {
    if(!this.client) {
        this.client = await this.mongoClient.connect();
    }
    return this.client;
  }
}

module.exports = () => {
  if(!baseMongodb){
     baseMongodb = new BaseMongodb();
  }
  return baseMongodb;
}