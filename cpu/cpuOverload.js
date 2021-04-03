const platform = process.platform;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os');
const { pid } = require('process');

let overloadTimes = 0; // 指 CPU 过载持续次数
let isOverload = false;
let currentCpuPercentage = 0; // 指 CPU 当前负载越高，占用率越大则丢弃概率越大
let currentProbability = 0; //负载最大时的丢弃概率，

let removeCount = 0;

const maxValue = (10 * Math.exp(10)).toFixed(4);
const maxUser = 5000;
const canAccessList = [];

class CpuOverload {
  /**
   *
   * @param {*} maxOverloadNum 表示最大持续超出负载次数，
   * @param {*} maxCpuPercentage 表示单次 CPU 使用率是否大于该分位值，
   * @param {*} baseProbability 负载最大时的丢弃概率，取值范围为 0 ~ 1。
   * @param {*} whiteList 白名单
   */
  constructor(maxOverloadNum = 30, maxCpuPercentage = 90,baseProbability=0.9, whiteList=[]) {
    this.maxOverloadNum = maxOverloadNum;
    this.maxCpuPercentage = maxCpuPercentage;
    this.baseProbability = baseProbability;
    this.whiteList = whiteList;
  }
  /**
   * @description 判断服务器当前是否可用
   * @param {*} path
   * @param {*} uuid
   */
  isAvailable(path, uuid = false) {
    if(path && this.whiteList.includes(path)) {
      // 判断是否在白名单内
      return true
    }
    if(uuid && canAccessList,includes(uuid)) {
      // 判断是否已经放行过
      return true;
    }
    if(isOverload) {
      if(this._getRandomNum() <= currentProbability) {
        removeCount++;
        return false;
      }
    }
    // 需要将 uuid 加入到放行数组
    if(uuid) {
      if(canAccessList.length > maxUser) {
        canAccessList.shift();
      }
      canAccessList.push(uuid);
    }
    return true;
  }
  /**
   * 定时校验服务器是否过载
   */
  async check() {
    // 定时处理逻辑
    setInterval(async () => {
      try {
        const cpuInfo = await this._getProcessInfo();
        if(!cpuInfo)  return;
        currentCpuPercentage = cpuInfo;

        if(cpuInfo > this.maxCpuPercentage) {
          // 当 cpu 持续过高时，将当前的 overloadTimes 计数+1
          overloadTimes++;
        } else {
          // 当低于 cpu 设定值时，则认为服务负载恢复，因此将 overloadTimes 设置为 0
          overloadTimes = 0;
          return isOverload = false;
        }

        if(overloadTimes > this.maxOverloadNum) {
          //当持续出现 cpu 过载时，并且达到了我们设置上线，则需要进行请求丢弃了
          isOverload = true;
        }
        this._setProbability();
      } catch (err) {
        console.log(err);
        return;
      }
    }, 2000)
  }

  /**
   * @description 获取进程信息
   */
   async _getProcessInfo () {
    let pidInfo, cpuInfo;

    if(platform === 'win32') {
      pidInfo = await this._getWmic();
    } else {
      pidInfo = await this._getPs();
    }

    cpuInfo = await this._parseInOs(pidInfo);
    // 异常处理
    if(!cpuInfo || cpuInfo === '') {
      return false;
    }
    //  命令行数据，字段解析处理
    console.log(parseFloat(cpuInfo));
    return parseFloat(cpuInfo).toFixed(4);
   }

  /**
   * @description 使用 ps 命令获取进程信息
   */
  async _getPs () {
    // cmd
    const cmd = `ps -p ${process.pid} -o pcpu`;

    // 获取执行结果
    const { stdout, stderr } = await exec(cmd);

    if(stderr) return err;

    return stdout;
  }

  _getWmic () {
    const cols = 'IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes';
    const cmd  = 'wmic path Win32_PerfFormattedData_PerfProc_Process get ' + cols + ' /format:csv';

    const { stdout, stderr } = await exec(cmd);
    console.log(stdout);
    return stdout;
  }

  async _parseInOs(pidInfo) {
    let lines = pidInfo.trim().split(os.EOL);
    if(!lines || lines.length < 2) {
      return false;
    }
    let cpuStr = lines[1];
    return cpuStr.trim();
  }

  async _parseInWin() {

  }

   /**
    * @description 获取丢弃概率
    */
   async _setProbability () {
    let o = overloadTimes >= 100 ? 100 : overloadTimes; // 指 CPU 过载持续次数，该值越高则丢弃概率越大，
    let c = currentCpuPercentage >= 100 ? 10 : currentCpuPercentage/10; // 指 CPU 当前负载越高，占用率越大则丢弃概率越大，
    let b = this.baseProbability;  // 用 b 表示，是负载最大时的丢弃概率，取值范围为 0 ~ 1。
    currentProbability = ((0.1 * o) * Math.exp(c) / maxValue * b).toFixed(4);
   }
   /**
    * @description 获取一个概率值
    */
    _getRandomNum () {
      return Math.random().toFixed(4);
    }
}

module.exports = CpuOverload;
