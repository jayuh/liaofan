/**
 * @description offer组编辑
 * Created by XIAOMQ
 */
define([
    'glass',
    'common',
    'utils',
    'avalon',
    'laydate',
    'app/marketing/model/offer-group-model'
], function (Class, common, utils, avalon, laydate, model) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.offerGroupId = utils.getParamVal('id');
            this.initViewModel();
            this.getOfferGroupObject();
            this.relatListObj = {}; // 已绑定的数据, 用于页面逻辑判断
        },

        /**
         * 初始化vm
         */
        initViewModel: function () {
            var opt = {
                optType: true,
                title: '',
                iconCode: '',
                offerGroupCode: '',
                offerGroupName: '',
                offerNameSearch: '',
                remark: '',
                isEmpty1: '',
                offerList: [], // 所有offer数据
                notRelatList: [], // 未绑定的offer数据
                relatList: [], // 已绑定的offer数据
                addOffer: $.proxy(this.addOffer, this), // 添加
                deleteOffer: $.proxy(this.deleteOffer, this), // 删除
                saveInfo: $.proxy(this.saveInfo, this), // 保存
                searchList: $.proxy(this.searchList, this)
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },
        searchList: function () {
            this.getOfferGroupListPage();
        },
        // offer组查询
        getOfferGroupObject: function () {
            var self = this;
            // 没有id就是添加
            if (!self.offerGroupId) {
                // 如果是增加则查询所有未绑定的offer
                self.vm.optType = true;
                self.getOfferGroupListPage();
            } else {
                self.vm.optType = false;
                model.getOfferGroupList({
                    offerGroupId: self.offerGroupId
                }, function (result) {
                    if (result && result.responseCode === '000000') {
                        self.getOfferGroupListPage(); // 获取未绑定数据
                        if (result.offerGroup.offerList) {
                            self.vm.relatList = result.offerGroup.offerList; // 已经绑定数据
                        }
                        self.vm.title = result.offerGroup.title;
                        self.vm.offerGroupCode = result.offerGroup.offerGroupCode;
                        self.vm.offerGroupName = result.offerGroup.offerGroupName;
                        self.vm.iconCode = result.offerGroup.iconCode;
                        self.vm.remark = result.offerGroup.remark;
                        avalon.each(result.offerGroup.offerList, function (i, item) {
                            self.relatListObj[item.offerId] = item;
                        });
                    } else {
                        layer.msg('请求异常，请稍候再试！', {icon: 5, time: 2000});
                    }
                });
            }
        },

        // offer列表查询(左边为未绑定)
        getOfferGroupListPage: function () {
            var self = this,
                data = {
                    offerName: self.vm.offerNameSearch
                };
            model.getOfferList(data, function (result) {
                if (result && result.responseCode === '000000') {
                    avalon.each(result.offerList, function (index, item) {
                        item.isRelated = false;
                        if (self.relatListObj[item.offerId]) {
                            item.isRelated = true;
                        }
                    });
                    self.vm.notRelatList = result.offerList;
                } else {
                    layer.msg('请求异常，请稍候再试！', {icon: 5, time: 2000});
                }
            });
        },

        addOffer: function (item) {
            var obj = {
                offerId: item.offerId,
                offerName: item.offerName,
                offerCode: item.offerCode
            };
            item.isRelated = true;
            if (!this.relatListObj[item.offerId]) {
                this.relatListObj[item.offerId] = obj;
                this.vm.relatList.push(obj);
            }
        },

        deleteOffer: function (item) {
            this.vm.relatList.remove(item);
            delete this.relatListObj[item.offerId];
            avalon.each(this.vm.notRelatList, function (i, c) {
                if (c.offerId === item.offerId) {
                    c.isRelated = false;
                }
            });
        },

        saveInfo: function () {
            var offerListArr = [],
                param = null;
            avalon.each(this.vm.relatList, function (i, item) {
                offerListArr.push({offerId: item.offerId});
            });
            param = {
                offerGroupCode: this.vm.offerGroupCode,
                offerGroupName: this.vm.offerGroupName,
                iconCode: this.vm.iconCode,
                remark: this.vm.remark,
                title: this.vm.title,
                offerList: offerListArr
            };
            if (!this.offerGroupId) {
                model.addOfferGroup(param, $.proxy(this.renderSaveInfo, this));
            } else {
                param.offerGroupId = this.offerGroupId;
                model.updateOfferGroup(param, $.proxy(this.renderSaveInfo, this));
            }
        },

        renderSaveInfo: function (result) {
            if (result && result.responseCode === '000000') {
                common.msg('保存成功', {icon: 6}, function () {
                    location.href = 'offer-group.html';
                });
            } else {
                layer.alert('保存失败', {icon: 5, title: 'offer组管理', btn: '知道了', skin: 'btn-class'});
            }
        }
    });

    return Index;
});
