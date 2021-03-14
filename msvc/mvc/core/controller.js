const { setResInfo } = require('../util');

class Controller {
  constructor(res, req) {
    this.res = res;
    this.req = req
  }

  resApi({ ret, message, dataInfo, httpStatus = 200 }) {
    setResInfo({
      res: this.res,
      ret,
      message,
      dataInfo,
      httpStatus
    })
  }
}

module.exports = Controller;