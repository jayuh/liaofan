/**
 * @description 报表管理 - ViewModel
 * Created by ex-huwenhui001 on 2016/8/14.
 */

define([
    'glass',
    'common',
    'avalon',
    'app/marketing/model/reporting-model',
    'laydate',
    'select2',
    'css!plugins/select2/css/select2.css'
], function (Class, common, avalon, model, laydate, select2) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            var self = this;
            self.initViewModel();
            self.getAllChannelList();
        },

        initViewModel: function () {
            var opt = {
                list: [],
                startTime: '',
                endTime: '',
                allChecked: $.proxy(this.allChecked, this),
                createForm: $.proxy(this.createForm, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },

        allChecked: function (e) {
            var isChecked = $(e.target).prop('checked');
            if (isChecked) {
                $(e.target).prop('checked', true);
                $('.checkbox-wh').prop('checked', true);
            } else {
                $(e.target).prop('checked', false);
                $('.checkbox-wh').prop('checked', false);
            }
        },
        // 获取产品名称
        getAllChannelList: function () {
            var self = this, param = {};
            model.getAllChannelList(param, function (result) {
                if (result && result.responseCode === '000000') {
                    self.vm.list = result.channelList;
                } else {
                    common.msg(result.responseMsg);
                }
            });
        },
        // 获取产品号
        getChannelIds: function () {
            var ChannelIds = [];
            $('.checkbox-wh').each(function () {
                if ($(this).prop('checked')) {
                    ChannelIds.push($(this).val());
                }
            });
            return (ChannelIds.toString());
        },
        // 判断是否加载完成
        loadIframe: function (url, callback) {
            try {
                if (url === undefined) {
                    return false;
                }
                var val = url, iframe = $('<iframe id="loadingExcel"  style="position:absolute;top:-9999px,left:-99999px"/>')[0], loadingExcel = $('#loadingExcel'), isHas = false;
                if (loadingExcel.length > 0) {
                    iframe = loadingExcel[0];
                    isHas = true;
                }
                iframe.src = val;
                if (!isHas) {
                    $('body').append($(iframe));
                }
            } catch (e) {
                common.msg('系统异常，请稍后再试');
            }
        },

        createForm: function () {
            var ChannelIds = this.getChannelIds(), param = '';
            if (this.vm.startTime === '') {
                common.msg('请选择开始活动时间');
                return false;
            }
            if (this.vm.endTime === '') {
                common.msg('请选择结束活动时间');
                return false;
            }
            if (new Date(this.vm.startTime) > new Date(this.vm.endTime)) {
                common.msg('请选择正确的时间段');
                return false;
            }
            if (ChannelIds === '') {
                common.msg('请选择活动名称');
                return false;
            }
            // param = {
            //     beginDate: this.vm.startTime,
            //     endDate: this.vm.endTime,
            //     channelIds: ChannelIds
            // };
            param = '?beginDate=' + this.vm.startTime + '&endDate=' + this.vm.endTime + '&channelIds=' + ChannelIds;
            this.loadIframe(APP.config.baseURI + 'market/campaign/admin/generateOfferReport.do' + param);
            // model.getOfferReport(param, function (result) {
            //     if (result && result.responseCode === '000000') {
            //         var opt = {
            //             closeBtn: 1,
            //             time: 0,
            //             skin: 'layui-layer-molv',
            //             title: '温馨提示'
            //         };
            //         common.msg('<p>报表' + result.fileName + '已生成</p><div class="center"><a type="button" class="btn" href="' + result.fileURL + '">下载</a></div>', opt);
            //     } else {
            //         common.msg(result.responseMsg);
            //     }
            // });
        }
    });

    return Index;
});
