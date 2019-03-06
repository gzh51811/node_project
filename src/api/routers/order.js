const Router = require('koa-router');

const db = require('../db');

// 创建路由
var router = new Router();


//获取所有订单
router.get('/', async (ctx, next) => {
    let { id,dele,name} = ctx.query;
    
    
    console.log(id)
    if (id ) {
        await db.delete('order', { id });
 
    } else {
        //获取所有分类
        // console.log(req.query);
        let res = await db.find('order', {});
        ctx.body = {
            code: 0,
            data: res,
            msg: "",

        }
    }

});




module.exports = router;