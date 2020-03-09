import React, { Fragment } from 'react';
import { Row, Col, Button, Input, Breadcrumb, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FileList from '../components/FileList/filelist';

const { Search } = Input;

const data = [
    { id: '1', name: 'Racing car sprays burning fuel into crowd.' },
    { id: '2', name: 'Japanese princess to wed commoner.' },
    { id: '3', name: 'Australian walks 100km after outback crash.' },
    { id: '4', name: 'Man charged over missing wedding girl.' },
    { id: '5', name: 'Los Angeles battles huge wildfires.' },
];

const fileProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    changeDataSource = (newDataSource) => {
        alert(newDataSource);
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Col span={2} style={{ textAlign: 'left'}}>
                        <Upload {...fileProps} style={{display:'flex' }}> <Button type="primary" icon={<UploadOutlined />}>上传 </Button></Upload>
                    </Col>
                    <Col span={3} style={{ textAlign: 'center' }}>
                        <Button>新建文件夹</Button>
                    </Col>
                    <Col span={12}></Col>
                    <Col span={7} style={{ textAlign: 'right' }}>
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
                            <Breadcrumb.Item>root</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <span>已全部加载，共9个</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <FileList dataSource={data} changeDataSource={this.changeDataSource} />
                    </Col>
                </Row>
            </Fragment>
        )
    }
}