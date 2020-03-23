import React, { useState } from 'react';
import { Checkbox, } from 'antd';

//复选框组子项
function CheckBoxItem(props) {
    const [checkItem, setItemCheck] = useState(false);
    const [inAll, setInAll] = useState(true);
    var checkAll = props.defaultCheck;
    const onItemChange = () => {
        if (!checkItem && !checkAll) { props.getValue(props.value); } else { props.cancelOption(props.value); }
        if (checkAll) { setInAll(!inAll) } else { setItemCheck(!checkItem);}
    }
    return <Checkbox onChange={onItemChange} checked={checkAll ? inAll : checkItem} ></Checkbox>
}

export default CheckBoxItem;