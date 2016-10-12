define([
    'utils',
    'pubsub',
    'layer'
], function (Utils, PubSub, layer) {
    'use strict';
    var common = {
        requestNum: 0,

        /**
         * 设置全局AJAX默认选项
         */
        ajaxSettings: function () {
            $.extend($.ajaxSettings, {
                cache: false,
                timeout: 20000,
                dataType: 'json',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
            });
            $.ajaxSettings.beforeSend = function () {
            };
            $.ajaxSettings.error = function (xhr, textStatus) {
                common.errorTip(xhr, textStatus);
            };
            $.ajaxSettings.complete = function (xhr, textStatus) {
                // 登录超时
                // if (xhr.responseJSON && xhr.responseJSON.responseCode === '900106') {
                //     setTimeout(function () {
                //         location.href = APP.config.root + 'login.html?target=' + encodeURIComponent(location.href);
                //     }, 2000);
                // }
            };
        },

        errorTip: function (xhr, textStatus, tip) {
            if (textStatus === 'timeout' || textStatus === 'abort') {
                common.msg('网络超时，请稍候再试！', {icon: 5});
            } else {
                common.msg(tip || '请求异常，请稍候再试！', {icon: 5});
            }
        },

        /**
         * 提示层，会自动消失
         * @param content 提示方案
         * @param options icon参数:1勾，2叉叉，3问号，4锁，5是哭 ，6笑，感叹号, 非必填
         * @param end 消失后的回调，非必填
         * @description 1.common.msg('提示'), 2.common.msg('错误', {icon: 5})，3.common.msg('回调', {icon: 6}, function(){})
         */
        msg: function (content, options, end) {
            var type = typeof options === 'function';
            if (type) {
                end = options;
                layer.msg(content, end);
            } else {
                options = options || {};
                if (end) {
                    layer.msg(content, options, end);
                } else {
                    layer.msg(content, options);
                }
            }
        },

        /**
         * 一般使用msg，不够用可以此方法扩展，文档：http://layer.layui.com/api.html#layer.open
         * @param options
         */
        openMsg: function (opt) {
            var options = {
                type: 1,
                title: '编辑',
                content: $('#editTemplate'),
                closeBtn: 1,
                shade: [0.8, '#393D49'],
                area: ['500px', 'auto'],
                shift: 2
            };
            $.extend(options, opt);
            layer.open(options);
        },

        /**
         * 删除提示框
         * @param  {[type]} affirm [点击确认后的回调函数]
         * @param  {[type]} cancel [点击取消后的回调函数]
         * @return {[type]}        [none]
         */
        delMsg: function (affirm, cancel) {
            layer.confirm('确认删除？', {
                btn: ['确认', '取消']
            }, function () {
                if (affirm) affirm();
            }, function () {
                if (cancel) cancel();
            });
        },

        /**
         * 弹窗
         * title 非必输，是否显示标题
         * ok 确定按钮的回调   非必输
         * cancel取消按钮的回调 非必输
         * style 非必输
         * api可参考 http://layer.layui.com/mobile/api.html
         */
        confirm: function (text, title, ok, cancel, style, okName) {
            var opt = {shade: [0.8, '#202427'], shadeClose: false, content: text}, closeTime;
            if (title) {
                opt.title = title;
            }
            if (ok) {
                opt.btn = okName ? [okName] : ['确认'];
                opt.yes = function () {
                    layer.closeAll();
                    if ($.type(ok) === 'function') {
                        ok();
                    }
                };
            }
            if (ok && cancel) {
                opt.btn.push('取消');
                opt.no = function () {
                    layer.closeAll();
                    if ($.type(cancel) === 'function') {
                        cancel();
                    }
                };
            }
            if (arguments.length === 1) {
                closeTime = 2;
                opt.time = closeTime;
            }
            opt.style = style || 'text-align: center;';
            layer.open(opt);
        },

        /**
         * 隐藏loading效果
         * 场景 在全部请求加载完成之后触发
         */
        loadingFinish: function () {
            this.requestNum --;
            if (this.requestNum <= 0) {
                layer.close(common.layerIndex);
            }
        },

        pageLoading: function (bool) {
            if (bool) {
                common.layerIndex = layer.load(0, {shade: [0.3, '#393D49']});
            } else {
                common.layerIndex = layer.load(0, {shade: false});
            }
        },

        /**
         * ajax公共处理
         * @param options
         * @returns {*}
         */
        _ajax: function (url, data, type, tip, callback, fail, timeout) {
            data._ = (new Date()).getTime();
            common.pageLoading();
            var opt = {};
            if (typeof url === 'string') {
                opt = {
                    url: url,
                    type: type,
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json',
                    beforeSend: function () {
                        common.requestNum ++;
                    },
                    success: function (result) {
                        common.loadingFinish();
                        if (result) {
                            // result = $.parseJSON(result);
                            if (callback && (typeof callback === 'function')) {
                                callback(result);
                            } else if (callback && (typeof callback === 'string')) {
                                PubSub.publish(callback, result);
                            } else {
                                throw new Error('success回调没有发现callback参数的定义');
                            }
                        }
                    },
                    error: function (xhr, textStatus) {
                        common.loadingFinish();
                        if (typeof fail === 'function') {
                            fail(xhr, textStatus);
                        } else {
                            common.errorTip(xhr, textStatus, tip);
                            // if (textStatus !== 'abort') {
                            //     common.msg(tip || '网络异常，请稍候再试！', {icon: 5});
                            // }
                        }
                    }
                };
                if (timeout) {
                    opt.timeout = timeout;
                }
                return $.ajax(opt);
            }

            // 默认的不够用的，直接使用AJAX，支持所有options
            if (Utils.isObject(url)) {
                opt = url;
                if (typeof opt.data === 'string') {
                    throw new Error('data参数必须为JSON对象');
                }
                return $.ajax(opt);
            }
        },

        _delete: function (url, data, tip, callback, fail) {
            return common._ajax(url, data, 'DELETE', tip, callback, fail);
        },
        /**
         * 调用AJAX
         * @param url  接口URL
         * @param data 发起接口需要传入的参数
         * @param tip  接口返回参数失败的提示语
         * @param callback 如果传入函数类型则使用callback的方式回调，如果是字符串则使用PubSub推送
         * @param fail 失败时触发的回调函数
         * @return {[type]} [description]
         */
        _post: function (url, data, tip, callback, fail, timeout) {
            return common._ajax(url, data, 'POST', tip, callback, fail, timeout);
        },

        /**
         * 拉取后台数据
         * @param url  接口URL
         * @param data 发起接口需要传入的参数
         * @param tip  接口返回参数失败的提示语
         * @param callback 如果传入函数类型则使用callback的方式回调，如果是字符串则使用PubSub推送
         * @param fail 失败时触发的回调函数
         * @return {[type]} [description]
         */
        _fetch: function (url, data, tip, callback, fail) {
            return common._ajax(url, data, 'GET', tip, callback, fail);
        },

        /**
         * 调用AJAX
         * @param url  接口URL
         * @param data 发起接口需要传入的参数
         * @param type 发起的请求类型
         * @param tip  接口返回参数失败的提示语
         * @param callback 如果传入函数类型则使用callback的方式回调，如果是字符串则使用PubSub推送
         * @param fail 失败时触发的回调函数
         * @return {[type]} [description]
         */
        ajax: function (url, data, type, tip, callback, fail) {
            $.ajax({
                url: url,
                data: data,
                type: type,
                dataType: 'json',
                success: function (result) {
                    if (callback) {
                        callback(result);
                    }
                },
                error: function (xhr, textStatus) {
                    if (typeof fail === 'function') {
                        fail(xhr, textStatus);
                    } else {
                        if (textStatus !== 'abort') {
                            layer.msg(tip || '网络异常，请稍候再试！', {
                                time: 3000
                            });
                        }
                    }
                }
            });
        },

        createViewModel: function (self, opt) {
            var options = {
                $id: 'root',
                list: [],
                one: {},
                operate: '',
                getList: $.proxy(self.getList, self),
                del: $.proxy(self.del, self),
                add: $.proxy(self.add, self),
                showModify: $.proxy(self.showModify, self),
                showAdd: $.proxy(self.showAdd, self),
                modify: $.proxy(self.modify, self),
                save: $.proxy(self.save, self)
            };
            $.extend(options, opt);
            return options;
        }
    };

    // 全局AJAX配置
    common.ajaxSettings();

    // 外部统一调用utils中的方法,_ajax,_post为私有方法不可以直接使用
    Utils.ajax = common.ajax;
    Utils.post = common._post;
    Utils.fetch = common._fetch;
    Utils.del = common._delete;
    common.utils = Utils;
    return common;
});
