const Router = require('koa-router');

const db = require('../db');

// 创建路由
var router = new Router();

//添加用户
router.get('/',async (ctx, next) =>{
    console.log(ctx.query.username);
    let{username,password,usex,upone,uemail,utext}=ctx.query;
    let data = {username,password,usex,upone,uemail,utext,add_time:new Date().toLocaleString( )};
    let res = await db.insert('user',data);
    ctx.body = res
    

})

module.exports = router;