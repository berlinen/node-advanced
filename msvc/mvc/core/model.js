const baseMongo = require('./baseMongodb');

class Model {
  constructor () {
    this.db = 'berlin'
    this.baseMongo = baseMongo
  }

  async get(collectName) {
    const client = await this.baseMongo.getClient();
    const collection = client.db(this.db).collection(collectName);
    return collection
  }
}


module.exports = Model;