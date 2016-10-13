define([
    'common'
], function (common) {
    'use strict';
    var Model, root = APP.config.baseURI + 'market/campaign/admin/';
    Model = {

        // 获取列表
        getList: function (data, callback) {
            var url = root + 'queryAllActivityTask';
            common.utils.post(url, data, '获取列表数据异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 获取活动列表
        getActivityList: function (data, callback) {
            var url = root + 'queryAllActivity';
            common.utils.post(url, data, '获取列表数据异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 获取一条数据
        get: function (data, callback) {
            var url = root + 'getTaskObject';
            common.utils.post(url, data, '获取数据异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 添加一条数据
        add: function (data, callback) {
            var url = root + 'addTask';
            common.utils.post(url, data, '添加数据异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 删除一条数据
        del: function (data, callback) {
            var url = root + 'deleteTask';
            common.utils.post(url, data, '删除数据异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 修改一条数据
        modify: function (data, callback) {
            var url = root + 'updateTask';
            common.utils.post(url, data, '修改数据异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 任务类型列表查询
        getTaskTypeList: function (data, callback) {
            var url = root + 'getTaskTypeList';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 任务属性列表查询
        getTaskPropertyList: function (data, callback) {
            var url = root + 'getTaskPropertyList';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        }
    };
    return Model;
});
