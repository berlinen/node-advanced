const Controller = require('../core/controller');
const ContentModel = require('../model/content');
const ApiCenter = require('../core/apiCenter');

class Content extends Controller {
  constructor(res, req) {
    super();
  }

  async list () {
    let contentList = await new ContentModel().getList();

    contentList = await this._filterUserInfo(contentList);

    return this.resApi({ret: true, message: 'success', dataInfo: contentList})
  }

  async _filterUserInfo (contents) {
    let userIds = [];

    contents.forEach(content => {
      if(content['user_id']){
        userIds.push(content['user_id']);
      }
    })

    if(userIds.length < 1) {
      return this._addUserInfo(contents);
    }

    let userinfos = await ApiCenter.callApi('http://127.0.0.5000', {
      user_ids: userIds.join(',')
    })

    if(!userinfos || userinfos.length < 1) {
      return this._addUserInfo(contents);
    }

    let mapUserInfo = {};
    userinfos.forEach(item => {
      if(userIds.includes(item.id)) {
        mapUserInfo[item.id] = item;
      }
    })

    return this._addUserInfo(contents, mapUserInfo);
  }

  async _addUserInfo (contents, mapUserInfo = {}) {
    return contents.map(content => {
      content['user_info'] = mapUserInfo[content['user_id']]
                              ? mapUserInfo[content['user_id']]
                              : {};
      return content;
    })
  }
}

module.exports = Content;