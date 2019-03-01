const Router = require('koa-router');

const db = require('../db');

// 创建路由
const router = new Router();


/**
 * ctx
 */
router.get('/', async(ctx, next) => {
    let { _id, dele, deArr } = ctx.query;
    if (dele == 'true') {
        if (_id) {
            // 删除商品
            await db.delete('goods', { _id: db.ObjectId(_id) });
            // 查询删除的商品是否还存在在数据库中，若
            var res = await db.find('goods', { _id: db.ObjectId(_id) });
            if (res == '') {
                ctx.body = 200;
            } else {
                ctx.body = 404;
            }
        } else if (deArr) {
            deArr = JSON.parse(deArr);
            // 遍历每个ID
            deArr.map(async(item, index) => {
                // 删除商品
                await db.delete('goods', { _id: db.ObjectId(item) });
                // 查询删除的商品是否还存在在数据库中，若
            })
            ctx.body = 200;
        }
    } else {
        //查询商品
        var res = await db.find('goods', {});
        res = {
            code: 0,
            count: 1000,
            data: res,
            msg: ""
        }
        ctx.body = res;
    }
})

module.exports = router;