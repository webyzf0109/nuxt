import axios from 'axios'

import {
  Toast,Dialog
} from 'vant'
// create an axios instance
const service = axios.create({
  baseURL: '/ocs_cmcc_promotion', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 45000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if(process.browser){
      if (sessionStorage.getItem('token')) {
        config.headers.token = sessionStorage.getItem('token');
        config.headers.Authorization = "Bearer " + sessionStorage.getItem('token');
      }
  }

    return config
  },
  error => {
    // do something with request error
    console.log(error, 'err') // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.headers.token) {
      if(process.browser){
        sessionStorage.setItem('token', response.headers.token)
      }
    }
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // if (response.request.responseURL.indexOf('/cmcc/uploadImg') > -1) {
      //   Dialog.alert({
      //     title: "提示",
      //     message: "建议不要用手机直接拍照,请保存照片到手机相册重新上传"
      //   });
      // } else {
      //   if (res.message.indexOf("抱歉") <= -1 && res.message.indexOf("每月最多申请") <= -1) {
      //     if (res.code != 24) {
      //       Dialog.alert({
      //         title: "提示",
      //         message: res.message || "网络异常"
      //       });
      //     }
      //   }
      // }
      return Promise.reject(res)
    } else {
      console.log(res,'res')
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
