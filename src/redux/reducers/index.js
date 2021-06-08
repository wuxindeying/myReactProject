import { combineReducers } from 'redux'
import loginReducer from './login_reducer'
import menuReducer from './menu_reducer'
import categoryReducer from './category_reducer'
export default combineReducers({
  //该对象里的key决定着store里保存该状态的key
  //该对象里的value决定着store里保存该状态的value
  userInfo: loginReducer,
  title: menuReducer,
  categoryList:categoryReducer
})