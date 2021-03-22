// node  => this
name = 'name1'

exports.name = "name3"

var obj = {
  name: 'name2',
  getname: function () {
    console.log(this.name)
  }
}

obj.getname(); // name2

var getname = obj.getname;

getname(); // undefined

console.log(this.name);

// 在当前模块打印this 输出的不是global对象 而是module.exports

// galobal

process.on('exit', function(code) {
  setTimeout(() => {
    console.log('位置1')
  }, 0)
  console.log('位置2=' + code)
})

console.log('程序执行结束')