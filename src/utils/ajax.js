import axios from 'axios';

function instance() {
    axios.defaults.timeout = 15000;
    axios.defaults.withCredentials = true;
}

const get = (url) => {
    instance(); return axios.get(url);
}

const put = (url, data) => {
    instance(); return axios.put(url, data, { headers: { "Content-Type": "application/json;charset=UTF-8" } });
}

const post = (url, data) => {
    instance(); return axios.post(url, data, {
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
}

async function del(url, data) {
    instance(); return await axios.delete(url, { data: data }, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
}

const postFiles = (url, data) => {
    return axios.post(url, data, {}, { headers: { "Content-Type": "multipart/form-data" } });
}

export default {
    get, put, post, del,
    postFiles,
}