//项目中所有请求由这个文件发出
import jsonp from 'jsonp'
import {
  message
} from 'antd'
import myAxios from './myAxios.js'
import {
  BASE_URL,
  CITY,
  WEATHER_AK
} from '../config'

//登录请求
export const reqLogin = loginObj => myAxios.post(`${BASE_URL}/login`, loginObj)
//获取商品列表请求
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`)
//获取天气信息(百度接口)  将异步回调函数带回的返回值交给外层方法的返回值,考虑使用promise
export const reqWeather = () => {
  const URL = `http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`
  return new Promise((resolve) => {
    jsonp(URL,
      { timeout: 2000 },
      (err, data) => {
        if (err) {
          message.error('请求天气接口失败')
          return new Promise(()=>{})
        } else {
          console.log( data.results)
          const {
            dayPictureUrl,
            temperature,
            weather
          } = data.results[0].weather_data[0]
          let weatherObj = {
            dayPictureUrl,
            temperature,
            weather
          }
          console.log(weatherObj)
          resolve(weatherObj)
        }
      })
  })
}