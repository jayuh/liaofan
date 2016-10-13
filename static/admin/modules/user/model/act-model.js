define([
    'common'
], function (common) {
    'use strict';
    var Model = {
        /**
         *
         * @param url 请求地址
         * @param data 请求参数
         * @param successFun '000000'成功时回调
         * @param errorFun 非'000000'失败时回调
         * http://iqsz-d2621:8080 陈卫清
         */
        getOrSetData: function (url, data, successFun, errorFun) {
            var tip = '请求异常，请稍候再试！',
                ajaxurl = APP.config.baseURI + url;
            if (ajaxurl && typeof ajaxurl === 'string') {
                common.utils.post(ajaxurl, data, tip, function (result) {
                    if (result.responseCode === '000000') {
                        successFun && successFun(result);
                    } else {
                        if (errorFun) {
                            errorFun();
                        } else {
                            common.msg(result.responseMsg || tip);
                        }
                    }
                });
            }
        }
    };
    return Model;
});
