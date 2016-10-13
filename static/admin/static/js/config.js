requirejs.config({
    "baseUrl": APP.config.baseUrl + '/js/global' || '/assets/static/js/global',
    "urlArgs": "t=20160811",
    "waitSeconds": 20,
    "enforceDefine": false,
    "paths": {
        "app"       : "../../../modules",
        "common"    : "../../../modules/global/common",
        "plugins"   : "../../plugins",
        "utils"     : "../../../modules/global/utils",
        "glass"     : "../../libs/class",
        "json2"     : "../../libs/json2",
        "pubsub"    : "../../libs/pubsub",
        "store"     : "../../libs/store",
        "jquery"    : "../../plugins/jQuery/jquery-1.12.1.min",
        "layer"     : "../../plugins/layer/layer",
        "laypage"   : "../../plugins/laypage/laypage",
        "laydate"   : "../../plugins/laydate/laydate",
        "text"      : "../../vendors/requirejs/text",
        "avalon"    : "../../vendors/avalon/1.4.7.2/avalon.shim",
        "ajaxFileUpload": "../../plugins/ajaxfileupload",
        "select2"   : "../../plugins/select2/js/select2",
        "jquery-form": "../../plugins/jquery-form"
    },
    "packages": [
        {
            "name": "moment",
            "location": "vendors/moment"
        }
    ],
    "map": {
        "*": {
            "css": APP.config.baseUrl + "/vendors/requirejs/css.min.js"
        }
    },
    "shim": {
        "avalon": {
            "exports": "avalon"
        },
        "layer": {
            "deps": ["jquery"]
        }
    }
});
