import * as axios from 'axios'
import { Message, Loading } from 'element-ui'
// axios.defaults.baseURL = '/api'
axios.defaults.baseURL = 'http://192.168.144.210:8160/api'
axios.defaults.timeout = 10000;
// axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common[''] = ''
let loading

function startLoading () { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    spinner: 'el-icon-loading',
    // background: 'rgba(0, 0, 0, 0.4)',
    customClass: 'request_loading'
  })
}

function endLoading () { // 使用Element loading-close 方法
  // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
  loading.close()
  // });
}
let needLoadingRequestCount = 0

export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  showFullScreenLoading()
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  tryHideFullScreenLoading()
  return response;
}, function (error) {
  // 对响应错误做点什么
  switch (error.status) {
    case '401':
      Message({
        message: '您尚未登录或登录状态过期，请登陆',
        type: 'error',
        duration: 5 * 1000
      })
      break;
    default:
      break;
  }
  tryHideFullScreenLoading();
  return Promise.reject(error);
});



let httpRequest = {
  get: function (url, options) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        params: options,
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  post: function (url, options) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: options
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  postP: function (url, options) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        params: options
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  postFile: function (url, options) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        headers: { "Content-Type": "multipart/form-data" },
        data: options
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  put: function (url, options) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: url,
        data: options
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  delete: function (url, options) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: url,
        data: options
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default httpRequest 