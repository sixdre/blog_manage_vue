/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

import setting from './setting'

let baseUrl = setting.remoteHost; 
let routerMode = setting.routerMode;
let imgBaseUrl = setting.imgBaseUrl;

if (process.env.NODE_ENV == 'development') {
	
}else if(process.env.NODE_ENV == 'production'){
	baseUrl = 'http://47.94.206.86:7893/'
}

export default{
	baseUrl,
	routerMode,
	imgBaseUrl
}
