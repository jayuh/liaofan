/**
 * @description 任务管理
 * Created by SHENXIAOLONG029 on 16/8/16.
 */
define([
    'glass',
    'common',
    'utils',
    'avalon',
    'app/marketing/model/offer-scheme-model'
], function (Class, common, utils, avalon, model) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.offerPlanId = utils.getParamVal('id');
            this.initViewModel();
            this.getOfferPlanObject();
            this.offerGroupListObj = {}; // 已添加对象（右边）
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var opt = {
                validStartDate: '',
                validEndDate: '',
                offerPlanCode: '',
                offerPlanName: '',
                showDisabledCode: false,
                offerGroupName: '', // offer组名称
                remark: '', // 备注
                title: '', // 标题
                lendType: '1', // 发送方式
                offerGroupList: [], // 已添加数组（右边）
                offerGroupListNot: [], // 未添加数组（左边）
                addOffer: $.proxy(this.addOffer, this), // 点击添加绑定
                deleteOffer: $.proxy(this.deleteOffer, this), // 点击删除绑定
                offerSave: $.proxy(this.offerSave, this), // 点击保存
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
            this.getOfferGroupListPage();
        },
        // offer方案查询(右边已绑定)
        getOfferPlanObject: function () {
            var self = this;
            self.vm.offerGroupList = [];
            self.offerGroupListObj = {};
            // 添加操作（没有id参数）
            if (!self.offerPlanId) {
                self.vm.showDisabledCode = true;
                self.getOfferGroupListPage(); // 获取未绑定数据
                return;
            };
            // 编辑操作
            model.getOfferPlanObject({offerPlanId: self.offerPlanId}, $.proxy(self.renderGetOfferPlanObject, self));
        },
        // offer方案查询(右边已绑定)(回调)
        renderGetOfferPlanObject: function (result) {
            var self = this;
            if (result && result.responseCode === '000000') {
                self.vm.offerGroupList = result.offerPlan.offerGroupList || [];
                self.vm.title = result.offerPlan.title || '';
                self.vm.lendType = result.offerPlan.lendType || '';
                self.vm.offerPlanCode = result.offerPlan.offerPlanCode || '';
                self.vm.remark = result.offerPlan.remark || '';
                self.vm.offerPlanName = result.offerPlan.offerPlanName || '';
                self.getOfferGroupListPage(); // 获取未绑定数据
                avalon.each(result.offerPlan.offerGroupList, function (i, c) {
                    self.offerGroupListObj[c.offerGroupId] = c;
                });
            } else {
                layer.msg('请求异常，请稍候再试！', {icon: 5, time: 2000});
            }
        },

        // offer组列表分页查询(左边未绑定)
        getOfferGroupListPage: function () {
            var self = this,
                data = {
                    pageNumber: 1,
                    offerGroupName: self.vm.offerGroupName.trim(),
                    objectsPerPage: 10000000
                };
            model.getOfferGroupListPage(data, $.proxy(self.renderGetOfferGroupListPage, self));
        },
        // offer组列表分页查询(左边未绑定)(回调)
        renderGetOfferGroupListPage: function (result) {
            var self = this;
            if (result && result.responseCode === '000000') {
                avalon.each(result.pageDTO.list, function (i, c) {
                    c.isAdd = false;
                    if (self.offerGroupListObj[c.offerGroupId]) {
                        c.isAdd = true;
                    };
                });
                self.vm.offerGroupListNot = result.pageDTO.list;
            } else {
                layer.msg('请求异常，请稍候再试！', {icon: 5, time: 2000});
            }
        },
        // 点击添加绑定
        addOffer: function (item) {
            var self = this, obj;
            item.isAdd = true;
            obj = {
                offerGroupCode: item.offerGroupCode,
                offerGroupId: item.offerGroupId,
                offerGroupName: item.offerGroupName
            };
            if (!self.offerGroupListObj[item.offerGroupId]) {
                self.offerGroupListObj[item.offerGroupId] = obj;
                self.vm.offerGroupList.push(obj);
            };
        },
        // 点击删除绑定
        deleteOffer: function (item) {
            var self = this;
            self.vm.offerGroupList.remove(item);
            delete self.offerGroupListObj[item.offerGroupId];
            avalon.each(self.vm.offerGroupListNot, function (i, c) {
                if (c.offerGroupId === item.offerGroupId) {
                    c.isAdd = false;
                    return false;
                };
            });
        },
        // 点击保存提交数据
        offerSave: function () {
            var self = this, data = {}, offerGroupList = [];
            avalon.each(self.vm.offerGroupList, function (i, c) {
                offerGroupList.push({offerGroupId: c.offerGroupId});
            });
            data = {
                offerGroupList: offerGroupList,
                remark: self.vm.remark.trim(),
                offerPlanName: self.vm.offerPlanName.trim(),
                title: self.vm.title.trim(),
                lendType: self.vm.lendType.trim()
            };
            // 新增保存
            if (!self.offerPlanId) {
                data.offerPlanCode = self.vm.offerPlanCode.trim();
                model.addOfferPlan(data, $.proxy(self.renderOfferSave, self));
            } else { // 编辑保存
                data.offerPlanId = self.offerPlanId;
                model.updateOfferPlan(data, $.proxy(self.renderOfferSave, self));
            }
        },
        // 点击保存提交数据(回调)
        renderOfferSave: function (result) {
            if (result && result.responseCode === '000000') {
                layer.alert('保存成功', {icon: 1, title: 'offer方案管理', btn: '知道了', skin: 'btn-class'
                }, function () {
                    location.href = 'offer-scheme.html';
                });
            } else {
                layer.alert('保存失败', {icon: 5, title: 'offer方案管理', btn: '知道了', skin: 'btn-class'});
            }
        }
    });

    return Index;
});
