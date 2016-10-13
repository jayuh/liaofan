/**
 * @description 编辑任务
 * Created by SHENXIAOLONG029 on 16/8/16.
 */
define([
    'glass',
    'common',
    'avalon',
    'app/marketing/model/task-model'
], function (Class, common, avalon, model) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.activityTaskId = '';
            this.initViewModel();
            this.initPageData();
            this.getTaskTypeList();
        },

        // 初始化VM
        initViewModel: function () {
            var self = this;
            this.vm = avalon.define({
                $id: 'root',
                // 添加 or 修改
                operate: '',
                // 需要提交的数据
                data: {
                    taskName: '',
                    propertyValues: []
                },
                // 任务类型ID
                taskType: 'zero', // 任务id
                taskTypeId: '',
                // 任务类型列表
                taskTypeList: [],
                // 任务属性列表
                taskPropertyList: [],
                save: $.proxy(self.save, self),
                checkedProperty: $.proxy(self.checkedProperty, self),
                goback: $.proxy(self.goback, self)
            });
            this.vm.$watch('taskType', function (val) {
                if (val !== 'zero') {
                    var taskTypeId = $('#taskType option:selected').attr('data-tasktypeid');
                    self.getTaskPropertyList(taskTypeId);
                }
            });
            avalon.scan();
        },

        // 初始化页面数据
        initPageData: function () {
            if (common.utils.getParamVal('operate') === 'add') {
                this.vm.operate = 'add';
            } else if (common.utils.getParamVal('operate') === 'edit' && common.utils.getParamVal('activityTaskId') !== '') {
                this.vm.operate = 'edit';
                this.activityTaskId = common.utils.getParamVal('activityTaskId');
                this.get();
            } else {
                common.msg('url传参有误，请检查！');
            }
        },
        // 获取数据
        get: function () {
            var self = this,
                param = { activityTaskId: this.activityTaskId };
            model.get(param, function (data) {
                if (data && data.responseCode === '000000') {
                    var fn = function () {
                        self.vm.taskType = data.task.taskType;
                        self.vm.data.taskName = data.task.taskName;
                        $.each(self.vm.taskTypeList, function (i, n) {
                            if (n.taskTypeCode === data.task.taskType) {
                                self.needMatchingTaskPropertyList = true;
                                // 将 propertyValues 暂时存放在 self.tempPropertyValues 中，等拿到任务属性列表之后再进行匹配
                                self.tempPropertyValues = data.task.propertyValues;
                            }
                        });
                    };
                    // 这么做的目的：必须在获得任务类型列表之后，在进行以下逻辑
                    if (self.vm.taskTypeList.length > 0) {
                        fn();
                    } else {
                        setTimeout(fn, 500);
                    }
                } else {
                    common.msg(data.responseMsg);
                }
            });
        },

        // 收集数据
        gatherData: function () {
            this.gatherDataForPropertyValues();
            this.gatherDataForTaskTypeCode();
        },

        // 收集 propertyValues
        gatherDataForPropertyValues: function () {
            var self = this,
                taskPropertyList = this.vm.taskPropertyList,
                propertyValues = [];
            $.each(taskPropertyList, function (i, n) {
                if (n.checked && n.value !== '') {
                    propertyValues.push({
                        propertyId: n.propertyId,
                        myselfValue: n.value
                    });
                }
            });
            self.vm.data.propertyValues = [];
            self.vm.data.propertyValues = propertyValues;
        },

        // 收集 taskTypeCode
        gatherDataForTaskTypeCode: function () {
            // var self = this, taskTypeList = self.vm.taskTypeList;
            // $.each(taskTypeList, function (i, n) {
                // if (n.taskTypeId === self.vm.taskTypeId) {
                    // self.vm.data.taskTypeCode = n.taskTypeCode;
                // }
            // });
        },

        /**
         * 提交数据
         */
        save: function () {
            this.gatherData();
            if (!this.validate()) {
                return;
            }
            if (this.vm.operate === 'add') {
                this.add();
            } else if (this.vm.operate === 'edit') {
                this.modify();
            }
        },

        // 添加一条task
        add: function () {
            var self = this,
                param = self.vm.data;
            param.taskType = self.vm.taskType;
            model.add(param, function (data) {
                if (data && data.responseCode === '000000') {
                    common.msg('添加成功！', {icon: 1}, function () {
                        self.goback();
                    });
                } else {
                    common.msg(data.responseMsg);
                }
            });
        },

        // 修改一条task
        modify: function () {
            var self = this,
                param = self.vm.data;
            param.taskId = self.activityTaskId;
            param.taskType = self.vm.taskType;
            model.modify(param, function (data) {
                if (data && data.responseCode === '000000') {
                    common.msg('修改成功！', {icon: 1}, function () {
                        self.goback();
                    });
                } else {
                    common.msg(data.responseMsg);
                }
            });
        },

        // 校验
        validate: function () {
            return true;
        },

        // 任务类型列表查询
        getTaskTypeList: function () {
            var self = this;
            model.getTaskTypeList({}, function (data) {
                if (data && data.responseCode === '000000') {
                    self.vm.taskTypeList = data.taskTypeList;
                }
            });
        },

        // 任务属性列表查询
        getTaskPropertyList: function (taskTypeId) {
            var self = this, param = { taskTypeId: taskTypeId };
            model.getTaskPropertyList(param, function (data) {
                if (data && data.responseCode === '000000') {
                    if (self.needMatchingTaskPropertyList) {
                        // 需要将任务属性与旧数据进行匹配
                        self.needMatchingTaskPropertyList = false;
                        $.each(data.propertyList, function (i, n) {
                            var isMatching = false;
                            $.each(self.tempPropertyValues, function (j, m) {
                                if (m.propertyId === n.propertyId) {
                                    isMatching = true;
                                    n.checked = true;
                                    n.value = m.propertyValue;
                                }
                            });
                            if (!isMatching) {
                                n.checked = false;
                                n.value = '';
                            }
                        });
                        self.vm.taskPropertyList = data.propertyList;
                    } else {
                        // 全新的数据
                        $.each(data.propertyList, function (i, n) {
                            n.checked = false;
                            n.value = '';
                        });
                        self.vm.taskPropertyList = data.propertyList;
                    }
                }
            });
        },

        // 添加/取消 关联的属性
        checkedProperty: function (el) {
            if (el.checked) {
                el.value = '';
                el.checked = false;
            } else {
                el.checked = true;
            }
        },

        // 返回
        goback: function () {
            history.go(-1);
        }
    });

    return Index;
});
