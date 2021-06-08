import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Modal,Button} from 'antd'
import { FullscreenOutlined,FullscreenExitOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';
import screenfull from 'screenfull'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import {reqWeather} from '../../../api'
import './css/header.less'

const { confirm } = Modal;
@connect(
  state => ({ userInfo:state.userInfo}),
  {deleteUserInfo:createDeleteUserInfoAction}
)
@withRouter
class Header extends Component {
  state = {
    isFull: false,
    date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weatherInfo:{}
  }
  getWeather= async ()=>{
    let weather = await reqWeather()
    console.log(weather);
    this.setState({weatherInfo:weather})
  }
  componentDidMount() {
    //给screenfull绑定监听
    screenfull.on('change', () => {
      let isFull = !this.state.isFull
      this.setState({isFull})
    })
    this.timeID=setInterval(() => {
      this.setState({date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
    }, 1000);
    //请求天气信息
    //this.getWeather()
  }
  componentWillUnmount() {
    clearInterval(this.timeID)
  }
  //切换全屏的回调
  fullScreen = () => {
    screenfull.toggle()
  }
  //点击退出登录的回调
  logOut = () => {
    let {deleteUserInfo} = this.props
    confirm({
      title: '确定退出?',
      icon: <ExclamationCircleOutlined />,
      content: '若退出需要重新登录',
      cancelText: '取消',
      okText:'确认',
      onOk(){
        deleteUserInfo();
      },
    });
  }
  render() {
    const { isFull } = this.state
    const {user} = this.props.userInfo
    return (
      <header className="header">
        <div className="header-top">
          <Button size="small" onClick={ this.fullScreen}>
            {isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </Button>
          <span className="username">欢迎,{user.username}</span>
          <Button type="link" onClick={this.logOut}>退出登录</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{this.props.location.pathname}</div>
          <div className="header-bottom-right">
            {this.state.date}
            <img src="https://ftp.bmp.ovh/imgs/2020/05/3164f15abfffdd8c.png" alt="天气信息" />
            {/* <img src={weatherInfo.dayPictureUrl} alt="天气信息" /> */}
            晴 温度2~-5℃
            {/* {weatherInfo.weather} 温度:{weatherInfo.temperature} */}
          </div>
        </div>
      </header>
    )
  }
}
export default Header