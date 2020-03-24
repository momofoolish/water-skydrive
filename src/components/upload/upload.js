import React, { Fragment } from 'react';
import { Button, Progress, message, Modal, Cascader, Input, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import up from '../../utils/uploadFile';
import ajax from '../../utils/ajax';

export default class MyUpLoad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progressShow: 'none', percent: 0, uploadSpeed: 0, folderId: 0,
            visible: false, confirmLoading: false,
            options: [], selectValue: '', newCategory: '', categoryDesc: '',
            file: '',
            message: '',
        }
    }

    //弹出上传对话框
    uploadClick = () => { this.setState({ visible: true }) }

    //获取到文件信息
    onChangeHandler = (event) => { this.setState({ file: event.target.files[0] }); }

    //提交表单信息
    submitFormData = () => {
        const { file, folderId, selectValue } = this.state;
        if (file === '') {
            alert("警告！你未选择文件");
            return;
        }
        this.setState({ confirmLoading: true });
        let formData = up.uploadFiles(file, folderId, selectValue);
        let xhr = new XMLHttpRequest();
        xhr.open('post', 'api/upload', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                this.props.returnData(responseData.data);
                this.setState({ confirmLoading: false, visible: false });
                message.success("上传完毕");
                clearInterval(timer);
            }
        }
        //计算上传进度回调时间
        var everyTime = 0;
        var timer = setInterval(() => everyTime++, 1000);
        //上传进度监听&计算上传速度
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                var uploadSpeed = everyTime === 0 ? (e.loaded / 5) : (e.loaded / everyTime);
                var speed = uploadSpeed > 1024 ? (uploadSpeed / 1024 > 1024 ? (uploadSpeed / 1024 / 1024).toFixed(2)
                    + 'M/s' : Math.round(uploadSpeed / 1024) + 'K/s') : uploadSpeed + 'B/s';
                this.setState({ percent: (100 * e.loaded / e.total).toFixed(2), uploadSpeed: speed });
            }
        }
        xhr.send(formData);
        this.setState({ progressShow: 'inline-block' });
    }

    //取消对话框时调用
    onCancelHandler = () => { this.setState({ visible: false }); }

    //选择类别时调用
    onChangeCategory = (option) => {
        this.setState({ selectValue: option });
    }

    //新增类别
    onNewCategory = () => {
        console.log(this.state.newCategory)
        let formData = new FormData();
        formData.append("name", this.state.newCategory);
        formData.append("description", this.state.categoryDesc);
        ajax.post("/api/category", formData).then(response => {
            var res = response.data;
            if (res.code === 0) {
                const map = res.data.map(item => {
                    return { value: item.id, label: item.name };
                });
                this.setState({ options: map, message: '成功添加' });
                message.success("成功");
            }
        }).catch(error => { console.log(error) });
    }

    //组件挂载时调用
    componentDidMount() {
        this.setState({ folderId: this.props.folderId });
        ajax.get("/api/category").then(response => {
            var res = response.data
            if (res.code === 0) {
                const map = res.data.map(item => {
                    return { value: item.id, label: item.name };
                });
                this.setState({ options: map });
            }
        }).catch(error => { console.log(error) });
    }

    render() {
        const { progressShow, percent, uploadSpeed, visible, confirmLoading, options,
            message } = this.state;

        return (
            <div style={{ display: 'inline-block', marginRight: '1px' }}>
                <Modal
                    visible={visible} confirmLoading={confirmLoading} title="上传文件"
                    onCancel={this.onCancelHandler} okText="提交" cancelText="取消"
                    onOk={this.submitFormData}>
                    <input id="upload-input" type="file" onChange={this.onChangeHandler} />
                    <span style={{ display: progressShow, marginRight: '1px' }}>
                        {uploadSpeed === 0 ? '' : uploadSpeed}
                    </span>
                    <Progress percent={percent} status="active" style={{ width: 150, display: progressShow }} />
                    <Cascader options={options} onChange={this.onChangeCategory} placeholder="默认" />
                    <Fragment>
                        <Divider orientation="left">可选项</Divider>
                        <Input type="text" placeholder="类别名称" style={{ width: 150 }}
                            onChange={(e) => { this.setState({ newCategory: e.target.value }) }} /> <br />
                        <Input type="text" placeholder="描述类别（可选）"
                            onChange={(e) => { this.setState({ categoryDesc: e.target.value }) }} /> <br />
                        <Button onClick={this.onNewCategory}>确定</Button>
                        <label>{message}</label>
                    </Fragment>
                </Modal>

                <Button onClick={this.uploadClick} type="primary" icon={<UploadOutlined />}>
                    <span>上传</span>
                </Button>
            </div >
        )
    }
}