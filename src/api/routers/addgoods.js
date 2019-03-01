const Router = require('koa-router');

const db = require('../db');

// 创建路由
const router = new Router();


/**
 * ctx
 */
router.get('/', async(ctx, next) => {
    let { name, shop, priceOld, priceNow, classify, stock, time, quality, state, logo, description, insert } = ctx.query
    if (insert == 'true') {
        let data = { name, shop, priceOld, priceNow, classify, stock, time, quality, state, logo, description };
        let res = await db.insert('goods', data);
        ctx.body = res;
    }

})


module.exports = router;