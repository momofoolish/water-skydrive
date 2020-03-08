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
function FileList() {

    const [checkAll, setCheckAll] = useState(false);
    const [checkArray, setCheckArray] = useState([]);

    const data = [
        { id: '1', name: 'Racing car sprays burning fuel into crowd.' },
        { id: '2', name: 'Japanese princess to wed commoner.' },
        { id: '3', name: 'Australian walks 100km after outback crash.' },
        { id: '4', name: 'Man charged over missing wedding girl.' },
        { id: '5', name: 'Los Angeles battles huge wildfires.' },
    ];

    const onCheckAllChange = () => {
        if (!checkAll) {
            setCheckArray(data.map(item => { return item.id; }));
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
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Col span={14} className="file-name-col">
                            <CheckBoxItem value={item.id} getValue={getItemValue} defaultCheck={checkAll} />
                            <FolderFilled style={{ color: '#FFD659', fontSize: '28px' }} />
                            <span>{item.name}</span>
                        </Col>
                        <Col span={4}>90g</Col>
                        <Col span={6}>2020-02-21</Col>
                    </List.Item>
                )} />
        </Fragment>
    )
}

export default FileList;