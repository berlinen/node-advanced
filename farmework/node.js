const http = require('http')
const url = require('url')

const app = http.createServer(function(req, res) {
  // req 可读流 data end 事件

  // res 可写流 write end事件
  const { pathname, query } = url.parse(req.url, true);
  console.log('pathname', pathname)
  console.log('query', query)

  const arr = [];

  req.on('data', function(chunk) {
    arr.push(chunk)
  });

  req.on('end', function() {
    const result = Buffer.concat(arr).toString();
    console.log('result ==== ', result)
  })

  if(pathname === '/') {
    // 首页route
  }

  res.end(pathname)
})

app.listen(3000, () => {
  console.log('server started at 3000')
})

// curl 模拟 post  curl -v -X POST -d "a=1&b=2" http://localhost:3000