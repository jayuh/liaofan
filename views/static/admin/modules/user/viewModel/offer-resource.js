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
    'app/marketing/model/offer-resource-model',
    'app/marketing/model/jqueryForm-model',
    'css!plugins/select2/css/select2.css'
], function (Class, common, avalon, laydate, laypage, select2, model, jqueryFormModel) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.initViewModel();
            this.getOfferCodeList();
            this.getList(1, true);
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var opt = {
                resourceId: '',
                inputOfferCode: '',
                inputCouponCode: '',
                searchOfferCode: '',
               // searchCouponCode: '',
                offerCodeSub: '',
                offerCodeList: [],
                getOfferCodeList: $.proxy(this.getOfferCodeList, this),
                insert: $.proxy(this.insert, this),
                submit: $.proxy(this.submit, this),
                upload: $.proxy(this.upload, this),
                search: $.proxy(this.search, this),
                product: $.proxy(this.product, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },

        // 获取offerCodeList
        getOfferCodeList: function () {
            var self = this, param = {};
            model.getOfferCodeList(param, function (result) {
                if (result && result.responseCode === '000000') {
                    self.vm.offerCodeList = result.offerList;
                } else {
                    common.msg(result.responseMsg);
                }
            });
        },

        // 获取offer列表
        getList: function (pageNumber, needLaypage) {
            var self = this, param = {pageNumber: pageNumber, objectsPerPage: 10};
            if (this.vm.searchOfferCode) {
                param.offerCode = this.vm.searchOfferCode;
            };
            // if (this.vm.searchCouponCode) {
            //     param.couponCode = this.vm.searchCouponCode;
            // };
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
                curr: curr,
                groups: 3,
                skin: '#24B0F4',
                prev: '<i class="fa fa-chevron-left" style="vertical-align: middle;"></i>',
                next: '<i class="fa fa-chevron-right" style="vertical-align: middle;"></i>',
                jump: function (e, first) {
                    var pageNo = e.curr;
                    if (!first) {
                        self.getList(pageNo, true);
                    }
                }
            });
        },

        // 搜索
        search: function () {
            this.vm.searchOfferCode = this.vm.inputOfferCode;
            // this.vm.searchCouponCode = this.vm.inputCouponCode;
            this.getList(1, true);
        },

        // 点击导入券码
        insert: function () {
            var self = this;
            if (this.vm.offerCodeList.length > 0) {
                this.vm.offerCodeSub = this.vm.offerCodeList[0].offerCode;
            }
            $('#querySelect').select2();
            $('#querySelect').on('select2:select', function (evt) {
                self.vm.offerCodeSub = evt.currentTarget.value;
            });
            common.openMsg({title: '导入'});
        },

        submit: function () {
            var self = this, param = {offerCode: this.vm.offerCodeSub};
            jqueryFormModel.addFile('uploadFile', 'importResourceExcel.do', param, function (result) {
                if (result && result.responseCode === '000000') {
                    layer.closeAll();
                    common.msg('导入成功', {icon: 6});
                    self.getList(1, true);
                } else {
                    common.msg(result.responseMsg);
                }
            });
        },

        // 删除
        del: function (resourceId) {
            var self = this;
            common.delMsg(function () {
                var param = { resourceId: resourceId};
                model.del(param, function (data) {
                    if (data && data.responseCode === '000000') {
                        common.msg('删除成功', {icon: 1});
                        var currPage = $('#laypage').find('.laypage_curr').text() || '1';
                        if (self.vm.list.length === 1 && currPage !== '1') {
                            currPage--;
                        }
                        self.getList(currPage, true);
                    } else {
                        common.msg(data.responseMsg);
                    }
                });
            });
        }
        // 生成资源
        // product: function () {
        //     model.product({}, function (data) {
        //         if (data && data.responseCode === '000000') {
        //             common.msg('资源生成成功', {icon: 1});
        //         } else {
        //             common.msg(data.responseMsg);
        //         }
        //     });
        // }
    });

    return Index;
});
