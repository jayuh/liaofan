(function (global, undefined) {
    'use strict';
    // 应用最顶层设计
	var APP = {version: '20160811', environment: 'prd', Global: { debug: 0 }};
	// 生产环境，baseUrl模块根路径，baseURI后台接口根路径
    APP.production = { baseUrl: '/admin/assets/static', baseURI: '/' };
	// 开发 测试接口
    APP.development = { baseUrl: '/admin/assets/static', baseURI: 'http://10.14.217.18:8080/'};
	// 测试
    APP.staging = { baseUrl: '/admin/assets/static', baseURI: '/'};
    
	if (/10|127|localhost/.test(location.hostname)) {
		APP.environment = 'dev'
	    if (APP.Global.debug === 1) {
	      	APP.development.baseURI = APP.staging.baseURI
	    }
	} else if (/stg|p1|test/.test(location.hostname)) {
		APP.environment = 'stg';
	}
	switch (APP.environment) {
		case 'prd':
			APP.config = APP.production;
			break;
		case 'stg':
			APP.config = APP.staging;
			break;
		default:
			APP.config = APP.development;
	}
	global.APP = APP;

})(this);