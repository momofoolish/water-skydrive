import React from 'react';
import { FolderFilled, FileZipOutlined } from '@ant-design/icons';

//文件图标类型
function IconType(props) {
    switch (props.type) {
        case 'folder': return <FolderFilled />;
        case 'files': return <FileZipOutlined />;
        default: return <FileZipOutlined />;
    }
}

export default IconType;