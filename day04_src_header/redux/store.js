//从redux中引入createStore,用于创建最核心的store对象
import { createStore, applyMiddleware } from 'redux'
//引入汇总后的reducer
import reducers from './reducers'
//引入thunk用于异步编码(异步action)
import thunk from 'redux-thunk'
//引入redux-devtools-extension,用于支持redux开发者调试工具的运行
import { composeWithDevTools } from 'redux-devtools-extension'

//暴露store对象
export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))
