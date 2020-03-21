import React, { Fragment } from 'react';
import { Row, Col, Button, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import FileList from '../components/fileList/file-list';
import ajax from '../utils/ajax';
import '../css/recycle-bin.css';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
let idArray = [];

export default class RecycleBin extends React.Component {

    state = {
        data: '', reductionLoading: false, clearLoading: false, dataLoading: true,
    }

    //回收永久删除文件/文件夹
    onClickToClean = () => {
        if (idArray.length > 0) {
            this.setState({ clearLoading: true, dataLoading: true });
            var sId = [], iId = [];
            idArray.forEach(item => {
                if (typeof (item) === "number") {
                    iId.push(item);
                } else {
                    sId.push(item);
                }
            });
            console.log("删除" + sId + "," + iId);
            var reductionFormData = new FormData();
            reductionFormData.append("iId", iId);
            reductionFormData.append("sId", sId);
            ajax.del("/api/recycle", reductionFormData).then(response => {
                var res = response.data;
                if (res.code === 0) { this.setState({ data: res.data, clearLoading: false, dataLoading: false }); }
                message.success("删除成功！");
            }).catch(error => { console.log(error); this.setState({ clearLoading: false, data: '', }); });
        } else {
            message.warn("请选择要永久删除的文件/文件夹");
        }
    }

    //还原按钮
    onClickToReduction = () => {
        if (idArray.length > 0) {
            this.setState({ reductionLoading: true });
            var sId = [], iId = [];
            idArray.forEach(item => {
                if (typeof (item) === "number") {
                    iId.push(item);
                } else {
                    sId.push(item);
                }
            });
            console.log("还原" + sId + "," + iId);
            var reductionFormData = new FormData();
            reductionFormData.append("iId", iId);
            reductionFormData.append("sId", sId);
            ajax.post("/api/recycle", reductionFormData).then(response => {
                var res = response.data;
                if (res.code === 0) { this.setState({ data: res.data, reductionLoading: false, dataLoading: false }); }
                message.success("还原成功！");
            }).catch(error => { console.log(error); this.setState({ reductionLoading: false, data: '', }); });
        } else {
            message.warn("请选择要还原的文件/文件夹");
        }
    }

    componentDidMount() {
        ajax.get("/api/recycle").then(response => {
            var res = response.data;
            if (res.code === 0) {
                this.setState({ data: res.data, dataLoading: false });
            }
        }).catch(error => { console.log(error) });
    }

    //获取选中的id数组
    setArrayId = (ids) => { if (ids.length > 0) { idArray = ids; } }

    render() {
        const { data, reductionLoading, clearLoading, dataLoading } = this.state;

        return (
            <Fragment>
                <Row>
                    <Col span={6} className="recycle-bin-col-top">
                        <Button type="primary" loading={clearLoading} onClick={this.onClickToClean}>
                            {!clearLoading ? '清空回收站' : '清理_ing'}
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button onClick={this.onClickToReduction} loading={reductionLoading}
                        >{!reductionLoading ? '还原文件' : '还原_ing'}</Button>
                    </Col>
                    <Col span={6}></Col>
                    <Col span={6}></Col>
                </Row>
                <div className="recycle-bin-spin">
                    <Spin indicator={antIcon} delay={500} spinning={dataLoading} tip="Loading" />
                </div>
                <Row className="recycle-bin-row-main">
                    <Col span={24} >
                        {dataLoading ? '' : (<FileList dataSource={data} getIdArray={this.setArrayId}
                            onChangeFolder={(a, b, c, e) => { console.log(a + b + c); e.preventDefault(); }} />)}
                    </Col>
                </Row>
            </Fragment>
        )
    }
}