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
        
        // ctx.body = {
        //     code: 0,
        //     data: res,
        //     msg: "success"
        // }
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


//删除订单信息

// router.delete('/del', urlencodedParser, async (req, res) => {
//     let { id } = req.body;
//     // var doc = req.query;
//     console.log(id);
//     let data
//     try {
//         data = await db.delete('order', { _id: ObjectID(id) });
//     } catch (err) {
//         data = err;
//     }

//     res.send(data);
// });



module.exports = router;