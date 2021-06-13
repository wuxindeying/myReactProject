import React,{Component} from 'react'
import { Upload, Modal,message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeletePicture} from '../../../../api/index'
import {BASE_URL,IMAGE_BASE_URL} from '../../../../config/index'

//将图片转为base64(如果图片上传失败了，为了保证用户体验，将图片转为base64编码，用于页面展示)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PictureWall extends Component {

  state = {
    previewVisible: false, //控制是否展示预览框
    previewImage: '', //预览图片的url或base64
		previewTitle: '', //预览窗图片的标题
		//fileList中是所有上传过的文件
    fileList: [
      /* {        //一个对象为一个文件,该对象是antd展示的默认图片
        uid: '-1', //必备属性，底层读取后作为react中的key去使用
        name: 'image.png', //图片名
        status: 'done', //图片状态，有：uploading done error removed中
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
      } */
    ],
	};

	//根据图片名数组还原出fileList
	setFileListByImgNameArr = (nameArr)=>{
		let fileList = []
		nameArr.forEach((imgName,index)=>{
			fileList.push({
				uid:index,
				name:imgName,
				status:'done',
				url:IMAGE_BASE_URL+imgName
			})
		})
		this.setState({fileList})
	}
	
	//获取所有上传完毕的图片名字(服务器返回的新名字)
	getImgNameArr = ()=>{
		let arr = []
		this.state.fileList.forEach((imgObj)=>{
			arr.push(imgObj.name)
		})
		return arr
	}

	//预览窗关闭按钮的回调（程序员无需修改）
  handleCancel = () => this.setState({ previewVisible: false });

	//点击预览按钮的回调，("小眼睛按钮"，程序员无需修改)
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

	//重要！！！！！图片状态发生改变的回调，在antd照片墙组件中每一个上传的图片都是有状态的。
  //由未上传->上传,触发一次.上传中:触发一次.上传完成:触发一次
  handleChange = async({file,fileList}) => {
		if(file.status === 'done'){
			const {status,data} = file.response
			if(status === 0){
				message.success('恭喜图片上传成功！');
				const {name,url} = data
        fileList[fileList.length - 1].url = url//图片预览时默认的url是处理后的base64,这里将真正的url放进去替换掉base64的url
        fileList[fileList.length-1].name = name//同理,重写name
			}
		}else if(file.status === 'removed'){//图片删除时,触发onChange,状态改变
			let result = await reqDeletePicture(file.name)
			const {status} = result
			if(status===0) message.success('删除图片成功')
			else message.error('删除图片失败')
		}
		this.setState({fileList});//将文件放进state中,add页面才能从state中读取数据显示
	}

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">点我选择图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload   //因为上传的是一个文件,没办法通过req方式携带该文件作为参数,所以采用antd中的上传组件Upload
          action={`${BASE_URL}/manage/img/upload`} //上传给谁？
          //method="post"//默认就是post
					name="image" //文件参数名
          listType="picture-card" //作为照片墙展示
          fileList={fileList} //文件列表
          onPreview={this.handlePreview} //指定预览的回调
          onChange={this.handleChange} //图片状态改变的回调
          /* 下面是隐藏上传按钮的图片数量的阈值,不能将其注释写在后面 */
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}