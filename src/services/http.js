import axios from 'axios'
import $config from '@/config/index'
import Auth from './auth'
import router from '@/router'
import { Message  } from 'element-ui'

// axios 配置
axios.defaults.timeout = 30000
axios.defaults.baseURL = $config.baseUrl;

// http request 拦截器
axios.interceptors.request.use(
	config => {
		let token = Auth.getToken()
		if (token) {
			config.headers['x-access-token'] = token
		}
		return config
	},
	err => {
		return Promise.reject(err)
	}
)
axios.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					// 401 清除token信息并跳转到登录页面
					Auth.logout();
					Message.error('请重新登录');
					router.replace({
						path: '/login',
						query: {
							redirect: router.currentRoute.fullPath
						}
					})
					break;
				case 403:
					// 403 用户没有权限访问
					router.replace({
						path: '/403',
						query: {
							redirect: router.currentRoute.fullPath
						}
					})	
					Message.error('抱歉，您没有权限访问,请与系统管理员联系!')
					break;
				default:
					Message.error('请求失败，服务器错误!')
					break;
			}
		}
		return Promise.reject(error)
	}
)
export default axios