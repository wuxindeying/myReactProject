import axios from 'axios'
import { message } from 'antd'
import qs from 'querystring'
import NProgress from 'nprogress'
import store from '../redux/store'
import 'nprogress/nprogress.css'
import {createDeleteUserInfoAction} from '../redux/action_creators/login_action'

const instance = axios.create({
  timeout: 1000,
})
//请求拦截器
instance.interceptors.request.use(function (config) {
  NProgress.start()
  //console.log(config)
  //从redux中获取之前保存的token
  const { token } = store.getState().userInfo
  //向请求头中添加token,用于校验身份
  if (token) {
    config.headers.Authorization = 'atguigu_'+token
  }
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
    //console.log(response)
    //如果请求成功了,将真正的数据返回.为了方便不再返回response,直接返回response.data
    return response.data
  },
  (error) => {
    NProgress.done()
    console.log(error)
    if (error.response.stutas===401) {
      message.error('身份校验失败,请重新登录', 1)
      //分发一个删除用户信息的action
      store.dispatch(createDeleteUserInfoAction())
    } else {
      //请求失败,提示错误,提示框存在持续时间1s
      message.error(error.message,1)
    }
    //如果请求失败了,中断promise链
    return new Promise(()=>{})
  }
)
export default instance