import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Card, List, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {BASE_URL} from '../../../config/index'
import {reqSearchProductById,reqCategoryList} from '../../../api/index'
import "./css/detail.less";

@connect((state) => ({
  productList: state.productList,
  categoryList:state.categoryList
}))
class Detail extends Component {
  state = {
    categoryId: "",
    categoryName:"",
    desc: "",
    detail: "",
    imgs: [],
    name: "",
    price: "",
    status: "",
    _id: "",
    isLoading:true
  };
  componentDidMount() {
    //console.log(this.props.categoryList);
    const reduxProdList = this.props.productList;
    const reduxcategoryList = this.props.categoryList;
    const { id } = this.props.match.params;
    if (reduxProdList.length !== 0) {
      let result = reduxProdList.find((item) => {
        return item._id === id;
      });
      if (result) {
        this.setState({ ...result })
        //由于setState()是异步的,不会立即生效,所以为了后续代码能够执行,将id临时挂在this上,方便后续使用
        this.categoryId=result.categoryId
      }
      /* {const { categoryId, desc, detail, imgs, name, price, status, _id } = result
        this.setState({ categoryId,desc, detail,imgs,name, price, status, _id,})
      } */ 
    } else {
      this.getProductById(id)
    }
    if (reduxcategoryList.length) {
      let result = reduxcategoryList.find((item) => {
        return item._id === this.categoryId;//setState()异步,所以使用临时挂在this上的id进行判断
      });
      //console.log(result);
      if (result) this.setState({ categoryName:result.name,isLoading:false })
    } else {
      this.getCategoryList()
    }
  }

  getProductById=async (id)=>{
    let result = await reqSearchProductById(id)
    const { status, data,msg } = result
    if (status === 0) {
      this.setState({ ...data })
      this.categoryId=data.categoryId
    }
      /*this.setState({ ...data })相当于以下两行 */
    /* {const { categoryId, desc, detail, imgs, name, price, status, _id } =data;
      this.setState({categoryId,desc,detail,imgs,name,price,status, _id,});}  */
    else {
      message.error(msg)
    }
  }

  getCategoryList=async()=>{
    let result = await reqCategoryList()
    const { status, data, msg } = result
    if (status===0) {
      let result = data.find((item)=>{
        return item._id===this.categoryId
      })
      if (result) this.setState({categoryName:result.name,isLoading:false})
    }else message.error(msg)
  }

  render() {
    return (
      <div>
        <Card
          title={
            <div className="left-top">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                <ArrowLeftOutlined style={{ fontSize: "20px" }} />
              </Button>
              <span className="prod-value">商品详情</span>
            </div>
          }
          loading={this.state.isLoading}
        >
          <List>
            <List.Item className="prod">
              <span className="prod-name">商品名称:</span>
              <span>{this.state.name}</span>
            </List.Item>
            <List.Item className="prod">
              <span className="prod-name">商品描述:</span>
              <span>{this.state.desc}</span>
            </List.Item>
            <List.Item className="prod">
              <span className="prod-name">商品价格:</span>
              <span>{this.state.price}</span>
            </List.Item>
            <List.Item className="prod">
              <span className="prod-name">所属分类:</span>
              <span>{this.state.categoryName}</span>
            </List.Item>
            <List.Item className="prod">
              <span className="prod-name">商品图片:</span>
              {this.state.imgs.map((item,index) => {
                return <img key={index} src={`${BASE_URL}/upload/` + item} alt="商品图片" />;
              })}
            </List.Item>
            <List.Item className="prod">
              <span className="prod-name">商品详情:</span>
              <span
                dangerouslySetInnerHTML={{ __html: this.state.detail }}
              ></span>
            </List.Item>
          </List>
        </Card>
      </div>
    );
  }
}
export default Detail;
