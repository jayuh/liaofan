define([
    'common'
], function (common) {
    'use strict';

    var Model, root = APP.config.baseURI + 'market/campaign/admin/';
    Model = {
        // 获取offer列表
        getOfferList: function (data, callback) {
            var url = root + 'getOfferListForGroup.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },
        // 获取offer组列表
        getOfferGroupList: function (data, callback) {
            var url = root + 'getOfferGroupObject.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },
        // 获取offer组列表分页
        getList: function (data, callback) {
            var url = root + 'getOfferGroupListPage.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 添加一条offer组
        addOfferGroup: function (data, callback) {
            var url = root + 'addOfferGroup.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 删除一条offer组
        deleteOfferGroup: function (data, callback) {
            var url = root + 'deleteOfferGroup.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 修改一条offer组
        updateOfferGroup: function (data, callback) {
            var url = root + 'updateOfferGroup.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        }
    };
    return Model;
});
