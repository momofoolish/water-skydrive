import React, { Fragment } from 'react';
import { Row, Col, Button, Input, Breadcrumb, Modal, Spin, message, Progress } from 'antd';
import { UploadOutlined, DeleteRowOutlined } from '@ant-design/icons';
import FileList from '../components/fileList/file-list';
import ajax from '../utils/ajax';
import uploadFiles from '../utils/uploadFile';
import '../css/home.css';

const { Search } = Input;

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: '', spinning: true, parentId: -1, folderId: 0, folderName: '', visible: false, progressShow: 'none',
            confirmLoading: false, newFolderName: '', history: [{ pid: -1, id: 0, name: '' },], percent: 0, uploadSpeed: '',
            delVisible: false, idArray: [],ids:''
        }
    }

    //获取到文件信息立即上传
    onChangeHandler = (e) => {
        var formData = uploadFiles.uploadFiles(e, this.state.folderId);
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'api/upload', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                this.setState({ data: responseData.data });
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
            console.log(everyTime)
        }
        xhr.send(formData);
        this.setState({ progressShow: 'inline-block' });
    }

    //新建文件夹弹出层
    newFolderClick = () => {
        this.setState({ visible: true });
    }

    //确定新建文件夹
    onOkHandler = () => {
        this.setState({ confirmLoading: true });
        let folderProps = new FormData();
        folderProps.append("parentId", this.state.parentId === -1 ? 0 : this.state.folderId);
        folderProps.append("name", this.state.newFolderName);
        ajax.post("api/folder", folderProps).then(response => {
            let res = response.data;
            console.log(res)
            if (res.code === 0) {
                this.setState({ confirmLoading: false, visible: false, data: res.data }); message.success("新建成功！");
            }
        }).catch(() => { this.setState({ confirmLoading: false, visible: false }); message.error("出错了") });
    }

    //关闭
    onCancelHandler = () => {
        this.setState({ visible: false, confirmLoading: false, delVisible: false });
    }

    //文件名校验
    newFolderChange = (e) => {
        this.setState({ newFolderName: e.target.value });
    }

    //弹出上传对话框
    uploadClick = () => { document.getElementById("upload-input").click(); }

    //组件挂载时调用
    componentDidMount() {
        //初始化页面数据
        ajax.get("/api/info").then((response) => {
            var res = response.data;
            if (res.code === 0) this.setState({ data: res.data, spinning: false });
        }).catch(error => { this.setState({ spinning: false, data: '' }); console.log(error) });
    }

    //文件夹切换
    onChangeFolder = (parentId, folderId, folderName, e) => {
        e.preventDefault();
        //获取folderId文件夹内容
        this.setState({ spinning: true });
        ajax.get("/api/info/" + folderId).then((response) => {
            var res = response.data;
            if (res.code === 0) this.setState({
                data: res.data, spinning: false, parentId: parentId, folderId: folderId, folderName,
                history: this.state.history.concat([{ pid: parentId, id: folderId, name: folderName }]),
            });
        }).catch(error => { this.setState({ spinning: false }); console.log(error) });
    }

    //返回上一级目录
    onGoBack = (e) => {
        e.preventDefault();
        this.setState({ spinning: true });
        const { pid, id, name } = this.state.history[this.state.history.length - 1];//历史目录属性
        ajax.get("/api/info/" + pid).then((response) => {
            var res = response.data;
            if (res.code === 0) {
                if (pid > 0) {
                    this.setState({
                        data: res.data, spinning: false, parentId: pid, folderId: id, folderName: name,
                    })
                    this.state.history.pop();
                } else {
                    this.setState({
                        data: res.data, spinning: false, parentId: -1, folderId: 0, folderName: '',
                    })
                }
            }
        }).catch(error => { this.setState({ spinning: false }); console.log(error) });
    }

    //弹出删除文件/文件夹对话框
    deleteFile = () => { this.setState({ delVisible: true }); }

    //确定删除文件/文件夹
    onOkDelFile = () => {
        this.setState({ confirmLoading: true });
        //将文件夹id和文件id分离开来
        var folderIdArray = [];
        var fileIdArray = [];
        this.state.idArray.forEach(item => {
            if (typeof (item) !== 'number') { fileIdArray.push(item); } else { folderIdArray.push(item); }
        });
        //发送删除请求
        if (folderIdArray.length > 0) {
            ajax.del("api/folder", { ids: folderIdArray }).then(response => {
                console.log(response.data)
            }).catch(error => { console.log(error); this.setState({ confirmLoading: false }); message.error("删除出错"); });
        }
        if (fileIdArray.length > 0) {
            ajax.del("api/file", { files: fileIdArray }).then(response => {
                console.log(response.data)
            }).catch(error => { console.log(error); this.setState({ confirmLoading: false }); message.error("删除出错"); });
        }
    }

    //获取勾选的文件id
    setIdArray = (idArray) => {
        this.setState({ idArray: idArray });
        console.log(idArray)
    }

    render() {
        const { data, spinning, parentId, folderName, visible, confirmLoading, percent, progressShow, uploadSpeed,
            delVisible } = this.state;
        if (spinning) return <div className="loading"><Spin tip="Loading" size="large" /></div>
        return (
            <Fragment>
                <Modal visible={visible} onOk={this.onOkHandler} confirmLoading={confirmLoading} title="新建文件夹"
                    onCancel={this.onCancelHandler} okText="确定" cancelText="取消">
                    <p><Input placeholder="输入文件夹名称" onChange={this.newFolderChange} /></p>
                </Modal>
                <Modal visible={delVisible} onOk={this.onOkDelFile} confirmLoading={confirmLoading} title="警告"
                    onCancel={this.onCancelHandler} okText="确定" cancelText="取消">
                    <p> 是否删除 这些文件/文件夹 ？ </p>
                </Modal>

                <Row style={{ alignItems: 'center' }}>
                    <Col span={2}><Button onClick={this.uploadClick} type="primary" icon={<UploadOutlined />}>
                        上传<input id="upload-input" style={{ display: 'none' }} type="file"
                            onChange={this.onChangeHandler} /></Button></Col>
                    <Col span={3} style={{ textAlign: 'center' }}> <Button onClick={this.newFolderClick}>
                        新建文件夹</Button> </Col>
                    <Col span={6} style={{ textAlign: 'left' }}>
                        <span style={{ display: progressShow, marginRight: '1px' }}> {uploadSpeed} </span>
                        <Progress percent={percent} status="active" style={{ width: 150, display: progressShow }} />
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <Button onClick={this.deleteFile} type="primary" icon={<DeleteRowOutlined />} >
                            删除 </Button>
                    </Col>
                    <Col span={7} style={{ textAlign: 'right' }}>
                        <Search placeholder="输入你要搜索的文件" style={{ width: 200 }}
                            onSearch={key => this.props.history.push({ pathname: '/search/' + key })} />
                    </Col>
                </Row><br />

                <Row>
                    <Col span={12}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>全部文件</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="#c" onClick={this.onGoBack}>
                                    {(parentId === -1) ? '' : '返回上一级'}
                                </a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{folderName}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <span>已全部加载，共{data === '' ? 0 : data.folders.length + data.files.length}个</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={24} >
                        <FileList dataSource={data} onChangeFolder={this.onChangeFolder} getIdArray={this.setIdArray}
                            getOptionIdArray={ids => { this.setIdArray(ids); }} />
                    </Col>
                </Row>
            </Fragment>
        )
    }
}