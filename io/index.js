const Koa = require('koa');

const app = new Koa();

const logCenter = require('./middleware/log')

app.use(logCenter());

app.listen(3000, () => console.log(`Example app listening on port 3000!`));