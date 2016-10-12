/**
 * @description 报表管理 - Model
 * Created by ex-huwenhui001 on 2016/8/14.
 */

define([
    'common'
], function (common) {
    'use strict';
    var Model, root = APP.config.baseURI + 'market/campaign/admin/';
    Model = {

        // 获取activityId
        getAllChannelList: function (data, callback) {
            var url = root + 'findAllChannel.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        },

        // 获取报表
        getOfferReport: function (data, callback) {
            var url = root + 'generateOfferReport.do';
            common.utils.post(url, data, '请求异常，请稍候再试！', function (result) {
                if (callback) {
                    callback(result);
                }
            });
        }
    };
    return Model;
});
