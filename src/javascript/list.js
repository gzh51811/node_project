jQuery(function($) {
    layui.config({
        version: '1545041465443' //为了更新 js 缓存，可忽略
    });

    layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
        var laydate = layui.laydate //日期
            ,
            laypage = layui.laypage //分页
            ,
            layer = layui.layer //弹层
            ,
            table = layui.table //表格
            ,
            carousel = layui.carousel //轮播
            ,
            upload = layui.upload //上传
            ,
            element = layui.element //元素操作
            ,
            slider = layui.slider //滑块

        //向世界问个好
        // layer.msg('略略略');

        // //监听Tab切换
        // element.on('tab(demo)', function(data) {
        //     layer.tips('切换了 ' + data.index + '：' + this.innerHTML, this, {
        //         tips: 1
        //     });
        // });
        // function getPicture(p) {
        //     return '<img src=' + p.logo + ' style="height:100%;">';
        // }
        //执行一个 table 实例
        table.render({
            elem: '#demo',
            height: 516,
            url: '/list', //数据接口

            title: '用户表',
            page: true, //开启分页
            id: 'idTest',
            toolbar: 'default', //开启工具栏，此处显示默认图标，可以自定义模板，详见文档

            cols: [
                [ //表头
                    {
                        type: 'checkbox',
                        fixed: 'left'
                    }, {
                        field: '_id',
                        title: 'ID',
                        width: 150,
                        fixed: 'left',
                    }, {
                        field: 'name',
                        title: '商品名称',
                        width: 150
                    }, {
                        field: 'logo',
                        title: '商品图片',
                        // style: 'height:100px;',
                        templet: function(p) {
                            return '<img src=' + p.logo + ' style="height:100%;">';
                        },
                        align: 'center',
                        minWidth: 50
                    }, {
                        field: 'shop',
                        title: '店铺',
                        width: 100
                    }, {
                        field: 'priceOld',
                        title: '原价',
                        width: 80
                    }, {
                        field: 'priceNow',
                        title: '现价',
                        width: 80
                    }, {
                        field: 'classify',
                        title: '分类',
                        width: 90
                    }, {
                        field: 'stock',
                        title: '数量',
                        width: 80
                    }, {
                        field: 'time',
                        title: '上架时间',
                        width: 110
                    }, {
                        field: 'quality',
                        title: '属性',
                        width: 80
                    }, {
                        field: 'state',
                        title: '状态',
                        width: 60
                    }, {
                        fixed: 'right',
                        width: 165,
                        align: 'center',
                        toolbar: '#barDemo'
                    }
                ]
            ]
        });

        // 点击搜索按钮，执行搜索事件，数据表格重载
        $('#searchBtn').on('click', function() {
            let searchVal = $('#search').val()
                //搜索表格重载
            table.reload('idTest', {
                url: '/list',
                // where传给后端的参数
                where: {
                    search: true,
                    searchVal
                }, //设定异步数据接口的额外参数
                //,height: 300
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        });

        $('.layui-body').on('click', 'img', function() {
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: `<img src="${this.src}">`
            });
        })


        //监听头工具栏事件
        table.on('toolbar(test)', function(obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data; //获取选中的数据
            switch (obj.event) {
                case 'add':
                    layer.confirm("确认到添加商品页面吗！", {
                        title: "确认提示"
                    }, function(index) {  
                        location.href = './addgoods.html';
                    });

                    break;
                case 'update':
                    if (data.length === 0) {
                        layer.msg('请选择一行');
                    } else if (data.length > 1) {
                        layer.msg('只能同时编辑一个');
                    } else {
                        layer.confirm('真的要编辑该商品吗！', function(index) {
                            //关闭弹窗
                            layer.close(layer.index);

                            //跳转传id
                            location.href = `./editgoods.html?_id=${checkStatus.data[0]._id}`;

                        });
                    }
                    break;
                case 'delete':
                    if (data.length === 0) {
                        layer.msg('请选择一行');
                    } else {
                        layer.confirm("确认要删除所选的商品吗！", {
                            title: "确认提示"
                        }, function(index) {  
                            // 获取所选的商品的id，并且组成数组
                            let deArr = data.map((item, index) => {
                                    return item._id
                                }).join(",").split(',')
                                //转成json字符串
                            deArr = JSON.stringify(deArr);
                            //向服务端发送删除指令
                            $.ajax({
                                type: "GET",
                                url: "/list",
                                data: {
                                    deArr,
                                    dele: true
                                },
                                traditional: true,
                                success(data) {
                                    layer.closeAll('loading');

                                    // console.log(data)
                                    //返回200则删除成功，反之删除失败
                                    if (data == 200) {
                                        parent.layer.msg('删除成功！', { icon: 6, time: 2000, shade: 0.2 }, function(index) {
                                            //一闪而过的提示效果
                                            location.reload(true);
                                        });
                                    } else {
                                        parent.layer.msg('删除失败！', { icon: 5, time: 3000, shade: 0.2 });
                                    }
                                }

                            });
                        });




                    }
                    break;
            };
        });

        // //监听行工具事件
        table.on('tool(test)', function(obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent === 'detail') {
                //查看操作
                (function notice() {
                    //示范一个公告层
                    layer.open({
                        type: 1, //层类型
                        title: '商品详情', //标题栏
                        closeBtn: false,
                        area: '500px;',
                        shade: 0.5,
                        id: 'LAY_layuipro', //设定一个id，防止重复弹出
                        btn: ['退出'],
                        btnAlign: 'c',
                        moveType: 1, //拖拽模式，0或者1
                        anim: 0, //弹出动画
                        //内容
                        content: `<div style="padding: 50px; line-height: 26px; background-color: #393D49; color: #fff; font-weight: 500;">
                                    <p><span>商品ID：</span><span style="margin-left:34px;">${data._id}</span></p>
                                    <p><span>商品名称：</span><span style="margin-left:20px;">${data.name}</span></p> 
                                    <p><span>商品店铺：</span><span style="margin-left:20px;">${data.shop}</span></p> 
                                    <p><span>商品原价：</span><span style="margin-left:20px;">${data.priceOld}</span></p> 
                                    <p><span>商品现价：</span><span style="margin-left:20px;">${data.priceNow}</span></p> 
                                    <p><span>商品分类：</span><span style="margin-left:20px;">${data.classify}</span></p> 
                                    <p><span>商品数量：</span><span style="margin-left:20px;">${data.stock}</span></p> 
                                    <p><span>上架时间：</span><span style="margin-left:20px;">${data.time}</span></p> 
                                    <p><span>商品属性：</span><span style="margin-left:20px;">${data.quality}</span></p>  
                                    <p><span>商品状态：</span><span style="margin-left:20px;">${data.state}</span></p>          
                                    <p><span>商品图片：</span><span style="margin-left:20px;"><img src="${data.logo}" style="height:200px;vertical-align:text-top;"\></span></p>      
                                  </div>`,
                        success: function(layero) {
                            var btn = layero.find('.layui-layer-btn');
                            btn.find('.layui-layer-btn0').attr({
                                target: '_blank'
                            });
                        }
                    });
                })();
            } else if (layEvent === 'del') {
                layer.confirm('真的删除该商品吗！', function(index) {

                    //向服务端发送删除指令
                    $.ajax({
                        type: "GET",
                        url: "/list",
                        data: {
                            _id: data._id,
                            dele: true
                        },
                        success(data) {
                            //返回200则删除成功，反之删除失败
                            if (data == 200) {
                                obj.del(); //删除对应行（tr）的DOM结构
                                layer.close(index); //关闭弹框
                                layer.msg("删除成功", { icon: 6 });
                            } else {
                                layer.close(index); //关闭弹框
                                layer.msg("删除成功", { icon: 5 });
                            }
                        }
                    });

                    layer.close(index); //关闭弹框
                });
            } else if (layEvent === 'edit') {
                layer.confirm('真的要编辑该商品吗！', function(index) {
                    //关闭弹窗
                    layer.close(layer.index);

                    //跳转传id
                    location.href = `./editgoods.html?_id=${data._id}`;

                });
            }
        });

    });
});