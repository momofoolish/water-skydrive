import ajax from "./ajax";

const download = (id, name) => {
    ajax.get("/api/download/" + id).then(response => {
        let blob = new Blob([response.data]);
        const aTag = document.createElement("a");
        aTag.href = URL.createObjectURL(blob);
        aTag.download = name;
        aTag.click();
        URL.revokeObjectURL(aTag.href);
        aTag.remove();
    }).catch(error => { console.log(error) });
}

export default { download };