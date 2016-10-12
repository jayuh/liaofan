/**
 * @description 事例页面
 * Created by SHENXIAOLONG029 on 16/8/10.
 */
define([
    'glass',
    'common',
    'avalon',
    'laydate',
    'laypage',
    'select2',
    'app/marketing/model/offer-model',
    'app/marketing/model/jqueryForm-model',
    'css!plugins/select2/css/select2.css'
], function (Class, common, avalon, laydate, laypage, select2, model, jqueryFormModel) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.initViewModel();
            this.getList(1, 10, '', true);
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var opt = {
                layTar: '',
                offerId: '',
                offerName: '',
                offerCode: '',
                offerTypeCode: '',
                offerTypeName: '',
                goodsTotalNum: '',
                supplierName: '',
                supplierCode: '',
                validStartDate: '',
                validEndDate: '',
                searchInput: '',
                searchKey: '',
                offerCodeSub: '',
                offerCodeList: [],
                resourceCount: '',
                fileName: '',
                loadingTip: '',
                insert: $.proxy(this.insert, this),
                submit: $.proxy(this.submit, this),
                search: $.proxy(this.search, this),
                submit1: $.proxy(this.submit1, this),
                change: $.proxy(this.change, this),
                controlNum: $.proxy(this.controlNum, this),
                afterPaste: $.proxy(this.afterPaste, this),
                removeVal: $.proxy(this.removeVal, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },

        search: function () {
            this.vm.searchKey = this.vm.searchInput;
            this.getList(1, 10, this.vm.searchKey, true);
        },

        // 获取offer列表
        getList: function (pageNumber, objectsPerPage, offerName, needLaypage) {
            var self = this, param = { pageNumber: pageNumber, objectsPerPage: objectsPerPage, offerName: offerName};
            if (!offerName) {
                param = { pageNumber: pageNumber, objectsPerPage: objectsPerPage};
            }
            // TODO 分页
            model.getList(param, function (result) {
                if (result && result.responseCode === '000000') {
                    self.vm.list = result.pageDTO.list;
                    if (needLaypage) {
                        var pages = Math.ceil(result.pageDTO.fullListSize / result.pageDTO.objectsPerPage),
                            curr = pageNumber;
                        self.initLaypage(pages, curr);
                    }
                } else {
                    common.msg(result.responseMsg);
                }
            });
        },
        /**
         * 初始化分页
         * @param  {[Number]} pages [总页数]
         * @param  {[Number]} curr  [当前页数]
         */
        initLaypage: function (pages, curr) {
            var self = this;
            laypage.dir = false;
            laypage({
                cont: 'laypage',
                pages: pages,
                skip: true,
                curr: curr || 1,
                groups: 3,
                skin: '#24B0F4',
                prev: '<i class="fa fa-chevron-left" style="vertical-align: middle;"></i>',
                next: '<i class="fa fa-chevron-right" style="vertical-align: middle;"></i>',
                jump: function (e, first) {
                    var pageNo = e.curr;
                    if (!first) {
                        self.getList(pageNo, 10, self.vm.searchKey);
                    }
                }
            });
        },

        // 删除一条offer
        del: function (id, $remove) {
            var self = this;
            common.delMsg(function () {
                var param = { offerId: id };
                model.del(param, function (data) {
                    if (data && data.responseCode === '000000') {
                        common.msg('删除成功', {icon: 1});
                        var currPage = $('#laypage').find('.laypage_curr').text() || '1';
                        if (self.vm.list.length === 1 && currPage !== '1') {
                            currPage--;
                        }
                        self.getList(currPage, 10, self.vm.searchKey, true);
                    } else {
                        common.msg(data.responseMsg);
                    }
                });
            });
        },

        // 点击导入券码
        insert: function (offerCodeName, tar) {
            var self = this;
            this.vm.layTar = tar;
            if (offerCodeName) {
                self.vm.offerCodeSub = offerCodeName;
                self.vm.offerCodeList = [{offerCode: offerCodeName}];
            }
            $('#querySelect').select2();
            $('#querySelect').attr('disabled', true);
            this.vm.resourceCount = '';
            common.openMsg({title: '导入'});
        },

        // 导入提交
        submit: function () {
            this.vm.fileName = '';
            var self = this, param = {offerCode: this.vm.offerCodeSub};
            self.vm.fileName = '正在导入中...';
            jqueryFormModel.addFile('uploadFile', 'importResourceExcel.do', param, function (result) {
                self.vm.fileName = '';
                if (result && result.responseCode === '000000') {
                    layer.closeAll();
                    common.msg('导入成功', {icon: 6});
                    var currPage = $('#laypage').find('.laypage_curr').text() || '1';
                    self.getList(currPage, 10, '', true);
                } else {
                    layer.closeAll();
                    common.msg(result.responseMsg || '导入失败');
                }
            });
        },

        // 生成资源提交
        submit1: function () {
            if (this.vm.resourceCount > 10000) {
                common.msg('数量不得大于10000');
                return false;
            }
            var self = this, param = {offerCode: this.vm.offerCodeSub, resourceCount: this.vm.resourceCount};
            self.vm.loadingTip = '正在生成中...';
            model.submit(param, function (result) {
                self.vm.loadingTip = '';
                if (result && result.responseCode === '000000') {
                    layer.closeAll();
                    common.msg('资源生成成功', {icon: 6});
                    var currPage = $('#laypage').find('.laypage_curr').text() || '1';
                    self.getList(currPage, 10, '', true);
                } else {
                    common.msg(result.responseMsg || '资源生成失败');
                }
            });
        },

        change: function (e) {
            var targetUrl = e.target.value,
                target = targetUrl.substr(targetUrl.lastIndexOf('\\') + 1);
            this.vm.fileName = target;
        },

        controlNum: function (e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        },
        removeVal: function (e) {
            e.target.value = '';
        }

    });

    return Index;
});
