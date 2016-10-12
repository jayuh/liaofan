/**
 * @description offer回写 - ViewModel
 * Created by ex-huwenhui001 on 2016/8/18.
 */

define([
    'glass',
    'common',
    'avalon',
    'app/marketing/model/jqueryForm-model'
], function (Class, common, avalon, model) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.initViewModel();
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var opt = {
                fileName: '',
                errorList: [],
                addFile: $.proxy(this.addFile, this),
                change: $.proxy(this.change, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },

        addFile: function () {
            var self = this;
            this.vm.fileName = '';
            model.addFile('upload', 'couponCodeWriteBack.do', {}, function (result) {
                if (result && result.responseCode === '000000') {
                    if (result.errorList.length > 0) {
                        self.vm.errorList = result.errorList;
                        common.openMsg({
                            title: '导入完成',
                            area: ['900px', 'auto']
                        });
                    } else {
                        common.msg(result.responseMsg || '导入成功', {icon: 6});
                    }
                } else if (result && result.responseCode === '999999') {
                    layer.closeAll();
                    common.msg('服务器处理中，请稍后刷新查看！');
                } else {
                    common.msg(result.responseMsg || '导入失败');
                }
            });
        },

        change: function (e) {
            var target = e.target,
                targetUrl = target.value,
                fileName = targetUrl.substr(targetUrl.lastIndexOf('\\') + 1);
            this.vm.fileName = fileName;
        }

    });

    return Index;
});
