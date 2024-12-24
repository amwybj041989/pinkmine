import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { showNotify } from 'vant';
import useStateStore from '@/stores/state';
// const state = useStateStore();
import { i18n } from '@/utils/i18n';
// console.log(i18n);
// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'accessToken';
let baseURL = 'https://api.zhifu.one';
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  baseURL: baseURL,
  timeout: 6000, // 请求超时时间
});

export type RequestError = AxiosError<{
  message?: string;
  result?: any;
  errorMessage?: string;
}>;

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  console.log('errorHandler', error);
  if (error.status == 500) {
    let state = useStateStore();
    state.setLoading(false);
    showNotify({
      type: 'danger',
      message: 'network error',
    });
    return;
  }
  if ((error.code = 'ECONNABORTED')) {
    // window.location.reload();
    let state = useStateStore();
    state.setLoading(false);
    showNotify({
      type: 'danger',
      message: error.message,
    });
    return;
  }
  if (error.response) {
    const { data = {}, status } = error.response;
    if (!data.success) {
      let state = useStateStore();
      state.setLoading(false);

      showNotify({
        type: 'danger',
        message: data && data.message,
      });

      return;
    }
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: data && data.message,
      });
    }
    // 401 未登录/未授权
    if (status === 401) {
      // if (localStorage.address && localStorage.chainId) {
      //   let state = useStateStore();
      //   state.login({
      //     chain: localStorage.chainId * 1,
      //     address: localStorage.address,
      //   });
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 500);
      //   return;
      // }
      showNotify({
        type: 'danger',
        message: i18n.global.t('msg.noLogin'),
      });
      // 如果你需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error);
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const savedToken = localStorage.getItem('token');
  config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  if (savedToken) config.headers['Authorization'] = `Bearer ${savedToken}`;
  return config;
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler);

// 响应拦截器
function responseHandler(response: { data: any }) {
  // console.log('responseHandler', response);
  if (response.status == 200 && response.data.success) {
    return response.data;
  } else {
    // console.log('responseHandler', response);
    let state = useStateStore();
    state.setLoading(false);
    // if (response.data.message) {
    //   showNotify({
    //     type: 'danger',
    //     message: response.data.message,
    //   });
    //   return;
    // }
    showNotify({
      type: 'danger',
      message: i18n.global.t('msg.networkError'),
    });
    return null;
    // return {
    //   success: false,
    //   message: '',
    //   data: null,
    // };
  }
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler);

export default request;
