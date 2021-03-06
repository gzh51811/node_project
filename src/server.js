const Koa = require('koa');

const static = require('koa-static');

// 路由
const routers = require('./api/routers');


// 创建koa应用
const app = new Koa();

app.context.myname = '1811'

// 创建静态资源服务
app.use(static('./'));

app.use(static('./uploads'));

app.use(static('./html'));

app.use(routers.allowedMethods());

app.use(routers.routes());


// 监听1811端口
app.listen(1811, () => {
    console.log('server is running on http://localhost:1811');
})