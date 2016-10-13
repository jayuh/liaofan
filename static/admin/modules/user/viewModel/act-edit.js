/**
 * 活动详情编辑
 * Created by luojian883 on 16/8/16.
 *
 ***************   修改记录  *******************
 * 修改记录
 * 序号     原因               时间        行号
 * 1       增加用户中奖次数    2016-9-18   关键词: winTimes
 *
 *********************************************
 *
 */
define([
    'glass',
    'common',
    'avalon',
    'app/marketing/model/act-model',
    'utils',
    'select2',
    'laydate',
    'css!plugins/select2/css/select2.css'
], function (Class, common, avalon, model, utils, select2, laydate) {
    'use strict';
    var Edit = Class.create({
        initialize: function () {
            this.activityId = utils.getParamVal('activityId') || '';
            this.initViewModel();
            this.ajaxFlag = {
                getActivity: true,
                querywhitelist: false,
                activitywhitelistbyid: true
            };
            this.ruleList = {
                groupList: [],
                taskList: [],
                offerList: [],
                groupVal: '',
                taskVal: '',
                offerVal: ''
            };
            this.render();
        },
        initViewModel: function () {
            var self = this,
                opt = {
                    $id: 'root',
                    optType: true,
                    data: {
                        activityCode: '',
                        activityId: '',
                        activityName: '',
                        endTime: '',
                        remark: '',
                        startTime: '',
                        status: '0',
                        winTimes: '',
                        batchNoList: [],
                        ruleList: []
                    },
                    whiteList: [{
                        bankClientNo: '',
                        batchNo: '',
                        mediaSource: '',
                        flag: false
                    }],
                    ruleList: [
                        {
                            customerGroupName: '请点击编辑',
                            taskName: '请点击编辑',
                            offerPlanName: '请点击编辑',
                            groupVal: '',
                            taskVal: '',
                            offerVal: ''
                        }
                    ],
                    ruleSelectList: {
                        groupList: [],
                        taskList: [],
                        offerList: [],
                        groupVal: '',
                        taskVal: '',
                        offerVal: '',
                        index: 0
                    },
                    classFlag: true,
                    selectFlag: false,
                    ruleAdd: function () {
                        self.ruleAdd();
                    },
                    ruleDelete: function (index) {
                        self.ruleDelete(index);
                    },
                    ruleChange: function (item, index, type) {
                        self.ruleChange(item, index, type);
                    },
                    whiteListAdd: function (index) {
                        self.whiteListAdd(index);
                    },
                    whiteListDelete: function (index) {
                        self.whiteListDelete(index);
                    },
                    saveData: function () {
                        self.saveData();
                    },
                    toggle: function (type) {
                        self.toggle(type);
                    },
                    backFun: function () {
                        self.backFun();
                    },
                    ruleShowOrHide: function (flag) {
                        self.ruleShowOrHide(flag);
                    },
                    edit: function (flag, index) {
                        self.edit(flag, index);
                    },
                    confirmFun: function (flag, index) {
                        self.confirmFun(flag, index);
                    }
                };
            this.vm = avalon.define(opt);
            avalon.scan();
        },

        backFun: function () {
            location.href = 'act-list.html';
        },

        render: function () {
            if (this.activityId) {
                this.vm.optType = true;
            } else {
                this.vm.optType = false;
            }
            this.queryWhiteListAll();
            this.offerList();
        },

        // 切换白名单与规则
        toggle: function (type) {
            if (type === '00' && this.vm.classFlag === true) {
                return false;
            } else if (type === '01' && this.vm.classFlag === false) {
                return false;
            } else {
                this.vm.classFlag = !this.vm.classFlag;
            }
        },

        // 添加一条规则
        ruleAdd: function () {
            this.vm.ruleList.push({
                taskName: '请点击编辑',
                customerGroupName: '请点击编辑',
                offerPlanName: '请点击编辑',
                groupVal: '',
                taskVal: '',
                offerVal: ''
            });
        },

        // 删除一条规则
        ruleDelete: function (index) {
            if (this.vm.ruleList.length > 1) {
                if (index >= 0 && index < this.vm.ruleList.length) {
                    this.vm.ruleList.splice(index, 1);
                }
            } else {
                this.vm.ruleList = [{
                    taskName: '请点击编辑',
                    customerGroupName: '请点击编辑',
                    offerPlanName: '请点击编辑',
                    groupVal: '',
                    taskVal: '',
                    offerVal: ''
                }];
            }
        },

        // 获取客户群列表
        groupList: function () {
            var self = this,
                url = 'market/campaign/admin/querycustomergroup',
                data = {
                    objectsPerPage: 1000,
                    pageNumber: 1
                };
            this.ajaxFlag.querycustomergroup = false;
            model.getOrSetData(url, data, function (res) {
                res.pageDTO.list.unshift({
                    customerGroupName: '请选择',
                    customerGroupId: ''
                });
                // self.vm.ruleList[0].groupList = res.pageDTO.list;
                self.vm.ruleSelectList.groupList = res.pageDTO.list;
                self.ajaxFlag.querycustomergroup = true;
                self.taskList();
            });
        },
        // 获取任务列表
        taskList: function () {
            var self = this,
                url = 'market/campaign/admin/queryAllActivityTask',
                data = {
                    objectsPerPage: 1000,
                    pageNumber: 1
                };
            this.ajaxFlag.queryactivitytask = false;
            model.getOrSetData(url, data, function (res) {
                res.pageDTO.list.unshift({
                    taskName: '请选择',
                    activityTaskId: ''
                });
                // self.vm.ruleList[0].taskList = res.pageDTO.list;
                self.vm.ruleSelectList.taskList = res.pageDTO.list;
                self.ajaxFlag.queryactivitytask = true;
                self.queryActData();
            });
        },

        // 获取offer方案列表
        offerList: function () {
            var self = this,
                url = 'market/campaign/admin/getOfferPlanListPage.do',
                data = {
                    objectsPerPage: 1000,
                    pageNumber: 1
                };
            this.ajaxFlag.getOfferPlanListPage = false;
            model.getOrSetData(url, data, function (res) {
                res.pageDTO.list.unshift({
                    offerPlanName: '请选择',
                    offerPlanId: ''
                });
                // self.vm.ruleList[0].offerList = res.pageDTO.list;
                self.vm.ruleSelectList.offerList = res.pageDTO.list;
                self.ajaxFlag.getOfferPlanListPage = true;
                self.groupList();
            });
        },

        // 查询活动的其他信息
        queryActData: function () {
            if (!this.activityId) {
                return false;
            }
            var self = this,
                url = 'market/campaign/admin/getActivity',
                data = {
                    activityId: this.activityId
                };
            self.ajaxFlag.getActivity = false;
            // 获取数据
            model.getOrSetData(url, data, function (res) {
                self.ajaxFlag.getActivity = true;
                res.activity.batchNoList = self.vm.data.batchNoList.$model;
                self.vm.data = $.extend(self.vm.data.$model, res.activity);
                var list = [], i, len;
                for (i = 0, len = res.activity.offerRuleList.length; i < len; i++) {
                    list.push({
                        taskName: '',
                        customerGroupName: '',
                        offerPlanName: '',
                        groupVal: '',
                        taskVal: '',
                        offerVal: ''
                    });
                    list[i].taskVal = res.activity.offerRuleList[i].activityTaskId;
                    list[i].taskName = self.queryName(self.vm.ruleSelectList.taskList.$model, 'activityTaskId', 'taskName', res.activity.offerRuleList[i].activityTaskId, 0, 0);
                    list[i].groupVal = res.activity.offerRuleList[i].customerGroupId;
                    list[i].customerGroupName = self.queryName(self.vm.ruleSelectList.groupList.$model, 'customerGroupId', 'customerGroupName', res.activity.offerRuleList[i].customerGroupId, 0, 0);
                    list[i].offerVal = res.activity.offerRuleList[i].offerPlanId;
                    list[i].offerPlanName = self.queryName(self.vm.ruleSelectList.offerList.$model, 'offerPlanId', 'offerPlanName', res.activity.offerRuleList[i].offerPlanId, 0, 0);
                }
                self.vm.ruleList = list;
            });
        },

        // 查询所有的白名单列表
        queryWhiteListAll: function () {
            var self = this,
                url = 'market/campaign/admin/querywhitelist',
                data = {
                    objectsPerPage: 1000,
                    pageNumber: 1
                };
            model.getOrSetData(url, data, function (res) {
                self.ajaxFlag.querywhitelist = true;
                self.queryWhiteListAct(res.pageDTO.list);
            });
        },

        // 查询与这个活动绑定的白名单
        queryWhiteListAct: function (list) {
            if (!this.activityId) {
                this.vm.whiteList = this.inAarrayFun(list, []);
                return false;
            }
            if (this.activityId) {
                var self = this,
                    url = 'market/campaign/admin/activitywhitelist',
                    data = {
                        activityId: this.activityId,
                        objectsPerPage: 1000,
                        pageNumber: 1
                    };
                self.ajaxFlag.activitywhitelistbyid = false;
                model.getOrSetData(url, data, function (res) {
                    self.ajaxFlag.activitywhitelistbyid = true;
                    self.vm.data.batchNoList = res.pageDTO.list;
                    self.vm.whiteList = self.inAarrayFun(list, self.vm.data.batchNoList.$model);
                });
            }
        },

        // 保存数据
        saveData: function () {
            var self = this,
                url = '',
                data = this.vm.data.$model,
                list = [],
                i = 0,
                flag = true,
                ruleList = [],
                len = 0;
            data.batchNoList = [];
            data.ruleList = [];
            $.each(this.ajaxFlag, function (key, val) {
                if (!val) {
                    flag = false;
                    return false;
                }
            });
            if (data.winTimes % 1 !== 0) {
                common.msg('请中奖次数请填写整数');
                return false;
            }
            // 有部分接口数据还没有返回
            if (!flag) {
                common.msg('数据加载异常,请刷新后重试');
                return false;
            }
            for (i = 0, len = this.vm.data.batchNoList.length; i < len; i++) {
                list.push({batchNo: this.vm.data.batchNoList.$model[i].batchNo});
            }
            data.batchNoFormList = list;
            list = [];
            for (i = 0, len = this.vm.ruleList.length; i < len; i++) {
                ruleList = this.vm.ruleList.$model[i];
                if (ruleList.groupVal && ruleList.taskVal && ruleList.offerVal) {
                    list.push({
                        customerGroupId: ruleList.groupVal,
                        activityTaskId: ruleList.taskVal,
                        offerPlanId: ruleList.offerVal
                    });
                }
            }
            data.offerRuleFormList = list;
            if (this.activityId) {
                data.activityId = this.activityId;
                url = 'market/campaign/admin/updateActivity';
            } else {
                url = 'market/campaign/admin/addActivity';
            }
            model.getOrSetData(url, data, function (res) {
                common.msg('保存成功', {icon: 6}, function () {
                    self.backFun();
                });
            });
        },

        /**
         * 白名单批次号增加
         * @param index 选中对象的数组下标
         */
        whiteListAdd: function (index) {
            this.vm.whiteList[index].flag = false;
            this.vm.data.batchNoList.push(this.vm.whiteList[index]);
        },

        /**
         *白名单批次号删除
         * @param index
         */
        whiteListDelete: function (index) {
            this.vm.data.batchNoList.splice(index, 1);
            this.vm.whiteList = this.inAarrayFun(this.vm.whiteList.$model, this.vm.data.batchNoList.$model);
        },

        /*
         *
         * @param arr1 全数组
         * @param arr2 子数组
         * @returns {Array} list[0].flag = true 子数组有此项, list[0].flag = false 子数组里没有此项
         */
        inAarrayFun: function (arr1, arr2) {
            var i = 0,
                k = 0,
                len1 = arr1.length,
                len2 = arr2;
            for (i = 0, len1 = arr1.length; i < len1; i++) {
                arr1[i].flag = true;
                for (k = 0, len2 = arr2.length; k < len2; k++) {
                    if (arr1[i].batchNo === arr2[k].batchNo) {
                        arr1[i].flag = false;
                        break;
                    }
                }
            }
            return arr1;
        },

        /**
         *
         * @param list Array<Object> 搜索源数据
         * @param field String 搜索目标字段
         * @param regStr String 匹配字符
         * @returns arr Array<Object> 返回搜索结果
         */
        search: function (list, field, regStr) {
            var arr = [], obj;
            for (obj in list) {
                if (obj[field].indexOf(regStr) > -1) {
                    arr.push(obj);
                }
            }
            return arr;
        },

        edit: function (flag, index) {
            var self = this;
            this.vm.ruleSelectList.groupVal = this.vm.ruleList[index].groupVal;
            this.vm.ruleSelectList.taskVal = this.vm.ruleList[index].taskVal;
            this.vm.ruleSelectList.offerVal = this.vm.ruleList[index].offerVal;
            this.vm.ruleSelectList.index = index;
            $('#customerGroupId').select2();
            $('#activityTaskId').select2();
            $('#offerPlanId').select2();

            $('#customerGroupId').on('select2:select', function (evt) {
                self.vm.ruleSelectList.groupVal = evt.currentTarget.value;
            });
            $('#activityTaskId').on('select2:select', function (evt) {
                self.vm.ruleSelectList.taskVal = evt.currentTarget.value;
            });
            $('#offerPlanId').on('select2:select', function (evt) {
                self.vm.ruleSelectList.offerVal = evt.currentTarget.value;
            });
            this.ruleShowOrHide(flag);
        },

        confirmFun: function (flag, index) {
            var val = index + '';
            if (val) {
                this.vm.ruleList[index].groupVal = this.vm.ruleSelectList.groupVal;
                this.vm.ruleList[index].taskVal = this.vm.ruleSelectList.taskVal;
                this.vm.ruleList[index].offerVal = this.vm.ruleSelectList.offerVal;
                this.vm.ruleList[index].customerGroupName = this.queryName(this.vm.ruleSelectList.groupList.$model, 'customerGroupId', 'customerGroupName', this.vm.ruleSelectList.groupVal, 0, 0);
                this.vm.ruleList[index].taskName = this.queryName(this.vm.ruleSelectList.taskList.$model, 'activityTaskId', 'taskName', this.vm.ruleSelectList.taskVal, 0, 0);
                this.vm.ruleList[index].offerPlanName = this.queryName(this.vm.ruleSelectList.offerList.$model, 'offerPlanId', 'offerPlanName', this.vm.ruleSelectList.offerVal, 0, 0);
            }
            this.ruleShowOrHide(flag);
        },

        /**
         *
         * @param type
         * @param flag
         */
        ruleShowOrHide: function (flag) {
            if (flag === 'true') {
                this.vm.selectFlag = true;
            } else {
                this.vm.selectFlag = false;
            }
        },

        /**
         *
         * @param list Array<Object> 数据源
         * @param field String 比较字段
         * @param backField String 返回字段
         * @param id String 比较值
         * @returns {string} 返回值
         * 一个方法只有一个var
         */
        queryName: function (list, field, backField, id, i, len) {
            for (i = 0, len = list.length; i < len; i++) {
                var obj = list[i];
                if (obj[field] === id) {
                    return obj[backField];
                }
            }
            return '';
        }

    });
    return Edit;
});
