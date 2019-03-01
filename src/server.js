const Koa = require('koa');

const static = require('koa-static');

// 路由
const routers = require('./api/routers');

// 创建koa应用
const app = new Koa();

// 创建静态资源服务
app.use(static('./'));

app.use(static('./html'));

app.use(routers.routes());


// 监听1811端口
app.listen(1811, () => {
    console.log('server is running on http://localhost:1811');
})