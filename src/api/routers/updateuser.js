const Router = require('koa-router');

const db = require('../db');

// 创建路由
var router = new Router();

router.get('/', async (ctx, next) => {
    // let {page,limit,key} = ctx.request.body;
    // let pages=1;
    let { _id, username,password, usex, upone, uemail, utext, updat, rander } = ctx.query;
    // console.log(_id);
    if (rander == 'true') {
        let res = await db.find('user', { _id: db.ObjectId(_id) });
        ctx.body = {
            code: 0,
            data: res,
            msg: '',
            count: res.length
        }
    } else {
        let data = { username, password, usex, upone, uemail, utext };
        console.log(_id)
        let res=await db.update('user', { _id: db.ObjectId(_id) }, { $set: data });
        ctx.body = {
            code: 0,
            data: res,
            msg: '',
            count: res.length
        }
    }



    // 关闭数据库，避免资源浪费


})

// router.get('/username', async (ctx, next) => {
//     let { username } = ctx.query;
//     // console.log(username);




// })







module.exports = router;