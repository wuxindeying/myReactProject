import React, { Component } from 'react'
import { Form, Input, Button,message } from 'antd';
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import { createSaveUserInfoAction } from '../../redux/action_creators/login_action'
import {reqLogin} from '../../api'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './css/login.less'
import logo from './img/logo.png'

class Login extends Component {
  onFinish = async values => {
    console.log('Received values of form: ', values);
    //这里可以直接处理返回的promise
    /* reqLogin(values)
      .then((result)=>{
        console.log(result);
      })
      .catch((reason)=>{
        console.log(reason);
      }) */
    
    //这里将对promise的处理放在拦截器中进行处理,只接收请求成功(不是验证成功)的数据result
    let result = await reqLogin(values)
    console.log(result);
    const { status, data, msg } = result
    if (status===0) {//登录成功时可以接收到验证成功的数据data
      console.log(data);
      //1.服务器返回的user信息,还有token交给redux管理
      this.props.saveUserInfo(data)
      //2.跳转admin页面:三种实现方式:<Link>或<NavLink>或this.props.history
      //这里使用history的replace方法. 无法使用<Link>或<NavLink>
      this.props.history.replace('/admin')
      
    } else {//登录失败时可以接收到验证错误的信息msg,警告弹出框持续时间1s
      message.warning(msg,1)
    }
    
  };
  pwdValidator=(_, value) => {
    let errMsgArr=[]
    if (!value.trim()) return Promise.reject(new Error('密码必须输入'))
    if (value.length > 12) errMsgArr.push('密码必须小于等于12位')
    if (value.length < 4) errMsgArr.push('密码必须大于等于4位')
    if (!(/^\w+$/).test(value)) errMsgArr.push('密码必须是字母/数字/下划线组成')
    if (errMsgArr.length!==0) return Promise.reject(errMsgArr)
    else return Promise.resolve()
   
  }
  render() {
    
    const { isLogin } = this.props
    if (isLogin) {
      return <Redirect to="/admin"/>
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo" />
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
                {
                  max: 12,
                  message: "用户名必须小于等于12位!",
                },
                {
                  min: 4,
                  message: "用户名必须大于等于4位!",
                },
                {
                  pattern: /^\w+$/,
                  message: "用户名必须是字母/数字/下划线组成!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}}/>}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码!",
                },
                {
                  validator: this.pwdValidator 
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}}/>}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
              
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}

export default connect(
  state => ({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo: createSaveUserInfoAction
  }
)(Login)
