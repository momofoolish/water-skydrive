import React, { Fragment } from 'react';
import { Row, Col, Button, Input, Breadcrumb } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import FileList from '../components/FileList/filelist';
const { Search } = Input;

export default class Home extends React.Component {
    render() {
        return (
            <Fragment>
                <Row>
                    <Col span={12} style={{ textAlign: 'left' }}>
                        <Button type="primary" icon={<UploadOutlined />}>上传 </Button>
                        <span> </span><Button >新建文件夹</Button>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Search placeholder="输入你要搜索的文件" style={{ width: 200 }} onSearch={value => console.log(value)} />
                    </Col>
                </Row><br />

                <Row>
                    <Col span={12}>
                        <Breadcrumb>
                            <Breadcrumb.Item>全部文件</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="#a">返回上一级</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>An Application</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <span>已全部加载，共9个</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}><FileList /></Col>
                </Row>
            </Fragment>
        )
    }
}