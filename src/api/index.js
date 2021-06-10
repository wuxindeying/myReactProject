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
//请求更新分类
export const reqUpdateCaregory = (categoryId, categoryName) => myAxios.post(`${BASE_URL}/manage/category/update`, { categoryId, categoryName })
//请求添加分类
export const reqAddCaregory = (categoryName) => myAxios.post(`${BASE_URL}/manage/category/add`, { categoryName })
//请求商品分页列表
export const reqProductList = (pageNum, pageSize) => myAxios.get(`${BASE_URL}/manage/product/list`, { params: { pageNum, pageSize } })
//请求更新商品状态
export const reqUpdateProductStatus = (productId, status) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`, { productId, status })
//根据名字和描述搜索商品分页列表
export const reqSearchProductList = (pageNum, pageSize, searchType, keyWord) =>myAxios.get(`${BASE_URL}/manage/product/search`, { params: { pageNum, pageSize, [searchType]:keyWord} })
//根据商品id获取商品信息
export const reqSearchProductById = (productId) =>myAxios.get(`${BASE_URL}/manage/product/info`, { params: { productId } })
