import React, { Fragment } from 'react';
import { List, Row, Col, Checkbox } from 'antd';
import DataType from './data-type';
import './file-list.css';

export default class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkAll: false, checkArray: [],
        }
    }

    //变化时回调（全选选择框）
    onCheckAllChange = () => {
        const _props = this.props;
        const { checkArray, checkAll } = this.state;
        if (!checkAll) {
            checkArray.splice(0, checkArray.length);
            _props.dataSource.files.map(item => { checkArray.push(item.id); return item.id; });
            _props.dataSource.folders.map(item => { checkArray.push(item.id); return item.id; });
        } else {
            checkArray.splice(0, checkArray.length);
        }
        this.setState({ checkAll: !checkAll });
    }

    render() {
        const _props = this.props;
        const source = _props.dataSource;
        const { checkArray, checkAll } = this.state;
        //开始渲染数据
        const ElementFolderList = () => (
            <MyList
                dataSource={source} checkArray={checkArray} checkAll={checkAll} viewName={_props.viewName}
                onChangeFolder={_props.onChangeFolder} type="folder"
                updateSource={_props.updateSource}
            />
        );
        const ElementFilesList = () => (
            <MyList
                dataSource={source} checkArray={checkArray} checkAll={checkAll} viewName={_props.viewName}
                onChangeFolder={_props.onChangeFolder}
                updateSource={_props.updateSource}
            />
        );
        //记录三种状态：0 空内容，1 只有文件夹和文件，2 两种输出
        const countState = (source === '') ? 0 : (source.files.length === 0 && source.folders.length === 0) ? 0 :
            ((source.files.length !== 0 && source.folders.length !== 0) ? 2 : 1);
        //列表头部
        const ElementHeader = () => (
            <Row style={{ backgroundColor: "#f0f5ff", alignItems: 'center' }}>
                <Col span={10}>
                    <Checkbox onChange={this.onCheckAllChange} checked={checkAll} > 文件名 </Checkbox>
                </Col>
                <Col span={4}>大小</Col>
                <Col span={6}>修改日期</Col>
                <Col span={4}>操作</Col>
            </Row>
        );
        return renderComponent(countState, source, ElementHeader, ElementFolderList, ElementFilesList);
    }
}

//渲染文件
function renderComponent(countState, source, ElementHeader, ElementFolderList, ElementFilesList) {
    switch (countState) {
        case 0: return (<List></List>);
        case 1: if (source.files.length !== 0) {
            return (
                <Fragment>
                    <ElementHeader />
                    <ElementFilesList />
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <ElementHeader />
                    <ElementFolderList />
                </Fragment>
            );
        }
        case 2: return (
            <Fragment>
                <ElementHeader />
                <ElementFolderList />
                <ElementFilesList />
            </Fragment>
        );
        default: return (<List></List>);
    }
}

//列表分类
function MyList(props) {
    //获取选中哪一项的ID值
    const getItemValue = (value) => { props.checkArray.push(value); }
    //取消选择
    const cancelOption = (id) => {
        var newArray = [];
        props.checkArray.forEach(item => { if (item !== id) { newArray.push(item); } });
        props.checkArray.splice(0, props.checkArray.length);
        newArray.forEach(item => { props.checkArray.push(item); });
    }
    //渲染列表
    return (
        <List dataSource={props.type === "folder" ? props.dataSource.folders : props.dataSource.files} split={false}
            renderItem={item => (
                <List.Item className="my-list-item">
                    <DataType
                        item={item} getValue={getItemValue} defaultCheck={props.checkAll} type={props.type} updateSource={props.updateSource}
                        onChangeFolder={props.onChangeFolder} cancelOption={cancelOption} checkArray={props.checkArray}
                        viewName={props.viewName}
                    />
                </List.Item>
            )} />)
}