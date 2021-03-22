const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express() // koa const app = new Koa();

// 限制中间件执行路径
app.use('/assets', express.static(path.resolve(__dirname, './public/')));

app.use(bodyParser.urlencoded()); // 在请求头体内戏赠body对象

app.use(cookieParser()); // 增加 req.cookies

app.use('/user', function(req, res, next) {
  console.log('need auth')
  if(req.query.id) {
    // auth 通过
    next()
  } else {
    // auth 没有通过
    next(new Error('需要鉴权'))
  }
})


app.get('/', function(req, res) {
  res.send('this is home page')
})

app.post('/', function(req, res) {
  console.log('req.body ==', req.body);
  res.send('this is home page post')
})

app.get('/user/:userId', function(req, res) {
  console.log('query==', req.query);
  console.log('params==', req.params);
  console.log('user error')
  res.send('this is user page')
})

app.use('/user', function(err, req, res, next) {
  res.send(err.message)
})

app.listen(3000, () => {
  console.log('express started on 3000')
})