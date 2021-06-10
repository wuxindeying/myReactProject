import { SAVE_PRODUCT_LIST } from '../action_types'
//创建用于保存用户信息的action
export const createSaveProductList = (value) => {
  return { type:SAVE_PRODUCT_LIST,data:value}
}