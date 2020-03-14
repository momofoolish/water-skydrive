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

const del = (url) => {
    instance(); return axios.delete(url);
}

const postFiles = (url, data) => {
    return axios.post(url, data, {}, { headers: { "Content-Type": "multipart/form-data" } });
}

export default {
    get, put, post, del,
    postFiles,
}