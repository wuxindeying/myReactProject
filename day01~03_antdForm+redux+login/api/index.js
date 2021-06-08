//项目中所有请求由这个文件发出
import myAxios from './myAxios.js'
import {BASE_URL} from '../config'

//登录请求
export const reqLogin = loginObj => myAxios.post(`${BASE_URL}/login`, loginObj)