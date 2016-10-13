/**
 * @description 任务管理
 * Created by SHENXIAOLONG029 on 16/8/16.
 */
define([
    'glass',
    'common',
    'avalon',
    'laypage',
    'app/marketing/model/task-model'
], function (Class, common, avalon, laypage, model) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            laypage.dir = false;
            this.initViewModel();
            this.getList(1, true);
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var self = this;
            this.vm = avalon.define({
                $id: 'root',
                taskName: '',
                list: [],
                getList: $.proxy(self.getList, self),
                search: $.proxy(self.search, self),
                del: $.proxy(self.del, self),
                modify: $.proxy(self.modify, self),
                add: $.proxy(self.add, self)
            });
            avalon.scan();
        },

        /**
         * 获取offer列表
         * @param  {[type]} pageNum     [当前页数]
         * @param  {[type]} needLaypage [是否需要初始化分页插件]
         */
        getList: function (pageNum, needLaypage) {
            var self = this,
                param = {
                    objectsPerPage: 10,
                    pageNumber: pageNum
                };
            if (self.taskName) {
                param.taskName = self.taskName;
            }
            model.getList(param, function (result) {
                if (result && result.responseCode === '000000') {
                    var data = result.pageDTO, pages, curr;
                    self.vm.list = data.list;
                    if (needLaypage) {
                        pages = Math.ceil(data.fullListSize / data.objectsPerPage);
                        curr = pageNum;
                        self.initLaypage(pages, curr);
                    }
                } else {
                    common.msg(result.responseMsg);
                }
            });
        },

        /**
         * 搜索
         * @return {[type]} [description]
         */
        search: function () {
            this.taskName = this.vm.taskName;
            this.getList(1, true);
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
                curr: curr,
                groups: 3,
                skin: '#24B0F4',
                prev: '<i class="fa fa-chevron-left" style="vertical-align: middle;"></i>',
                next: '<i class="fa fa-chevron-right" style="vertical-align: middle;"></i>',
                jump: function (e, first) {
                    var pageNo = e.curr;
                    if (!first) {
                        self.getList(pageNo);
                    }
                }
            });
        },

        // 显示添加层
        add: function () {
            location.href = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1) + 'task-edit.html?operate=add';
        },

        // 显示修改层
        modify: function (activityTaskId) {
            location.href = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1) + 'task-edit.html?operate=edit&activityTaskId=' + activityTaskId;
        },

        // 删除一条offer
        del: function (activityTaskId) {
            var self = this;
            common.delMsg(function () {
                var param = { activityTaskId: activityTaskId };
                model.del(param, function (data) {
                    if (data && data.responseCode === '000000') {
                        common.msg('删除成功', {icon: 1});
                        var currPage = $('#laypage').find('.laypage_curr').text() || '1';
                        if (self.vm.list.length === 1 && currPage !== '1') {
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
