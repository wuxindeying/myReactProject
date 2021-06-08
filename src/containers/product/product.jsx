import React, { Component } from "react";
import { Card, Button, Select, Input,Table, message  } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { reqProductList,reqUpdateProductStatus,reqSearchProductList } from '../../api/index'
import {PAGE_SIZE} from '../../config/index'

const { Option } = Select;

export default class Product extends Component {
  
  state = {
    productList: [],//商品列表数据
    total: '',//数据总共多少条
    pageNum: 1,//当前在第几页
    keyWord: '',//输入框搜索关键词
    searchType:'productName',//选择框搜索类型
  }


  componentDidMount() {
    this.getProductList()
  }

  getProductList = async (pageNum = 1) => {
    let result
    if (this.isSearch) {
      //console.log(this.state.keyWord, this.state.searchType);
      const { searchType, keyWord } = this.state
      result = await reqSearchProductList(pageNum, PAGE_SIZE, searchType, keyWord)
    } else {
      result = await reqProductList(pageNum, PAGE_SIZE)
    }

    //console.log(result);
    const { status, data } = result
    //console.log(data);
    if (status===0) {
      this.setState({
        productList: data.list,
        total: data.total,
        pageNum:data.pageNum,
      })
    } else {
      message.error('初始化商品列表失败')
    }
  }

  updateProdStatus = async ({ _id, status }) => {
    let productList = [...this.state.productList]
    //console.log(_id, status);
    if (status === 1) status = 2
    else status = 1
    let result = await reqUpdateProductStatus(_id, status)
    if (result.status===0) {
      message.success('更新商品状态成功')
      productList=productList.map((item)=>{
        if (item._id=== _id) {
          item.status=status
        }
        return item
      })
      this.setState({productList})
    } else {
      message.error('更新商品状态失败')
    }
  }

  search=async ()=>{
    this.isSearch = true
    this.getProductList()
  }

  render() {
    const dataSource = this.state.productList
    
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width:'15%',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'adescge',
        align:'center',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width:'10%',
        render:(price)=>{
          return '￥'+price
        }
      },
      {
        title: '状态',
        //dataIndex: 'status',
        key: 'status',
        align: 'center',
        width:'10%',
        render:(item)=>{
          return (
            <div>
              <Button 
                type={item.status === 1 ? "danger" : "primary"}
                onClick={()=>{this.updateProdStatus(item)}}
              >
                {item.status === 1 ? '下架' : '上架'}
              </Button><br />
              <span>
                {item.status === 1 ? '在售' : '已停售'}
              </span>
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'opera',
        key: 'opera',
        align: 'center',
        width:'10%',
        render:()=>{
          return (
            <div>
              <Button type="link">详情</Button><br/>
              <Button type="link">修改</Button><br/>
            </div>
          )
        }
      },
    ];
    return (
      <Card
        title={
          <div>
            <Select
              defaultValue="productName"
              onChange={value=>this.setState({searchType:value})}/* antd封装的选择框中, Select直接传value,Input传的是event*/
              /* style={{ width: 120 }} */
              /* onChange={handleChange} */
            >
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input
              placeholder="请输入搜索关键字"
              style={{ width: '20%', margin: '0px 10px' }}
              allowClear
              onChange={event=>this.setState({keyWord:event.target.value})}
            />
            <Button type="primary" onClick={this.search}>
            <SearchOutlined />
            搜索
          </Button>
          </div>
        }
        extra={
          <Button type="primary">
            <PlusOutlined />
            添加商品
          </Button>
        }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          rowKey='_id'
          pagination={{
            pageNum: this.state.pageNum,
            pageSize: PAGE_SIZE,
            total: this.state.total,
            onChange:this.getProductList
          }}
        />
      </Card>
    );
  }
}
