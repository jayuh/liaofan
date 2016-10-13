/**
 * 活动管理列表
 * Created by luojian883 on 16/8/15.
 *
 ***************   修改记录  *******************
 * 修改记录
 * 序号     原因      时间   行号
 *
 *
 *********************************************
 *
 */
define([
    'glass',
    'common',
    'avalon',
    'laypage',
    'app/marketing/model/act-model',
    'laydate'
], function (Class, common, avalon, laypage, model, laydate) {
    'use strict';
    var List = Class.create({
        initialize: function () {
            laypage.dir = false;
            this.initViewModel();
            this.render(true);
        },

        initObj: function () {
            this.obj = {
                activityCode: '', // 活动代码
                activityId: '', // 活动ID
                activityName: '', // 活动名称
                startTime: '', // 开始时间
                endTime: '', // 结束时间
                status: '', // 状态  码值:0-未发布  1-审批中  2-已发布
                statusStr: '',
                releaseFlag: true, //  未发布才能发布
                offlineFlag: true, // 已发布才能下线
                deleteFlag: true // 未发布才能删除
            };
        },

        initViewModel: function () {
            this.initObj();
            var self = this,
                opt = {
                    $id: 'root',
                    list: [],

                    inputactivityName: '', // 搜索框输入的值

                    pageNumber: 1, // 第几页
                    objectsPerPage: 10, // 每页显示活动条数
                    totalPages: 1, // 总页数
                    actName: '', // 活动名称
                    actCode: '', // 活动编码
                    offerCode: '',
                    beginDate: '',
                    endDate: '',
                    // 发布,下线,删除事件
                    actionFun: function (activityId, flag, actionType) {
                        // actionType   '00'---发布    '01'---下线    '02'----删除
                        self.actionFun(activityId, flag, actionType);
                    },

                    // 新增, 编辑事件
                    editFun: function (activityCode, activityName, activityId) {
                        self.editFun(activityCode, activityName, activityId);
                    },

                    // 查询事件, 输入框回车事件
                    queryFun: function () {
                        self.queryFun();
                    },

                    // 输入框回车事件
                    enterFun: function (e) {
                        self.queryFun(e);
                    },

                    // 下载获奖名单
                    getAwardsList: function (actCode, actName) {
                        self.getAwardsList(actCode, actName);
                    },

                    // 提交下载获奖名单
                    submit: function () {
                        self.submit();
                    }
                };
            this.vm = avalon.define(opt);
            avalon.scan();
            this.vm.list.push(this.obj);
            this.inputactivityName = '';
        },

        // 查询回车事件
        queryFun: function (e) {
            if (e) {
                // 非回车不去查询后台数据
                if (e.keyCode !== 13) {
                    return false;
                }
            }
            this.vm.pageNumber = 1;
            this.vm.objectsPerPage = 10;
            this.inputactivityName = this.vm.inputactivityName;
            this.render(true);
        },

        render: function (needLaypage) {
            var param = {
                    pageNumber: this.vm.pageNumber || 1,
                    objectsPerPage: this.vm.objectsPerPage || 10,
                    activityName: this.inputactivityName
                },
                url = 'market/campaign/admin/queryAllActivity',
                self = this,
                list = [];
            model.getOrSetData(url, param, function (res) {
                list = [];
                for (var i = 0, len = res.pageDTO.list.length; i < len; i++) {
                    self.initObj();
                    // 0-未发布  1-审批中  2-已发布  未发布才能发布, 待审核是不能
                    switch (res.pageDTO.list[i].status) {
                        case '0':
                            res.pageDTO.list[i].statusStr = '未发布';
                            res.pageDTO.list[i].releaseFlag = true;
                            res.pageDTO.list[i].offlineFlag = false;
                            res.pageDTO.list[i].deleteFlag = true;
                            break;
                        case '1':
                            res.pageDTO.list[i].statusStr = '审批中';
                            res.pageDTO.list[i].releaseFlag = false;
                            res.pageDTO.list[i].offlineFlag = false;
                            res.pageDTO.list[i].deleteFlag = false;
                            break;
                        case '2':
                            res.pageDTO.list[i].statusStr = '已发布';
                            res.pageDTO.list[i].releaseFlag = false;
                            res.pageDTO.list[i].offlineFlag = true;
                            res.pageDTO.list[i].deleteFlag = false;
                            break;
                    }
                    list.push($.extend(self.obj, res.pageDTO.list[i]));
                }
                self.vm.list = list;
                if (needLaypage) {
                    self.vm.pageNumber = res.pageDTO.pageNumber;
                    self.vm.totalPages = Math.ceil(res.pageDTO.fullListSize / self.vm.objectsPerPage);
                    self.initLaypage(self.vm.totalPages, self.vm.pageNumber);
                }
            });
        },

        // 跳转到编辑页 (新增)
        editFun: function (activityCode, activityName, activityId) {
            var param = {
                activityCode: activityCode || '',
                activityName: activityName || '',
                activityId: activityId || '',
                status: status || '0'
            };
            location.href = 'act-edit.html?' + $.param(param);
        },

        // actionType   '00'---发布    '01'---下线    '02'----删除
        actionFun: function (activityId, flag, actionType) {
            var param = {
                    activityId: activityId
                },
                url = '',
                tip = '成功',
                confirmTip = '';
            // releaseFlag offlineFlag deleteFlag
            switch (actionType) {
                case '00':
                    if (!flag) {
                        common.msg('当前状态不能发布该活动');
                        return false;
                    }
                    url = 'market/campaign/admin/pubActivity';
                    tip = '发布成功';
                    confirmTip = '确认是否要发布';
                    break;
                case '01':
                    if (!flag) {
                        common.msg('当前状态不无需下线该活动');
                        return false;
                    }
                    url = 'market/campaign/admin/offlineActivity';
                    tip = '下线成功';
                    confirmTip = '确认是否要下线?';
                    break;
                case '02':
                    if (!flag) {
                        common.msg('当前状态不可删除该活动');
                        return false;
                    }
                    // 删除与分页查询接口url一样,肯定有问题
                    url = 'market/campaign/admin/deleteActivity';
                    tip = '删除成功';
                    confirmTip = '确认是否要删除?';
                    break;
            }
            if (url) {
                this.ajaxFun(url, param, tip, confirmTip, actionType);
            }
        },

        /**
         *
         * @param url 请求url
         * @param param 请求参数
         * @param tip 请求成功后提示方案
         * @param confirmTip 再次确认提示方案
         */
        ajaxFun: function (url, param, tip, confirmTip, actionType) {
            var self = this;
            common.confirm(confirmTip, '', function () {
                model.getOrSetData(url, param, function (res) {
                    common.msg(tip, {icon: 1}, function () {
                        if (actionType === '02') {
                            if (self.vm.list.length === 1 && self.vm.objectsPerPage !== '1') {
                                self.vm.pageNumber--;
                            }
                        } else {
                            self.vm.pageNumber = 1;
                        }
                        self.render(true);
                    });
                });
            });
        },

        // 下载获奖名单
        getAwardsList: function (actCode, actName) {
            this.vm.actCode = actCode;
            this.vm.actName = actName;
            this.vm.beginDate = '';
            this.vm.endDate = '';
            this.vm.offerCode = '';
            common.openMsg({title: '下载获奖名单', area: ['650px', 'auto']});
        },

        // 提交
        submit: function () {
            if (this.vm.beginDate === '') {
                common.msg('请选择开始活动时间');
                return false;
            }
            if (this.vm.endDate === '') {
                common.msg('请选择结束活动时间');
                return false;
            }
            if (new Date(this.vm.beginDate) > new Date(this.vm.endDate)) {
                common.msg('请选择正确的时间段');
                return false;
            }
            var param = '?beginDate=' + this.vm.beginDate + '&endDate=' + this.vm.endDate + '&activityCodes=' + this.vm.actCode + '&offerCode=' + this.vm.offerCode;
            this.loadIframe(APP.config.baseURI + 'market/campaign/admin/generateOfferClentReport.do' + param);
        },

        // 判断是否加载完成
        loadIframe: function (url, callback) {
            try {
                if (url === undefined) {
                    return false;
                }
                var val = url, iframe = $('<iframe id="loadingExcel"  style="position:absolute;top:-9999px,left:-99999px"/>')[0], loadingExcel = $('#loadingExcel'), isHas = false;
                iframe = document.createElement('iframe');
                if (loadingExcel.length > 0) {
                    iframe = loadingExcel[0];
                    isHas = true;
                }
                iframe.src = val;
                if (!isHas) {
                    $('body').append($(iframe));
                }
                layer.closeAll();
            } catch (e) {
                common.msg('系统异常，请稍后再试');
            }
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
                        self.vm.pageNumber = pageNo;
                        self.render(false);
                    }
                }
            });
        }
    });
    return List;
});
