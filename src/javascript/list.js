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

        //执行一个 table 实例
        table.render({
            elem: '#demo',
            height: 420,
            url: '/list', //数据接口

            title: '用户表',
            page: true, //开启分页

            toolbar: 'default', //开启工具栏，此处显示默认图标，可以自定义模板，详见文档

            cols: [
                [ //表头
                    {
                        type: 'checkbox',
                        fixed: 'left'
                    }, {
                        field: '_id',
                        title: 'ID',
                        width: 120,
                        fixed: 'left',
                    }, {
                        field: 'name',
                        title: '商品名称',
                        width: 120
                    }, {
                        field: 'logo',
                        title: '商品图片',
                        templet: '<div><img src="{{d.logo}}" style="height:100%;"></div>',
                        // style: 'height:100px;',
                        minWidth: 100
                    }, {
                        field: 'shop',
                        title: '店铺',
                        width: 90,
                        sort: true
                    }, {
                        field: 'priceOld',
                        title: '原价',
                        width: 80,
                        sort: true,
                    }, {
                        field: 'priceNow',
                        title: '现价',
                        width: 80,
                        sort: true,
                    }, {
                        field: 'classify',
                        title: '分类',
                        width: 80,
                        sort: true,
                    }, {
                        field: 'stock',
                        title: '数量',
                        width: 80,
                        sort: true
                    }, {
                        field: 'time',
                        title: '上架时间',
                        width: 100,
                        sort: true,
                    }, {
                        field: 'quality',
                        title: '属性',
                        width: 80,
                        sort: true
                    }, {
                        field: 'state',
                        title: '状态',
                        width: 80,
                        sort: true
                    }, {
                        fixed: 'right',
                        width: 165,
                        align: 'center',
                        toolbar: '#barDemo'
                    }
                ]
            ]
        });

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
                        layer.alert('编辑 [id]：' + checkStatus.data[0].id);
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
                                        parent.layer.msg('删除成功！', { icon: 6, time: 2000, shade: 0.2 }); //一闪而过的提示效果
                                        location.reload(true);
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
                layer.msg('查看操作');
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
                layer.msg('编辑操作');
            }
        });





        //分页
        laypage.render({
            elem: 'pageDemo' //分页容器的id
                ,
            count: 100 //总页数
                ,
            skin: '#1E9FFF' //自定义选中色值
                //,skip: true //开启跳页
                ,
            jump: function(obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {
                        offset: 'b'
                    });
                }
            }
        });

    });
});