//上传数据封装
const uploadFiles = (file,folderId) => {
    let formData = new FormData();
    //判断文件是否超过 1g
    if (file.size > (2 * 1024 * 1024 * 1024)) {
        return "文件过大，不支持上传超过 2G";
    }
    //如果文件大于100MB进行文件拆分
    if (file.size > (1024 * 1024 * 100)) {
        formData.append("current", 5);  //当前是第几个文件
        formData.append("total", 5);    //文件总数
    } else {
        formData.append("current", 1);
        formData.append("total", 1);
    }
    formData.append("files", file);         //单个文件
    formData.append("category", 33);        //##分类id##
    formData.append("folderId", folderId);   //目录id值
    formData.append("size", file.size);     //文件大小
    formData.append("originalName", file.name);     //文件原始名称
    formData.append("fileSuffix", file.name.substring(file.name.lastIndexOf("."), file.name.length));   //文件后缀
    formData.append("newName", new Date().getTime());  //目录newName值
    formData.append("id", new Date().getTime());     //用户id值
    formData.append("lastUpdateTime", new Date());  //文件上传日期
    return formData;
}

export default { uploadFiles };