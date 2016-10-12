define([
    'common',
    'ajaxFileUpload'
], function (common) {
    'use strict';
    var Model, root = APP.config.baseURI + 'market/campaign/admin/';
    Model = {
        // 获取offer-resource列表
        getList: function (data, callback) {
            var url = root + 'getOfferResourceListPage.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 获取offerCode列表
        getOfferCodeList: function (data, callback) {
            var url = root + 'getOfferList.do';
            common.utils.post(url, data, '', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 上传券码
        fileUpload: function (elemId, data, callback) {
            $.ajaxFileUpload({
                url: root + 'importResourceExcel.do',
                secureuri: false,
                fileElementId: [elemId],
                timeout: 300000,
                data: data,
                success: function (result) {
                    if (callback) {
                        callback(result);
                    }
                },
                error: function (xml, status, e, code) {
                    if (code && code === '999999') {
                        callback && callback({responseCode: code});
                    } else {
                        common.msg('文件上传失败，请稍后再试！');
                    }
                }
            });
        },
        del: function (data, callback) {
            var url = root + 'deleteOfferResource.do';
            common.utils.post(url, data, '', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        }
        // product: function (data, callback) {
        //     var url = root + 'autoResource.do';
        //     common.utils.post(url, data, '', function (result) {
        //         if (callback) {
        //             callback(result);
        //         }
        //     });
        // }
    };
    return Model;
});
