import React from 'react';
import { Button, Progress, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import up from '../../utils/uploadFile';

export default class MyUpLoad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progressShow: 'none', percent: 0, uploadSpeed: 0, folderId: 0,
            visible: false, confirmLoading: false,
            file: '',
        }
    }

    //弹出上传对话框
    uploadClick = () => { this.setState({ visible: true }) }

    //获取到文件信息立
    onChangeHandler = (event) => { this.setState({ file: event.target.files[0] }); }

    //提交表单信息
    submitFormData = () => {
        const { file, folderId } = this.state;
        if (file === '') {
            alert("警告！你未选择文件");
            return;
        }
        let formData = up.uploadFiles(file, folderId);
        let xhr = new XMLHttpRequest();
        this.setState({ confirmLoading: true });
        xhr.open('post', 'api/upload', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                this.props.returnData(responseData.data);
                this.setState({ confirmLoading: false, visible: false });
                message.success("success");
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

    //组件挂载时调用
    componentDidMount() {
        this.setState({ folderId: this.props.folderId });
    }

    render() {
        const { progressShow, percent, uploadSpeed, visible, confirmLoading } = this.state;

        return (
            <div style={{ display: 'inline-block', marginRight: '1px' }}>
                <Modal
                    visible={visible} confirmLoading={confirmLoading} title="新建文件夹"
                    onCancel={this.onCancelHandler} okText="提交" cancelText="取消"
                    onOk={this.submitFormData}>
                    <input id="upload-input" type="file" onChange={this.onChangeHandler} />
                    <span style={{ display: progressShow, marginRight: '1px' }}>
                        {uploadSpeed === 0 ? '' : uploadSpeed}
                    </span>
                    <Progress percent={percent} status="active" style={{ width: 150, display: progressShow }} />
                </Modal>

                <Button onClick={this.uploadClick} type="primary" icon={<UploadOutlined />}>
                    <span>上传</span>
                </Button>
            </div >
        )
    }
}