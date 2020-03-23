import React, { Fragment, useState } from 'react';
import moment from "moment";
import { Col, Button, Input, message } from 'antd';
import IconType from './Icon-type';
import CheckBoxItem from './check-box';
import ajax from '../../utils/ajax';

//文件分类
function DataType(props) {
    const [rename, setRename] = useState(false);
    const item = props.item;

    //定义发送请求的方法
    const httpRequest = (url, formData, msg, type) => {
        if (type === "put") {
            ajax.put(url, formData).then(response => {
                responseMsg(response);
            }).catch(error => { console.log(error) });
        } else {
            ajax.post(url, formData).then(response => {
                responseMsg(response);
            }).catch(error => { console.log(error) });
        }

        const responseMsg = (response) => {
            var res = response.data;
            if (res.code === 0) {
                message.success(msg);
                props.updateSource(res.data);   //更新视图
            }
        }
    }

    //重命名操作
    const onRenameHandler = (e, id) => {
        if (e.target.value === "") {
            setRename(false);
            return;
        }
        let formData = new FormData();
        formData.append("id", id);
        //判断是文件还是文件夹
        if (typeof (id) === "number") {
            formData.append("name", e.target.value);
            httpRequest("/api/folder", formData, "修改文件夹名称成功", "put");
        } else {
            formData.append("originalName", e.target.value);
            httpRequest("/api/file", formData, "修改文件名称成功", "put");
        }
    }

    //恢复文件
    const restoreHandler = (id) => {
        var formData = new FormData();
        //判断是文件还是文件夹
        if (typeof (id) === "number") {
            formData.append("iId", id);
            formData.append("sId", []);
            httpRequest("/api/recycle", formData, "恢复成功", "post");
        } else {
            formData.append("sId", id);
            formData.append("iId", []);
            httpRequest("/api/recycle", formData, "恢复成功", "post");
        }
    }

    return (
        <Fragment>
            <Col span={10} className="file-name-col">
                <CheckBoxItem getValue={props.getValue} defaultCheck={props.defaultCheck} value={item.id}
                    cancelOption={props.cancelOption} checkArray={props.checkArray} />
                <div className="list-icon-type">
                    <IconType type={props.type} />
                </div>
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
            <Col span={4} >
                {
                    props.viewName !== "home" ?
                        (
                            <Button size="small" onClick={() => { restoreHandler(item.id) }}>恢复</Button>
                        ) :
                        (
                            rename ?
                                (
                                    <Input placeholder="输入新的文件名称" size="small"
                                        onPressEnter={(e) => onRenameHandler(e, item.id)}
                                    />
                                )
                                : (
                                    <Fragment>
                                        <Button size="small" onClick={() => { setRename(true) }}>重命名</Button>
                                        <Button size="small">下载</Button>
                                    </Fragment>
                                )
                        )
                }
            </Col>
        </Fragment >
    )
}

export default DataType;