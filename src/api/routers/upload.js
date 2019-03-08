const Router = require('koa-router');

const db = require('../db');

// 创建路由
const router = new Router();


router.post('/', async(ctx, next) => {
    ctx.body = JSON.stringify(ctx.request.files);
    var res = {
        "code": 0,
        "msg": "",
        "data": {
            "src": ctx.body
        }
    }
    ctx.body = res;
})


module.exports = router;