import QS from 'qs';
import axios from 'axios';
/**
 * Request Payload
 * Form-Data
 * Query String Parameters
 * 二进制上传文件
 */

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map();

function myAxios(customOptions) {
    let baseURL = 'http://172.27.139.208:9030'
    const myAxios = axios.create({
        timeout:10000,
        baseURL,
    })
    let customConfig = Object.assign(
        {   
            briefly:false,           // 简要数据结构
        },
        customOptions
    )
    // http request 请求拦截
    myAxios.interceptors.request.use(
        config => {
            removePending(config)  // 在请求开始前，对之前的请求做检查取消操作
            addPending(config)     // 将当前请求添加到 pending 中
            config.headers.Authorization = 'k7r+vB0fj+dqxcRF3ts9Gw1uVwJGIBgWvgP5qCJH9CDEHpb47F9mKcMgfjo9GTDOlQuIOXpZubwLR5aBQOez2vou/Q6BGMhIpZ1F/dy+tT/MmoOEov33PXWex2LAZEII' 
            /**
             * 其它请求前调整
             * 例如：服务器地址（config.baseURL）、接口地址（config.url）设置token、追加请求头等
             */
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
    // http response 响应拦截
    myAxios.interceptors.response.use(
        response => {
            removePending(response.config) // 在请求结束后，移除本次请求
            return Promise.resolve(customConfig.briefly? response.data:response);
        },
        error => {
            if (error.response) {
                errorHandling(error.response.status)
                return Promise.reject(error.response);
            }else{
                return Promise.reject(error.message);
            }
        }
    );
    return myAxios;
};

/**
 * http response 错误处理
 * @param {Number} status 状态码
 */
function errorHandling(status){
    switch (status) {
        case 404:
            console.log('请求网络请求不存在');
            break;
        case 401:
            console.log('401');
            break;
        default:
            console.log('通用错误');
    }
}
/**
 * 添加请求
 * @param {Object} config AxiosRequestConfig
 */
function addPending(config){
    let key = pendingKey(config)
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
        // 如果 pending 中不存在当前请求标识
        if (!pending.has(key)) { 
            // 将改请求标识添加到 pending 中 
            pending.set(key, cancel)
        }
    })
};
/**
 * 移除请求
 * @param {Object} config  AxiosRequestConfig / AxiosResponseConfig
 */
function removePending(config) {
    let key = pendingKey(config)
    // pending 中存在当前请求key
    if (pending.has(key)) {
        // 取消请求
        const cancelToken = pending.get(key)
        cancelToken(key)  
        // 在 pending 中移除这个标识 
        pending.delete(key)
    }
}
/**
 * 为每个请求生成唯一标识key
 * 当请求方式（method）、请求路径（url）、请求参数（params/data）都相同时，可以视为同一个请求
 * @param {*} config
 * @returns
 */
function pendingKey(config) {
    let { url, method, params, data } = config
    try{ 
        JSON.parse(data)
        data = JSON.parse(data)
     }catch(err){}
     
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * post 方法，对应 post 请求
 * @param {String} url 接口地址
 * @param {Object Array File } params 请求参数
 * @param {String} paramsType 参数类型：josn（默认）、query、file、data
 * @param {Object} customOptions [自定义设置]
 */
export function post(url, params, paramsType, customOptions){
    return new Promise((resolve, reject) => {
        if(typeof params == 'object'){
            let headers = {'X-Requested-With': 'application/json'}
            try{
                paramsType =  paramsType.toLowerCase()
                if(paramsType === 'query'){
                    myAxios(customOptions).post(url,null,{params}).then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
                }else if(paramsType === 'file'){
                    let formData = new FormData(); 
                    if(params instanceof File){
                        formData.append(`file`,params)
                    }else{
                        for(let item in params){
                            if(params[item] instanceof File){
                                formData.append(`${item}`, params[item]);
                            }else if(Object.prototype.toString.call(params[item]) == '[object Array]'){
                                let fileList = params[item].filter(el => el instanceof File)
                                if(fileList.length && fileList.length <= params[item].length){
                                    fileList.forEach((file,i) => {
                                        formData.append(`${item}[${i}]`,file)
                                    })
                                    if(fileList.length < params[item].length){
                                        console.warn(`数组${item}存在非文件类型对象，已被忽略`)
                                    }
                                }else{
                                    formData.append(`${item}`,JSON.stringify(params[item]))
                                }
                            }else{
                                formData.append(`${item}`,JSON.stringify(params[item]))
                            }
                        }
                    }
                    myAxios(customOptions).post(url, formData).then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
                }else if(paramsType === 'data' || paramsType === 'form-data'|| paramsType === 'formdata'){
                    myAxios(customOptions).post(url, QS.stringify(params)).then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
                }else{
                    myAxios(customOptions).post(url, params).then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
                }
            }catch{
                myAxios(customOptions).post(url,params,{ headers }).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }
        }else{
            console.error('参数类型仅支持 Object、Array、File')
        }
    })
}


// let a
// {
//     cancelToken: new axios.CancelToken((c) =>{
//         a = c;
// }
// setTimeout(()=>{
//     a('取消')
// },3000)


