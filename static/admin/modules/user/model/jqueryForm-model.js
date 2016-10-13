/**
 * @description offer回写 - Model
 * Created by ex-huwenhui001 on 2016/8/18.
 */

define([
    'common',
    'jquery-form'
], function (common) {
    'use strict';
    var Model, root = APP.config.baseURI + 'market/campaign/admin/';
    Model = {
        addFile: function (id, urlDo, data, callback) {
            var url = root + urlDo;
            common.pageLoading(true);
            $('#' + id).ajaxSubmit({
                url: url,
                type: 'post',
                timeout: 9999999,
                data: data,
                iframe: true,
                success: function (result) {
                    common.loadingFinish();
                    if (result) {
                        callback(result);
                    }
                },
                error: function () {
                    common.loadingFinish();
                    common.msg('系统异常，请稍后再试');
                }
            });
        }
    };
    return Model;
});
