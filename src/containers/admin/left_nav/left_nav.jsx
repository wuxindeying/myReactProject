import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'
import { Menu } from "antd";
import menuList from '../../../config/menu_config'
import "./left_nav.less";
import logo from "../../../static/imgs/logo.png";

const { SubMenu } = Menu;
@connect(
  state => ({}),
  {
    saveTitle:createSaveTitleAction
  }
)
@withRouter
class LeftNav extends Component {
  /* componentDidMount() {
    console.log(this.props);
    console.log(this.props.location.pathname.split('/').splice(2));
  } */
  save=()=>{
    this.props.saveTitle()
  }
  creatMenu=(menuArr)=>{
    return menuArr.map((menuObj)=>{
      if (!menuObj.children) {
        return (
          <Menu.Item key={menuObj.key} icon={<menuObj.icon />} onClick={()=>{this.props.saveTitle(menuObj.title)}}>
            <Link to={menuObj.path}>{menuObj.title}</Link>
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu
            key={menuObj.key}
            icon={<menuObj.icon />}
            title={menuObj.title}
          >
            {this.creatMenu(menuObj.children)}
          </SubMenu>
        );
      }
    })
  }
  render() {
    let {pathname}=this.props.location
    return (
      <div>
        <header className="nav-header">
          <img src={logo} alt="" />
          <h1>商品管理系统</h1>
        </header>
        <Menu
          selectedKeys={pathname.indexOf('product')!==-1?'product':pathname.split('/').pop()}
          //初始选中的菜单项,这里不能设置defaultSelectedKeys,否则只能显示一次(页面路由跳转时,不会一开始就跳转到该页面,设置默认就会出错)
          defaultOpenKeys={pathname.split('/').splice(2)}//初始展开的菜单项
          mode="inline"
          theme="dark"
        >
          {this.creatMenu(menuList)}
        </Menu>
      </div>
    );
  }
}
export default LeftNav
