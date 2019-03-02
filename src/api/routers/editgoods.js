const Router = require('koa-router');

const db = require('../db');

// 创建路由
const router = new Router();


/**
 * ctx
 */
router.get('/', async(ctx, next) => {
    let { _id, name, shop, priceOld, priceNow, classify, stock, time, quality, state, logo, description, update } = ctx.query
        //修改商品数据
    if (update == 'true') {
        let data = { name, shop, priceOld, priceNow, classify, stock, time, quality, state, logo, description };
        let res = await db.update('goods', { _id: db.ObjectId(_id) }, { $set: data });
        ctx.body = res;
        // 用该商品的id查询数据
    } else {
        let res = await db.find('goods', { _id: db.ObjectId(_id) });
        ctx.body = res;
    }



})


module.exports = router;