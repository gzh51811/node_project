const Router = require('koa-router');

const db = require('../db');

// 创建路由
var router = new Router();

router.get('/', async (ctx, next) => {

    let { username, page, limit, del } = ctx.query;
    if (del == 'true') {
        if (username) {
            console.log(username)
            await db.delete('user', { username});
            ctx.body = {
                code: 0,
            }
        }
    } else {
        let res = await db.find('user', {});
        let arr = res.slice((page - 1) * limit, page * limit);
        res = {
            code: 0,
            data: arr,
            msg: "",
            count: res.length
        }
        ctx.body = res;
    }


    // 关闭数据库，避免资源浪费


})

// router.get('/username', async (ctx, next) => {
//     let { username } = ctx.query;
//     // console.log(username);




// })







module.exports = router;