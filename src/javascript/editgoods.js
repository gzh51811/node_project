(() => {
    //获取URL里面的参数值
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    //拿到id参数
    let _id = getUrlParam("_id");

    let Alter = () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: '/editgoods',
                    data: {
                        _id,
                    },
                    success(data) {
                        resolve(data);
                    }
                });
            });
        }
        (async() => {
            // 赋值获取到的值
            let data = await Alter();
            $('.name').val(data[0].name)
                //商品分类
            $('.layui-select-title .layui-input').val(data[0].classify)
            $('.description').val(data[0].description)
            $('.priceNow').val(data[0].priceNow)
            $('.priceOld').val(data[0].priceOld)
            $('.shop').val(data[0].shop)
            $('.stock').val(data[0].stock)
            $('.time').val(data[0].time)
                //商品图片
            $('#logoImg').attr("data-url", data[0].logo)
            $('#logoImg').attr("src", data[0].logo)
                //商品属性
            if (data[0].quality.indexOf('热卖') >= 0) {
                $('#remai').next().addClass("layui-form-checked")
                $('#remai').attr("checked", true)
            }
            if (data[0].quality.indexOf('推荐') >= 0) {
                $('#tuijian').next().addClass("layui-form-checked")
                $('#tuijian').attr("checked", true)
            }
            if (data[0].quality.indexOf('促销') >= 0) {
                $('#cuxiao').next().addClass("layui-form-checked")
                $('#cuxiao').attr("checked", true)
            }
            // 商品状态
            if (data[0].state == '上架') {

                // layui-form-onswitch
                $('#state').next().addClass("layui-form-onswitch");
                $('#state').attr("checked", true)
            }
        })();





    //Demo
    layui.use(['form', 'upload', 'laydate'], function() {
        var form = layui.form;

        //监听提交
        form.on('submit(formDemo)', function(data) {
            // layer.msg(JSON.stringify(data.field));


            layer.confirm("确认要修改数据吗！", {
                title: "修改确认"
            }, function(index) {    
                // 拿到图片地址
                data.field.file = $('#logoImg').attr("data-url")
                var res = data.field
                data.field.classify = $('.layui-select-title .layui-input').val()
                    // id
                data.field._id = _id;
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

                console.log(res)

                //向服务端发送添加指令
                $.ajax({
                    type: "GET",
                    url: "/editgoods",
                    data: {
                        _id,
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
                        update: true
                    },
                    success(data) {
                        console.log(data)
                        if (data.ok == 1) {
                            parent.layer.msg('修改成功！', { icon: 6, time: 2000, shade: 0.2 }, function(index) {
                                location.href = './list.html';
                            });
                            // ';
                        } else {
                            parent.layer.msg('修改失败！', { icon: 5, time: 3000, shade: 0.2 });
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
})();