import React, { Component } from 'react'
import {Card,Button,Form,Input,Select, message} from 'antd'
import {connect} from 'react-redux'
import {saveCategoryAsync} from '../../../redux/action_creators/category_action'
import {ArrowLeftOutlined} from '@ant-design/icons';
import { reqAddProduct, reqSearchProductById, reqUpdateProduct } from '../../../api/index'
import PictureWall from './PictureWall/PictureWall'
import RichText from './RichText/RichText'

const {Item} = Form
const {Option} = Select

@connect(
	state =>({categoryList:state.categoryList}),//映射状态
	{saveCategoryAsync}//映射操作状态的方法
)
class AddUpdate extends Component {

	state = {
		isUpdate:false,
		isLoading:false
  }

	getCurrentProduct = async(id)=>{
		this.setState({isLoading:true})
		//根据id查询当前商品的详细信息
		let result = await reqSearchProductById(id)
		//从result中获取数据
		const {status,data,msg} = result
		if(status === 0){
			//从data中解构赋值商品详细属性
			const {name,desc,price,categoryId,imgs,detail} = data
			//更状态取消展示loading
			this.setState({isLoading:false})
			//通过Form实例的setFieldsValue回显基本数据
			this.productForm.setFieldsValue({name,desc,price,categoryId})   //通过ref调用Form组件的方法.在点击修改后把信息放在对应位置
			//通过PictureWall组件实例调用setFileListByImgNameArr回显图片数据
			this.pictureWall.setFileListByImgNameArr(imgs)   //把对应商品的照片放在展示位置
			//通过RichText组件实例调用setRichText
			this.richText.setRichText(detail)             //把detail放在富文本展示位置
		}else{
			message.error(msg)
		}
	}

	//表单提交的回调
  onFinish = async (values) => {
		values.imgs = this.pictureWall.getImgNameArr()  //通过定义的ref,拿到自定义组件的实例,调用子组件内部的方法.
		values.detail = this.richText.getRichText()     //从富文本组件中获取用户输入的文字转换为富文本的字符串
		let result
		if(this.state.isUpdate){
			values._id = this._id
			result = await reqUpdateProduct(values)
		}else{
			result = await reqAddProduct(values)
		}
		const {status,msg} = result
		if(status === 0) {
			message.success(this.state.isUpdate ? '修改成功' : '商品添加成功')
			this.props.history.replace('/admin/prod_about/product')
		}
		else message.error(msg)
	}

	componentDidMount(){
		const {categoryList,saveCategoryAsync} = this.props
		//如果redux中没有分类数据，就去请求，随后保存
		if(categoryList.length === 0) saveCategoryAsync()
		//尝试着去获取商品id
		const {id} = this.props.match.params
		if(id) {//如果有id,则是修改,否则是新增
			this._id = id
			this.setState({isUpdate:true})
			this.getCurrentProduct(id)
		}
			
	}

	render() {
		return (
			<Card 
				loading={this.state.isLoading}
				title={
					<div>
						<Button 
							onClick={()=>{this.props.history.goBack()}}
							type="link"
						>
							<ArrowLeftOutlined/>返回
						</Button>	
						<span>{this.state.isUpdate ? '修改商品' : '添加商品'}</span>
					</div>
				}
			>
				<Form
					ref={node => this.productForm=node}
					initialValues={{categoryId:''}}
					onFinish={this.onFinish}
				>
					<Item
						name="name"
						rules={[{required:true,message:'商品名称必须输入'}]}
						label="商品名称"
						wrapperCol={{span:6}}
					>
						<Input placeholder="商品名称"/>
					</Item>
					<Item
						name="desc"
						rules={[{required:true,message:'商品描述必须输入'}]}
						label="商品描述"
						wrapperCol={{span:6}}
					>
						<Input placeholder="商品描述"/>
					</Item>
					<Item
						name="price"
						rules={[{required:true,message:'商品价格必须输入'}]}
						label="商品价格"
						wrapperCol={{span:6}}
					>
						<Input 
							type="number"
							addonAfter="元" 
							addonBefore="￥" 
							placeholder="商品价格"
						/>
					</Item>
					<Item
						name="categoryId"
						rules={[{required:true,message:'必须选择一个分类'}]}
						label="所属分类"
						wrapperCol={{span:6}}
					>
						<Select>
							<Option value="">请选择分类</Option>
							{
								this.props.categoryList.map((categoryObj)=>{
									return <Option key={categoryObj._id} value={categoryObj._id}>{categoryObj.name}</Option>
								})
							}
						</Select>
					</Item>
					<Item
						name="imgs"
						label="商品图片"
						wrapperCol={{span:6}}
						style={{marginLeft:'12px'}}
					>
						<PictureWall ref={node => this.pictureWall = node}/>
					</Item>
					<Item
						label="商品详情"
						wrapperCol={{span:14}}
						style={{marginLeft:'12px'}}
					>
            <RichText ref={node => this.richText = node}/>
					</Item>
					<Item>
						<Button type="primary" htmlType="submit">提交</Button>
					</Item>
				</Form>	
			</Card>
		)
	}
}

export default AddUpdate
