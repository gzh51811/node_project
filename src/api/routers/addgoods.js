const Router = require('koa-router');

const db = require('../db');

// 创建路由
const router = new Router();


/**
 * ctx
 */
router.get('/', async(ctx, next) => {
    console.log(ctx.query)
})

module.exports = router;