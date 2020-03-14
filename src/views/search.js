import React, { Fragment } from 'react';
import { Col, Row, Input } from 'antd';
import FileList from '../components/fileList/file-list';

const { Search } = Input;

export default class SearchView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: '' }
    }

    render() {

        const { data } = this.state;

        return (
            <Fragment>
                <Row>
                    <Col span={6}>
                        <span>搜索结果，共{data === '' ? 0 : data.folders.length + data.files.length}个</span>
                    </Col>
                    <Col span={6} style={{ textAlign: 'left' }}></Col>
                    <Col span={6} style={{ textAlign: 'center' }}></Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <Search placeholder="输入你要搜索的文件" style={{ width: 200 }} value={this.props.match.params.key}
                            onSearch={value => console.log(value)} />
                    </Col>
                </Row><br />

                <Row><Col span={24}> <FileList dataSource={data} onChangeFolder={this.onChangeFolder} /> </Col></Row>
            </Fragment>
        )
    }
}