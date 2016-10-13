/**
 * @description 任务管理
 * Created by SHENXIAOLONG029 on 16/8/16.
 */
define([
    'glass',
    'common',
    'avalon',
    'laypage',
    'app/marketing/model/offer-scheme-model'
], function (Class, common, avalon, laypage, model) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.initViewModel();
            this.getList(1, true); // true：是初始化分页控件
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var opt = {
                searchOfferPlanName: '',
                offerPlanName: '',
                pageList: [],
                lendType: false,
                searchList: $.proxy(this.searchList, this),
                enterSearchList: $.proxy(this.enterSearchList, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },

        // 回车键搜索
        enterSearchList: function (event) {
            if (event.keyCode === 13) {
                this.searchList();
            }
        },
        // 点击搜索按钮搜索
        searchList: function () {
            this.vm.offerPlanName = this.vm.searchOfferPlanName.trim();
            this.getList(1, true);
        },
        // 获取列表
        getList: function (pageNumber, needLaypage) {
            var self = this,
                param = {
                    pageNumber: pageNumber,
                    objectsPerPage: 10
                };
            if (self.vm.offerPlanName.trim()) {
                param.offerPlanName = self.vm.offerPlanName.trim();
            }
            model.getList(param, function (result) {
                self.renderGetList(result, pageNumber, needLaypage);
            });
        },
        // 渲染列表
        renderGetList: function (result, pageNumber, needLaypage) {
            var self = this, pages, curr;
            if (result && result.responseCode === '000000') {
                self.vm.pageList = result.pageDTO.list;

                // 初始化分页插件
                if (needLaypage) {
                    pages = Math.ceil(result.pageDTO.fullListSize / result.pageDTO.objectsPerPage);
                    curr = pageNumber;
                    self.initLaypage(pages, curr);
                }
            } else {
                layer.msg('请求异常，请稍候再试！', {icon: 5, time: 2000});
            }
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
                        self.getList(pageNo, true);
                    }
                }
            });
        },
        // 删除一条offer
        del: function (offerPlanId, $remove) {
            var self = this;
            common.delMsg(function () {
                var param = { offerPlanId: offerPlanId };
                model.deleteOfferPlan(param, function (data) {
                    if (data && data.responseCode === '000000') {
                        common.msg('删除成功', {icon: 1});
                        var currPage = $('#laypage').find('.laypage_curr').text() || '1';
                        if (self.vm.pageList.length === 1 && currPage !== '1') {
                            currPage--;
                        }
                        self.getList(currPage, true);
                    }
                });
            });
        }
    });

    return Index;
});
