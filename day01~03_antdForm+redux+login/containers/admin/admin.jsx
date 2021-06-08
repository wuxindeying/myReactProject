import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { createDeleteUserInfoAction } from '../../redux/action_creators/login_action'
import { connect } from 'react-redux'

class Admin extends Component {
  componentDidMount() {
    console.log(this.props);
  }
  logout=()=>{
    this.props.deleteUserInfo()
  }
  //在render内,若想实现跳转,最好用<Redirect>
  render() {
    const { user, token, isLogin } = this.props.userInfo
    if (!isLogin) {
      return <Redirect to="/login"/>
    } else {
      return (
        <div>
          你的名字是{user.username}
          <button onClick={this.logout}>退出登录</button>
        </div>
      )
    }
  }
}
export default connect(
  state => ({ userInfo: state.userInfo }),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
)(Admin)