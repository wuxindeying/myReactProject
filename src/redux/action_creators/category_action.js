import { SAVE_CATEGORY } from '../action_types'
import {reqCategoryList} from '../../api/index'
import { message } from 'antd'
//创建保存标题的action ---  同步action
export const saveCategory = (value) => {
  return { type:SAVE_CATEGORY,data:value}
}
//创建保存标题的action ---  异步action
export const saveCategoryAsync=()=>{
  return async(dispatch)=>{
    let result = await reqCategoryList()
    const { status, data, msg } = result
    //console.log(data)
    if (status===0) {
      dispatch(saveCategory(data))
    } else {
      message.error(msg);
    }
  }
}