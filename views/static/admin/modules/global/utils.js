define(function () {
    'use strict';
    var Utils = {
        /**
         * 获取URL全部参数值
         * 对中文参数自动解码
         */
        getParamVals: function () {
            var item, obj = {},
                href = location.href,
                str = href.substr(href.lastIndexOf('?') + 1),
                arr = str.split('&');
            $.each(arr, function (k, v) {
                item = v.split('=');
                obj[item[0]] = item[1];
            });
            return obj;
        },

        /**
         * 加法优化，避免浮点误差
         * @param arg1
         * @param arg2
         * @returns {String}
         */
        calcAdd: function (arg1, arg2) {
            var r1, r2, m;
            try {
                r1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            return (arg1 * m + arg2 * m) / m;
        },

        /**
         * 减法优化，避免浮点误差
         * @param arg1
         * @param arg2
         * @returns {String}
         */
        calcSub: function accSub (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg2.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg1.toString().split('.')[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            // last modify by deeka
            // 动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        },

        /**
         * 乘法优化，避免浮点误差
         * @param arg1
         * @param arg2
         * @returns {String}
         */
        calcMul: function accMul (arg1, arg2) {
            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString();
            try {
                m += s1.split('.')[1].length;
            } catch (e) {}
            try {
                m += s2.split('.')[1].length;
            } catch (e) {}
            return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
        },

        /**
         * 除法优化，避免浮点误差
         * @param arg1
         * @param arg2
         * @returns {String}
         */
        calcDiv: function accDiv (arg1, arg2) {
            var t1 = 0,
                t2 = 0,
                r1, r2;
            try {
                t1 = arg1.toString().split('.')[1].length;
            } catch (e) {}
            try {
                t2 = arg2.toString().split('.')[1].length;
            } catch (e) {}
            r1 = Number(arg1.toString().replace('.', ''));
            r2 = Number(arg2.toString().replace('.', ''));
            return (r1 / r2) * Math.pow(10, t2 - t1);
        },

        /**
         *  全角转半角
         * @param obj
         * @returns {boolean}
         */
        toDBC: function (obj) {
            var DBCStr = '';
            if (!obj || !obj.value) {
                return true;
            }
            /*eslint-disable one-var */
            for (var i = 0; i < obj.value.length; i++) {
                var c = obj.value.charCodeAt(i);

                if (c === 12288) {
                    DBCStr += String.fromCharCode(32);
                    continue;
                }
                if (c > 65280 && c < 65375) {
                    DBCStr += String.fromCharCode(c - 65248);
                    continue;
                }
                DBCStr += String.fromCharCode(c);
            }
            obj.value = DBCStr;
            /* eslint-enable one-var */
        },

        /**
         * 判断参数是否为对象
         * @param [Object] value
         */
        isObject: function (value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        },
        /**
         * 获取URL参数值
         * @param  {[type]} paramName [要获取的参数名]
         * @return {[type]}           [参数值]
         */
        getParamVal: function (paramName) {
            var typeMatch = location.search.match(new RegExp('\\b' + paramName + '=([^&=]+)'));
            return typeMatch ? typeMatch[1] : '';
        }
    };
    return Utils;
});
