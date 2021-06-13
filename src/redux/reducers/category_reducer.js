import { SAVE_CATEGORY } from '../action_types'

let initState = []
export default function test(preState = initState,action) {
  const { type,data} = action
  let newState
  switch (type) {
    case SAVE_CATEGORY:
      newState=[...data].reverse()//新增的数据在数组的最后,显示时把整个数组倒序显示
      return newState;
    default:
      return preState;
  }
}
