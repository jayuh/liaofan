/**
 * @description 事例页面
 * Created by SHENXIAOLONG029 on 16/8/10.
 */
define([
    'glass',
    'common',
    'avalon',
    'app/marketing/model/whitelist-model',
    'jquery-form'
], function (Class, common, avalon, model, ajaxFileform) {
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
                userId: '',
                certificateType: '',
                certificateNumber: '',
                fileName: '',
                fileUrl: '',
                uploadWhiteList: $.proxy(this.uploadWhiteList, this),
                queryWhiteList: $.proxy(this.queryWhiteList, this),
                keyUpFun: $.proxy(this.fileChange, this),
                fileClick: $.proxy(this.fileClick, this),
                fileChange: $.proxy(this.fileChange, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },
        fileChange: function () {
            this.vm.fileName = $('#file').val();
        },
        fileClick: function () {
            var $this = $('#file'),
                self = this;
            $this.click();
            $this.off().on('change', function () {
                self.fileChange();
            });
        },
        queryWhiteList: function () {
            var self = this,
                param = {
                    userId: self.vm.userId,
                    certificateType: self.vm.certificateType,
                    certificateNumber: self.vm.certificateNumber
                };
            model.queryWhiteList(param, function (result) {
                if (result && result.ret_code === '000000') {
                    if (result.response_body === '00') {
                        $('#qry_result').html('非白名单客户！');
                    } else {
                        $('#qry_result').html('白名单客户！');
                    }
                } else {
                    $('#qry_result').html(result.ret_msg);
                }
            });
        },
        uploadWhiteList: function () {
            $('#fileForm').ajaxSubmit({
                url: APP.config.baseURI + 'bank/hook/uploadWhiteList',
                type: 'POST',
                iframe: true,
                success: function (result) {
                    if (result.ret_code === '000000') {
                        common.msg(result.ret_msg || '导入成功', {icon: 6});
                    } else {
                        common.msg(result.ret_msg || '导入失败,请稍后再试!', {icon: 5});
                    }
                },
                error: function (result) {
                    common.msg(result.ret_msg || '导入失败,请稍后再试', {icon: 5});
                }
            });
        }
    });

    return Index;
});
