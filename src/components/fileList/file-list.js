import React, { Fragment, useState } from 'react';
import { List, Row, Col, Checkbox, } from 'antd';
import { FolderFilled, FileZipOutlined } from '@ant-design/icons';
import moment from "moment";
import './file-list.css';

//复选框组子项
function CheckBoxItem(props) {
    const [check, setCheck] = useState(false);
    const onChange = () => {
        if (!check) { props.getValue(props.value); }
        setCheck(!check);
    }
    var checkAll = props.defaultCheck;
    return <Checkbox onChange={onChange} checked={checkAll ? checkAll : check} ></Checkbox>
}

//文件列表
function FileList(props) {
    const [checkAll, setCheckAll] = useState(false);
    const [checkArray, setCheckArray] = useState([]);
    const onCheckAllChange = () => {
        if (!checkAll) {
            setCheckArray(props.dataSource.map(item => { return item.id; }));
        } else {
            setCheckArray([]);
        }
        setCheckAll(!checkAll);
    }
    var source = props.dataSource;
    const ElementHeader = () => (
        <Row style={{ backgroundColor: "#f0f5ff" }}>
            <Col span={14}><Checkbox onChange={onCheckAllChange} checked={checkAll} > 文件名 </Checkbox></Col>
            <Col span={4}>大小</Col>
            <Col span={6}>修改日期</Col>
        </Row>
    );
    const ElementFolderList = () => (
        <MyList dataSource={props.dataSource} checkArray={checkArray} checkAll={checkAll} type="folder"
            onChangeFolder={props.onChangeFolder} />
    );
    const ElementFilesList = () => (
        <MyList dataSource={props.dataSource} checkArray={checkArray} checkAll={checkAll}
            onChangeFolder={props.onChangeFolder} />
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

//列表分类
function MyList(props) {
    //获取选中哪一项的ID值
    const getItemValue = (value) => {
        props.checkArray.push(value);
    }
    return (
        <List dataSource={props.type === "folder" ? props.dataSource.folders : props.dataSource.files} split={false}
            renderItem={item => (
                <List.Item>
                    <DataType item={item} getValue={getItemValue} defaultCheck={props.checkAll} type={props.type}
                        onChangeFolder={props.onChangeFolder} />
                </List.Item>
            )} />
    )
}

//文件分类
function DataType(props) {
    const item = props.item;
    return (
        <Fragment>
            <Col span={14} className="file-name-col">
                <CheckBoxItem value={item.id} getValue={props.getValue} defaultCheck={props.defaultCheck} />
                <IconType type={props.type} className="list-icon-type" />
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

//文件图标类型
function IconType(props) {
    switch (props.type) {
        case 'folder': return <FolderFilled />;
        case 'files': return <FileZipOutlined />;
        default: return <FileZipOutlined />;
    }
}

export default FileList;