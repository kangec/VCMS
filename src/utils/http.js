import axios from 'axios';
import Qs from 'qs';
import {Message, Loading} from 'element-ui'; // 消息提示框组件 这个你们可以不用


axios.defaults.baseURL = 'http://localhost:8083/api/v1';


// 设置请求超时时间
axios.defaults.timeout = 10000;

// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截
axios.interceptors.request.use(config => {
    // 在发送请求之前做些什么 验证token之类的
    // Loading.service(true);
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.error(error);
})

// 响应拦截
axios.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});


// 封装get方法和post方法

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
            // eslint-disable-next-line no-undef
            Loading.service(true).close();
            //  Message({message: '请求成功', type: 'success'});
        }).catch(err => {
            reject(err.data)
            //Loading.service(true).close();
            Message({message: '加载失败', type: 'error'});
        })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, Qs.stringify(params))
            .then(res => {
                resolve(res.data);
                Loading.service(true).close();
                //  Message({message: '请求成功', type: 'success'});
            })
            .catch(err => {
                reject(err.data)
                // Loading.service(true).close();
                Message({message: '加载失败', type: 'error'});
            })
    });
}
