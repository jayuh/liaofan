define([
    'common'
], function (common) {
    'use strict';
    var Model, root = APP.config.baseURI + 'market/campaign/admin/';
    Model = {
        // 获取列表
        getList: function (data, callback) {
            var url = root + 'getOfferPlanListPage.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 删除一条offer
        deleteOfferPlan: function (data, callback) {
            var url = root + 'deleteOfferPlan.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // offer方案查询（右边已绑定数据）
        getOfferPlanObject: function (data, callback) {
            var url = root + 'getOfferPlanObject.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // offer组查询（左边未绑定数据）
        getOfferGroupListPage: function (data, callback) {
            var url = root + 'getOfferGroupListPage.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 方案管理(新增保存)
        addOfferPlan: function (data, callback) {
            var url = root + 'addOfferPlan.do';
            common.utils.post(url, data, '保存失败，请重新保存！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },
        // 方案管理(新增保存)
        updateOfferPlan: function (data, callback) {
            var url = root + 'updateOfferPlan.do';
            common.utils.post(url, data, '保存失败，请重新保存！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        }
    };
    return Model;
});
