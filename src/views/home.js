import React, { Fragment } from 'react';
import { Row, Col, Button, Input, Breadcrumb, Modal, Spin, message } from 'antd';
import FileList from '../components/fileList/file-list';
import ajax from '../utils/ajax';
import { decrypt, encrypt } from '../utils/valid';
import MyUpLoad from '../components/upload/upload';
import '../css/home.css';

const { Search } = Input;
export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: '', spinning: true, parentId: -1, folderId: 0, folderName: '', visible: false,
            confirmLoading: false, newFolderName: '', history: [{ pid: -1, id: 0, name: '' },],
            updateName: '',
            delLoading: false,
        }
        this.child = React.createRef();
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
        this.setState({ visible: false, confirmLoading: false, });
    }

    //文件名校验
    newFolderChange = (e) => { this.setState({ newFolderName: e.target.value }); }

    //弹出修改对话框
    alterName = () => { this.setState({ alterVisible: true }) }

    //组件挂载时调用
    componentDidMount() {
        //初始化页面数据
        ajax.get("/api/info").then((response) => {
            var res = response.data;
            var dataSrc = JSON.parse(decrypt(res.data));
            if (res.code === 0) this.setState({ data: dataSrc, spinning: false });
        }).catch(error => { this.setState({ spinning: false, data: '' }); console.log(error) });
    }

    //文件夹切换
    onChangeFolder = (parentId, folderId, folderName, e) => {
        e.preventDefault();
        // console.log("加密前：" + folderId)
        // var en = encrypt(folderId);
        // console.log("加密后：" + en)
        // console.log("解密后：" + decrypt(en))
        //获取folderId文件夹内容
        this.setState({ spinning: true });
        var fid = encrypt(folderId);
        ajax.get("/api/info/" + fid).then((response) => {
            var res = response.data;
            if (res.code === 0) {
                var deData = decrypt(res.data);
                console.log("解密前：", res.data)
                console.log("解密后：", deData)
                this.setState({
                    data: JSON.parse(deData),
                    spinning: false,
                    parentId: parentId, folderId: folderId, folderName: folderName,
                    history: this.state.history.concat([{
                        pid: parentId, id: folderId, name: folderName
                    }]),
                });
            }
        }).catch(error => { this.setState({ spinning: false }); console.log(error) });
    }

    //返回上一级目录
    onGoBack = (event) => {
        event.preventDefault();
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

    //批量删除文件
    onClickDelHandler = () => {
        console.log(this.child.current.state.checkArray)
        var idArray = this.child.current.state.checkArray;
        //判断是否有勾选文件/文件夹
        if (idArray.length <= 0) {
            alert("请选择需要删除的文件");
            return;
        }
        this.setState({ delLoading: true });
        //将文件夹id和文件id分离开来
        var folderIdArray = [], fileIdArray = [];
        idArray.forEach(item => {
            if (typeof (item) !== 'number') { fileIdArray.push(item); } else { folderIdArray.push(item); }
        });
        //发送删除请求
        //删除文件夹
        if (folderIdArray.length > 0) {
            var jsonFolderData = new FormData();
            jsonFolderData.append("ids", folderIdArray);
            ajax.del("api/folder", jsonFolderData).then(response => {
                var res = response.data;
                if (res.code === 0) {
                    httpSuccess(res.data, "删除文件夹成功");
                }
            }).catch(error => httpError(error, "删除出错"));
        }
        // 删除文件
        if (fileIdArray.length > 0) {
            var jsonFilesData = new FormData();
            jsonFilesData.append("ids", fileIdArray);
            ajax.del("api/file", jsonFilesData).then(response => {
                var res = response.data;
                if (res.code === 0) {
                    httpSuccess(res.data, "删除文件成功");
                }
            }).catch(error => httpError(error, "删除出错"));
        }
        //请求结果
        const httpError = (error, msg) => { console.log(error); message.error(msg); }
        const httpSuccess = (result, msg) => {
            message.success(msg);
            this.setState({
                data: JSON.parse(decrypt(result)),
                delLoading: false,
            });
        }
    }

    render() {
        const { data, spinning, parentId, folderName, visible, confirmLoading, folderId, delLoading } = this.state;
        if (spinning) return <div className="loading"><Spin tip="Loading" size="large" /></div>
        return (
            <Fragment>
                <Modal visible={visible} onOk={this.onOkHandler} confirmLoading={confirmLoading} title="新建文件夹"
                    onCancel={this.onCancelHandler} okText="确定" cancelText="取消">
                    <p><Input placeholder="输入文件夹名称" onChange={this.newFolderChange} /></p>
                </Modal>

                <Row style={{ alignItems: 'center' }}>
                    <Col span={8}>
                        <MyUpLoad folderId={folderId} returnData={(result) => { this.setState({ data: result }) }} />
                        <Button onClick={this.newFolderClick}> 新建文件夹</Button>
                    </Col>
                    <Col span={8}>
                        <Button onClick={this.onClickDelHandler} loading={delLoading}>
                            删除文件
                        </Button>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
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
                        <FileList
                            viewName="home"
                            dataSource={data}
                            onChangeFolder={this.onChangeFolder}
                            ref={this.child}
                            updateSource={(result) => { this.setState({ data: result }) }}
                        />
                    </Col>
                </Row>
            </Fragment>
        )
    }
}