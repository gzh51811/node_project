const Koa = require('koa');

const static = require('koa-static');

const routers = require('./api/routers');
// 创建koa应用
const app = new Koa();
app.context.myname = '1811'
// 创建静态资源服务
app.use(static('./'));
// app.use(static('./html'));
app.use(routers.allowedMethods());

app.use(routers.routes());



// 监听1811端口
app.listen(1811, () => {
    console.log('server is running on http://localhost:1811');
})

// router.get('/', async(ctx, next) => {
//     let { _id, name, shop, priceOld, priceNow, classify, stock, time, quality, state, logo, description, update } = ctx.query
//         //修改商品数据
//     if (update == 'true') {
//         let data = { name, shop, priceOld, priceNow, classify, stock, time, quality, state, logo, description };
//         let res = await db.update('goods', { _id: db.ObjectId(_id) }, { $set: data });
//         ctx.body = res;
//         // 用该商品的id查询数据
//     } else {
//         let res = await db.find('goods', { _id: db.ObjectId(_id) });
//         ctx.body = res;
//     }



// })