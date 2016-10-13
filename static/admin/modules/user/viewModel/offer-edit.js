/**
 * @description 事例页面
 * Created by SHENXIAOLONG029 on 16/8/10.
 */
define([
    'glass',
    'common',
    'utils',
    'avalon',
    'laydate',
    'laypage',
    'select2',
    'app/marketing/model/offer-model',
    'css!plugins/select2/css/select2.css'
], function (Class, common, utils, avalon, laydate, laypage, select2, model) {
    'use strict';
    var Index = Class.create({
        initialize: function () {
            this.offerId = utils.getParamVal('id');
            if (this.offerId) {
                this.Isdisable = true;
            } else {
                this.Isdisable = false;
            };
            this.initViewModel();
            this.getOfferTypeList();
            this.getOfferSupplierList();
            this.getOne();
            this.completeSel = 0;
        },

        /**
         * 初始化VM
         */
        initViewModel: function () {
            var opt = {
                offerTypeName: '',
                offerTypeCode: '',
                supplierName: '',
                supplierCode: '',
                Isdisable: this.Isdisable,
                OfferTypeList: [],
                OfferSupplierList: [],
                one: {
                    autoResource: '',
                    offerName: '',
                    offerCode: '',
                    offerTypeCode: '',
                    supplierCode: '',
                    goodsTotalNum: '',
                    goodsValidType: '',
                    goodsValidPeriod: '',
                    goodsStartDate: '',
                    goodsEndDate: '',
                    title: '',
                    shortDescription: '',
                    description: '',
                    useCondition: '',
                    iconCode: '',
                    goodsCode: '',
                    goodsName: '',
                    marketPrice: '',
                    goodsPrice: '',
                    totalPrice: ''
                }
            };
            this.vm = avalon.define(common.createViewModel(this, opt));
            avalon.scan();
        },

        // 查询
        getOne: function () {
            var self = this, param;
            if (this.offerId) {
                param = {offerId: this.offerId};
                model.get(param, function (result) {
                    if (result && result.responseCode === '000000') {
                        self.vm.one = result.offer;
                        self.completeSel++;
                        if (self.completeSel === 3) {
                            self.selectSearch();
                        }
                    } else {
                        common.msg(result.responseMsg);
                    }
                });
            }
        },

        // 获取offer类型
        getOfferTypeList: function () {
            var self = this, param = {};
            model.getOfferTypeList(param, function (result) {
                if (result && result.responseCode === '000000') {
                    self.vm.OfferTypeList = result.offerTypeList;
                    self.completeSel++;
                    if (self.completeSel === 3) {
                        self.selectSearch();
                    }
                } else {
                    common.msg(result.responseMsg);
                }
            });
        },

        // 获取供应商
        getOfferSupplierList: function () {
            var self = this, param = {};
            model.getOfferSupplierList(param, function (result) {
                if (result && result.responseCode === '000000') {
                    self.vm.OfferSupplierList = result.offerSupplierList;
                    self.completeSel++;
                    if (self.completeSel === 3) {
                        self.selectSearch();
                    }
                } else {
                    common.msg(result.responseMsg);
                }
            });
        },
        // 保存数据
        save: function () {
            if (this.offerId) {
                this.vm.Isdisable = true;
                this.modify();
            } else {
                this.add();
                this.vm.Isdisable = false;
            }
        },

        // 添加一条offer
        add: function () {
            var param = this.vm.one.$model;
            param.offerCode = param.offerCode.trim();
            if (param.offerCode === '') {
                common.msg('请输入offer编码');
                return false;
            }
            model.add(param, function (data) {
                if (data && data.responseCode === '000000') {
                    common.msg('添加成功！', {icon: 1}, function () {
                        location.href = 'offer.html';
                    });
                } else {
                    common.msg(data.responseMsg || '添加失败');
                }
            });
        },

        // 修改一条offer
        modify: function () {
            var param = this.vm.one.$model;
            model.modify(param, function (data) {
                if (data && data.responseCode === '000000') {
                    common.msg('修改成功！', {icon: 1}, function () {
                        location.href = 'offer.html';
                    });
                } else {
                    common.msg(data.responseMsg || '修改失败');
                }
            });
        },

        // select2
        selectSearch: function () {
            var self = this;
            $('#input03').select2();
            $('#input04').select2();
            $('#input03').on('select2:select', function (evt) {
                self.vm.one.offerTypeCode = evt.currentTarget.value;
            });
            $('#input04').on('select2:select', function (evt) {
                self.vm.one.supplierCode = evt.currentTarget.value;
            });
        }

    });

    return Index;
});
