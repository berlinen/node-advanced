const cluster = require('cluster');

const instances = 2; // 启动进程数量

if(cluster.isMaster) {
  console.log(1)
  for(let i = 0; i < instances; i++) {
    cluster.fork();  // 使用 cluster.fork 创建子进程
  }
} else {
  console.log(2)
  require('./app');
}