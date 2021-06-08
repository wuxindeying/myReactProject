import axios from 'axios'
import { message } from 'antd'
import qs from 'querystring'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create({
  timeout: 1000,
})
//请求拦截器
instance.interceptors.request.use(function (config) {
  NProgress.start()
  console.log(config)
  const { method, data } = config
  if (method.toLowerCase()==='post') {
    if (data instanceof Object) {
      config.data=qs.stringify(data)
    }
  }
  return config
})
//响应拦截器
instance.interceptors.response.use(
  (response) => {
    NProgress.done()
    //如果请求成功了,将数据返回.为了方便不再返回response,直接返回response.data
    return response.data
  },
  (error) => {
    NProgress.done()
    //提示错误,提示框存在持续时间1s
    message.error(error.message,1)
    //如果请求失败了,终端promise链
    return new Promise(()=>{})
  }
)
export default instance