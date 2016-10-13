/**
 * offer组管理列表
 * Created by xiaomq
 */
define([
    'glass',
    'common',
    'avalon',
    'laypage',
    'app/marketing/model/offer-group-model'
], function (Class, common, avalon, laypage, model, editTemplate) {
    'use strict';
    var OfferGroup = Class.create({
        initialize: function () {
            laypage.dir = false;
            this.initViewModel();
            this.getList(1, true);
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var opt = {
                offerGroupName: '',
                searchList: $.proxy(this.searchList, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },

        searchList: function () {
            this.offerGroupName = this.vm.offerGroupName;
            this.getList(1, true);
        },

        // 获取offer组列表
        getList: function (pageNumber, needLaypage) {
            var self = this,
                param = {
                    pageNumber: pageNumber,
                    offerGroupName: self.offerGroupName,
                    objectsPerPage: 10
                };
            model.getList(param, function (result) {
                if (result && result.responseCode === '000000') {
                    var data = result.pageDTO, pages, curr;
                    self.vm.list = data.list;
                    if (needLaypage) {
                        pages = Math.ceil(data.fullListSize / data.objectsPerPage);
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

        // 删除一条offer组
        del: function (id, $remove) {
            var self = this;
            common.delMsg(function () {
                var param = { offerGroupId: id };
                model.deleteOfferGroup(param, function (data) {
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
    });

    return OfferGroup;
});
