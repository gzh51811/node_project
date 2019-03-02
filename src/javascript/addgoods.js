(() => {
    //Demo
    layui.use(['form', 'upload', 'laydate'], function() {
        var form = layui.form;

        //监听提交
        form.on('submit(formDemo)', function(data) {
            // layer.msg(JSON.stringify(data.field));


            layer.confirm("确认要添加吗！", {
                title: "添加确认"
            }, function(index) {    
                // 拿到图片地址
                data.field.file = $('#logoImg').attr("data-url")
                var res = data.field
                    //关闭弹窗
                layer.close(layer.index);
                //定义一个商品属性的数组
                let quality = [];
                // 判断商品有啥子属性
                if (res.tuijian) {
                    quality.push('推荐');
                }
                if (res.remai) {
                    quality.push('热卖');
                }
                if (res.cuxiao) {
                    quality.push('促销');
                }
                // 转成字符串
                quality = quality.join(',');
                res.quality = quality;
                // 判断是否上架
                if (res.state) {
                    res.state = "上架"
                } else {
                    res.state = "下架"
                }

                //向服务端发送添加指令
                $.ajax({
                    type: "GET",
                    url: "/addgoods",
                    data: {
                        name: res.name,
                        shop: res.shop,
                        priceOld: res.priceOld,
                        priceNow: res.priceNow,
                        classify: res.classify,
                        stock: res.stock,
                        time: res.time,
                        quality: res.quality,
                        state: res.state,
                        logo: res.file,
                        description: res.description,
                        insert: true
                    },
                    success(data) {
                        if (data.ok == 1) {
                            parent.layer.msg('添加成功！', { icon: 6, time: 2000, shade: 0.2 });
                            $("#addGoodsForm")[0].reset();
                            $("#logoImg").attr("src", "./01.png");
                            $('#logoImg').attr("data-url", "")
                        } else {
                            parent.layer.msg('添加失败！', { icon: 5, time: 3000, shade: 0.2 });
                        }
                    }

                });
            }); 

            return false;
        });


        // 上传图片
        var $ = layui.jquery,
            upload = layui.upload;
        //普通图片上传
        var uploadInst = upload.render({
            elem: '#test1',
            url: '/upload',
            // auto: false, //选择文件后不自动上传

            // bindAction: '#addBtn', //指向一个按钮触发上传
            choose: function(obj) {
                //将每次选择的文件追加到文件队列
                var files = obj.pushFile();

                //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                obj.preview(function(index, file, result) {
                    // console.log(index); //得到文件索引
                    // console.log(file); //得到文件对象
                    // console.log(result); //得到文件base64编码，比如图片

                    // obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增

                    //这里还可以做一些 append 文件列表 DOM 的操作

                    //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                    //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                });
            },
            before: function(obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    $('#logoImg').attr('src', result); //图片链接（base64）
                });

            },
            done: function(res) {
                //如果上传失败
                if (res.code > 0) {
                    return layer.msg('上传失败');
                }
                //上传成功
                let logoUrl = JSON.parse(res.data.src).file.path;
                $('#logoImg').attr("data-url", logoUrl)

            },
            error: function() {
                //演示失败状态，并实现重传
                var demoText = $('#demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function() {
                    uploadInst.upload();
                });
            }
        });




        var laydate = layui.laydate;

        //日期
        laydate.render({
            elem: '#date'
        });
        laydate.render({
            elem: '#date1'
        });

    });
})()