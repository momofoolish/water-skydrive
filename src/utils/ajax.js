import axios from 'axios';

function instance() {
    axios.defaults.baseURL = 'http://localhost:8081/api/';
    axios.defaults.timeout = 5000;
    axios.defaults.withCredentials = true;
}

const get = (url) => {
    instance(); return axios.get(url);
}

const put = (url) => {
    instance(); return axios.put(url);
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

export default {
    get, put, post, del
}