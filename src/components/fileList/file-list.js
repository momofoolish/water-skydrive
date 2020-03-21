import React, { Fragment, useState } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { List, Row, Col, Checkbox, } from 'antd';
import { FolderFilled, FileZipOutlined } from '@ant-design/icons';
import moment from "moment";
import './file-list.css';

export default class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkAll: false, checkArray: [],
        }
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate(this);     //避免重复渲染
    }
    
    render() {
        const { checkArray, checkAll } = this.state;
        const _props = this.props;
        //变化时回调（全选选择框）
        const onCheckAllChange = () => {
            if (!checkAll) {
                checkArray.splice(0, checkArray.length);
                _props.dataSource.files.map(item => { checkArray.push(item.id); return item.id; });
                _props.dataSource.folders.map(item => { checkArray.push(item.id); return item.id; });
            } else {
                checkArray.splice(0, checkArray.length);
            }
            this.setState({ checkAll: !checkAll });
            _props.getIdArray(checkArray);
        }
        const ElementHeader = () => (
            <Row style={{ backgroundColor: "#f0f5ff" }}>
                <Col span={14}>
                    <Checkbox onChange={onCheckAllChange} checked={checkAll} > 文件名 </Checkbox>
                </Col>
                <Col span={4}>大小</Col>
                <Col span={6}>修改日期</Col>
            </Row>
        );
        //开始渲染数据
        var source = _props.dataSource;
        const ElementFolderList = () => (
            <MyList dataSource={_props.dataSource} checkArray={checkArray} checkAll={checkAll} onItemChange={_props.getIdArray}
                onChangeFolder={_props.onChangeFolder} type="folder" />
        );
        const ElementFilesList = () => (
            <MyList dataSource={_props.dataSource} checkArray={checkArray} checkAll={checkAll} onItemChange={_props.getIdArray}
                onChangeFolder={_props.onChangeFolder} />
        );
        //记录三种状态：0 空内容，1 只有文件夹和文件，2 两种输出
        const countState = (source === '') ? 0 : (source.files.length === 0 && source.folders.length === 0) ? 0 :
            ((source.files.length !== 0 && source.folders.length !== 0) ? 2 : 1);
        switch (countState) {
            case 0: return <List></List>;
            case 1: if (source.files.length !== 0) {
                return <Fragment> <ElementHeader /><ElementFilesList /> </Fragment>;
            } else {
                return <Fragment> <ElementHeader /><ElementFolderList /></Fragment>;
            }
            case 2: return <Fragment> <ElementHeader /><ElementFolderList /><ElementFilesList /> </Fragment>;
            default: return <List></List>;
        }
    }
}

//列表分类
function MyList(props) {
    //获取选中哪一项的ID值
    const getItemValue = (value) => {
        props.checkArray.push(value);
    }
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
                    <DataType item={item} getValue={getItemValue} defaultCheck={props.checkAll} type={props.type}
                        onChangeFolder={props.onChangeFolder} cancelOption={cancelOption} checkArray={props.checkArray}
                        onItemChange={props.onItemChange} />
                </List.Item>
            )} />)
}

//文件分类
function DataType(props) {
    const item = props.item;
    return (
        <Fragment>
            <Col span={14} className="file-name-col">
                <CheckBoxItem getValue={props.getValue} defaultCheck={props.defaultCheck} value={item.id}
                    cancelOption={props.cancelOption} checkArray={props.checkArray} onItemChange={props.onItemChange} />
                <div className="list-icon-type"><IconType type={props.type} /></div>
                <a href="#c" onClick={(e) => props.onChangeFolder(item.parentId, item.id, item.name, e)}
                    className="a-file-click" >
                    {props.type === "folder" ? item.name : item.originalName}
                </a>
            </Col>
            <Col span={4}>
                {
                    (props.type === "folder" ? " " : (item.size > 1024) ? ((item.size / 1024) < 1024 ?
                        Math.round(item.size / 1024) + 'KB' : Math.round(item.size / 1024 / 1024) < 1024 ?
                            Math.round(item.size / 1024 / 1024) + 'MB' : Math.round(item.size / 1024 / 1024 / 1024) + 'GB') :
                        (item.size + 'B'))
                }
            </Col>
            <Col span={6}>{moment(item.lastUpdateTime).format('YYYY-MM-DD')}</Col>
        </Fragment>
    )
}

//复选框组子项
function CheckBoxItem(props) {
    const [checkItem, setItemCheck] = useState(false);
    const [inAll, setInAll] = useState(true);
    var checkAll = props.defaultCheck;
    const onItemChange = () => {
        if (!checkItem && !checkAll) { props.getValue(props.value); } else { props.cancelOption(props.value); }
        if (checkAll) { setInAll(!inAll) } else { setItemCheck(!checkItem); }
        props.onItemChange(props.checkArray);
    }
    return <Checkbox onChange={onItemChange} checked={checkAll ? inAll : checkItem} ></Checkbox>
}

//文件图标类型
function IconType(props) {
    switch (props.type) {
        case 'folder': return <FolderFilled />;
        case 'files': return <FileZipOutlined />;
        default: return <FileZipOutlined />;
    }
}