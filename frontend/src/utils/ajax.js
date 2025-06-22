import axios from 'axios'
import qs from 'qs'


const BASE_URL = process.env.API_PATH;

const defaultOptions = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest'
    }
}
axios.interceptors.request.use(
    config => {
        if (config.method === 'post') {
            if (Object.prototype.toString.call(config.params) == '[object FormData]' || config.headers['Content-Type'] == 'application/json;charset=utf-8') {
                if (config.data == undefined) {
                    config.data = config.params
                }
            } else {
                config.data = qs.stringify(config.params);
            }
            delete config.params
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.code !== 200) {
            console.log({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            })

            // if (res.code === 10000||res.code === 403) {
            // store.dispatch('FedLogOut').then(() => {
            // 			location.reload()// 为了重新实例化vue-router对象 避免bug
            // })
            // }
            return Promise.reject('error')
        } else {
            return response
        }
    }, error => {
        console.log(error.response.status)
        if (error && error.response && error.response.status) {
            if (error.response.status == 401) {
                location.href = error.response.headers.location.split("=")[0] + "=" + window.location.href
            }
        }
        console.log({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)


export const ajax = (options) => {
    // options.url = BASE_URL + options.url;
    let _options = Object.assign({}, defaultOptions, options);
    return axios(_options).then((res) => {
        return res.data
    })
}

export const baseUrl = () => {
    return BASE_URL
}
