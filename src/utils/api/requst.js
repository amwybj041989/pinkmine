import axios from 'axios'
// import router from "@/router"
// // import i18n from '@/i18n'
import store from '@/store'
import {
	Snackbar
} from '@varlet/ui'
import {
	baseUrl
} from '../config.js'
let request = axios.create({
	withCredentials: false,
	baseURL: baseUrl,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	// transformRequest: [(data) => {
	// 	console.log(data);
	// 	// 将JavaScript对象转换为URL编码的表单数据
	// 	let ret = '';
	// 	for (let it in data) {
	// 		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
	// 	}
	// 	return ret.substring(0, ret.length - 1);
	// }]
})

function paramsToFormData(obj) {
	const formData = new FormData();
	Object.keys(obj).forEach((key) => {
		if (obj[key] instanceof Array) {
			obj[key].forEach((item) => {
				formData.append(key, item);
			});
			return;
		}
		formData.append(key, obj[key]);
	});
	return formData;
}
request.interceptors.request.use(
	(config) => {
		// store.commit('setLoading', true)
		// console.log(config);
		if (config.url == '/checkPhoneCode') {
			config['headers']['Content-Type'] = 'application/json'
		}
		if (config.url == '/upload') {
			console.log('upload');
			config['headers']['Content-Type'] = 'multipart/form-data'
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
request.interceptors.response.use(
	(res) => {
		store.commit('setLoading', false)
		// if (res.data.code == 102 || res.data.code == 101) {
		// 	Snackbar.error(res.data.message)
		// 	return false
		// }
		// if (res.data.code != 200) {
		// 	Snackbar.error(res.data.message)
		// 	return false;
		// }

		return res.data;
	},
	(error) => {
		store.commit('setLoading', false)
		if (process.env.NODE_ENV != 'dev') {
			Snackbar.error(error.message)
			return Promise.reject(error);
		}
		console.log(error.message);
		return error.message;
	}
);

export default request