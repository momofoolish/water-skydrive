import React, { Fragment, useState } from 'react';
import { List, Row, Col, Checkbox } from 'antd';
import { FolderFilled } from '@ant-design/icons';
import './filelist.css';

//复选框组子项
function CheckBoxItem(props) {
    const [check, setCheck] = useState(false);
    const onChange = () => {
        if (!check) {
            props.getValue(props.value);
        }
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

    //获取选中哪一项的ID值
    const getItemValue = (value) => {
        checkArray.push(value);
        console.log(checkArray)
    }

    //切换目录
    const clickToChange = (e) => {
        e.preventDefault();
        //获取数据
        props.changeDataSource('changeDataSource');
    }

    return (
        <Fragment>
            <List header={
                <Row>
                    <Col span={14}>
                        <Checkbox onChange={onCheckAllChange} checked={checkAll} >
                            文件名
                        </Checkbox>
                    </Col>
                    <Col span={4}>大小</Col>
                    <Col span={6}>修改日期</Col>
                </Row>
            }
                dataSource={props.dataSource}
                renderItem={item => (
                    <List.Item>
                        <Col span={14} className="file-name-col">
                            <CheckBoxItem value={item.id} getValue={getItemValue} defaultCheck={checkAll} />
                            <FolderFilled style={{ color: '#FFD659', fontSize: '28px' }} />
                            <a href="#change" onClick={clickToChange}>{item.name}</a>
                        </Col>
                        <Col span={4}>90g</Col>
                        <Col span={6}>2020-02-21</Col>
                    </List.Item>
                )} />
        </Fragment>
    )
}

export default FileList;