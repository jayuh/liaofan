define([
    'common'
], function (common) {
    'use strict';
    var Model, root = APP.config.baseURI + 'bank/hook/';
    Model = {
        // 查询白名单
        queryWhiteList: function (data, callback) {
            var url = root + 'queryWhiteList';
            $.ajax({
                type: 'GET',
                url: url,
                data: data,
                dataType: 'json',
                success: function (result) {
                    if (callback) {
                        callback(result);
                    }
                },
                error: function () {
                    common.msg('请求异常,请稍后再试!');
                }
            });
        }
    };
    return Model;
});
