import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './css/login.less'
import logo from './img/logo.png'

export default class Login extends Component {
  onFinish = (values) => {
    console.log('Received values of form: ', values);
    //点击登录的回调
    alert('登录')
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
