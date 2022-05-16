/**
 * axios封装
 */
 import axios, { AxiosRequestConfig } from 'axios';
 import QS from 'qs';
 
 // 声明一个 Map 用于存储每个请求的标识 和 取消函数
 const pending = new Map();
 
 interface res{
    msg: string;
    code: number;
    data: any;
 }

 function myAxios(customOptions: unknown) {
   let baseURL = '';
   // 线上环境基础地址（vite 写法）
   if (import.meta.env.MODE === 'production') {
     baseURL = <string>import.meta.env.VITE_BSAE_URL;
   }
   const myAxios = axios.create({
     timeout: 10000,
     baseURL
   });
   const customConfig = Object.assign(
     {
       briefly: false // 简要数据结构
     },
     customOptions
   );
   // http request 请求拦截
   myAxios.interceptors.request.use(
     config => {
       removePending(config); // 在请求开始前，对之前的请求做检查取消操作
       addPending(config); // 将当前请求添加到 pending 中
       /**
        * 其它请求前调整
        * 例如：服务器地址（config.baseURL）、接口地址（config.url）设置token、追加请求头等
        */
       // if (config.headers) {
       //   config.headers.Authorization =
       //     'k7r+vB0fj+dqxcRF3ts9GyKsDOXwYFlL2toZUTNuUN1PY12Ip+ZLJcv8d8pad+nPuuCwEHZU2A9/XzSgSs7vr+DWYbJRRZYLeJupp0T8RXU3Noq5Jj0ZBmO8ibnGXuj2';
       // }
       return config;
     },
     error => {
       return Promise.reject(error);
     }
   );
   // http response 响应拦截
   myAxios.interceptors.response.use(
     response => {
       removePending(response.config); // 在请求结束后，移除本次请求
       return Promise.resolve(customConfig.briefly ? response.data : response);
     },
     error => {
       if (error.response) {
         errorHandling(error.response.status);
         return Promise.reject(error.response);
       } else {
         return Promise.reject(error.message);
       }
     }
   );
   return myAxios;
 }
 
 /**
  * http response 错误处理
  * @param {Number} status 状态码
  */
 function errorHandling(status: number) {
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
 function addPending(config: AxiosRequestConfig) {
   const key = pendingKey(config);
   config.cancelToken =
     config.cancelToken ||
     new axios.CancelToken(cancel => {
       // 如果 pending 中不存在当前请求标识
       if (!pending.has(key)) {
         // 将改请求标识添加到 pending 中
         pending.set(key, cancel);
       }
     });
 }
 /**
  * 移除请求
  * @param {Object} config  AxiosRequestConfig
  */
 function removePending(config: AxiosRequestConfig) {
   const key = pendingKey(config);
   // pending 中存在当前请求key
   if (pending.has(key)) {
     // 取消请求
     const cancelToken = pending.get(key);
     cancelToken(key);
     // 在 pending 中移除这个标识
     pending.delete(key);
   }
 }
 /**
  * 为每个请求生成唯一标识key
  * 当请求方式（method）、请求路径（url）、请求参数（params/data）都相同时，可以视为同一个请求
  * @param {*} config
  * @returns
  */
 function pendingKey(config: AxiosRequestConfig) {
   const { url, method, params } = config;
   let { data } = config;
   try {
     JSON.parse(data);
     data = JSON.parse(data);
   } catch (err) {}
 
   return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
 }
 
 /**
  * get 方法，对应 get 请求
  * @param {String} url 接口地址
  * @param {Object Array} params [请求参数]：只能作为第二个参数
  * @param {String} responseType [返回值类型]：（多用于下载）blob
  * @param {Object} customOptions [自定义设置]：不可作为前两个参数
  */
 export function get(url: string, ...theArgs: any[]): Promise<res> {
   // 参数处理
   let params: any = null;
   let responseType: any = 'json';
   let customOptions: any = null;
   if (theArgs.length) {
     theArgs.forEach((item: any, i: number) => {
       if (i === 0) {
         if (typeof item == 'object') {
           params = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'blob') {
             responseType = 'blob';
           } else {
             console.error('请求参数仅支持 Object、Array类型');
           }
         } else {
           if (params) {
             console.error('请求参数仅支持 Object、Array类型');
           }
         }
       } else if (i < 3) {
         if (Object.prototype.toString.call(item) == '[object Object]') {
           customOptions = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'blob') {
             responseType = 'blob';
           } else {
             console.warn('存在无法处理的参数类型，这可能会影响您的程序');
           }
         } else {
           console.warn('存在无法处理的参数类型，这可能会影响您的程序');
         }
       } else {
         console.warn('接收到多余参数，已忽略');
       }
     });
   }
   return new Promise((resolve, reject) => {
     myAxios(customOptions)
       .get(url, { params, responseType })
       .then(res => {
         resolve(res.data);
       })
       .catch(err => {
         reject(err);
       });
   });
 }
 
 /**
  * post 方法，对应 post 请求
  * @param {String} url 接口地址
  * @param {Object Array File} params [请求参数]：只能作为第二个参数
  * @param {String} requestType [请求参数类型]：josn（默认）、query、file、data
  * @param {String} responseType [返回值类型]：（多用于下载）blob，请参数类型为query时失效
  * @param {Object} customOptions [自定义设置]：不可作为前两个参数
  */
 export function post(url: string, ...theArgs: any[]): Promise<res> {
   // 参数处理
   let params: any = null;
   let requestType: any = null;
   let responseType: any = 'json';
   let customOptions: any = null;
   if (theArgs.length) {
     theArgs.forEach((item, i) => {
       if (i === 0) {
         if (typeof item == 'object') {
           params = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'blob') {
             responseType = 'blob';
           } else if (
             item.toLowerCase() === 'json' ||
             item.toLowerCase() === 'query' ||
             item.toLowerCase() === 'file' ||
             item.toLowerCase() === 'data' ||
             item.toLowerCase() === 'form-data' ||
             item.toLowerCase() === 'formdata'
           ) {
             requestType = item.toLowerCase();
           } else {
             console.error('请求参数仅支持 Object、Array、File 类型');
           }
         } else {
           if (params) {
             console.error('请求参数仅支持 Object、Array、File 类型');
           }
         }
       } else if (i < 4) {
         if (Object.prototype.toString.call(item) == '[object Object]') {
           customOptions = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'blob') {
             responseType = 'blob';
           } else if (
             item.toLowerCase() === 'json' ||
             item.toLowerCase() === 'query' ||
             item.toLowerCase() === 'file' ||
             item.toLowerCase() === 'data' ||
             item.toLowerCase() === 'form-data' ||
             item.toLowerCase() === 'formdata'
           ) {
             requestType = item.toLowerCase();
           } else {
             console.warn('存在无法处理的参数类型，这可能会影响您的程序');
           }
         } else {
           console.warn('存在无法处理的参数类型，这可能会影响您的程序');
         }
       } else {
         console.warn('接收到多余参数，已忽略');
       }
     });
     // 提示
     if (responseType != 'json' && requestType == 'query') {
       console.warn('请参数类型为query时，设置返回值类型无效');
     }
   }
   return new Promise((resolve, reject) => {
     if (requestType === 'query') {
       myAxios(customOptions)
         .post(url, null, { params })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     } else if (requestType === 'file') {
       const formData = new FormData();
       if (params instanceof File) {
         formData.append(`file`, params);
       } else {
         for (const item in params) {
           if (params[item] instanceof File) {
             formData.append(`${item}`, params[item]);
           } else if (Object.prototype.toString.call(params[item]) == '[object Array]') {
             const fileList = params[item].filter((el: any) => el instanceof File);
             if (fileList.length && fileList.length <= params[item].length) {
               fileList.forEach((file: File, i: number) => {
                 formData.append(`${item}[${i}]`, file);
               });
               if (fileList.length < params[item].length) {
                 console.warn(`数组${item}存在非文件类型对象，已被忽略`);
               }
             } else {
               formData.append(`${item}`, JSON.stringify(params[item]));
             }
           } else {
             formData.append(`${item}`, JSON.stringify(params[item]));
           }
         }
       }
       myAxios(customOptions)
         .post(url, formData, { responseType })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     } else if (requestType === 'data' || requestType === 'form-data' || requestType === 'formdata') {
       myAxios(customOptions)
         .post(url, QS.stringify(params), { responseType })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     } else {
       myAxios(customOptions)
         .post(url, params, { responseType })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     }
   });
 }
 
 /**
  * del 方法，对应 delete 请求
  * @param {String} url 接口地址
  * @param {Object Array} params [请求参数]：只能作为第二个参数
  * @param {String} requestType [请求参数类型]：josn（默认）、query
  * @param {Object} customOptions [自定义设置]：不可作为前两个参数
  */
 export function del(url: string, ...theArgs: any[]): Promise<res> {
   // 参数处理
   let params: any = null;
   let requestType: any = null;
   let customOptions: any = null;
   if (theArgs.length) {
     theArgs.forEach((item, i) => {
       if (i === 0) {
         if (typeof item == 'object') {
           params = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'query') {
             requestType = item.toLowerCase();
           } else {
             console.error('请求参数仅支持 Object、Array 类型');
           }
         } else {
           if (params) {
             console.error('请求参数仅支持 Object、Array 类型');
           }
         }
       } else if (i < 3) {
         if (Object.prototype.toString.call(item) == '[object Object]') {
           customOptions = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'query') {
             requestType = item.toLowerCase();
           } else {
             console.warn('存在无法处理的参数类型，这可能会影响您的程序');
           }
         } else {
           console.warn('存在无法处理的参数类型，这可能会影响您的程序');
         }
       } else {
         console.warn('接收到多余参数，已忽略');
       }
     });
   }
   return new Promise((resolve, reject) => {
     if (requestType === 'query') {
       myAxios(customOptions)
         .delete(url, { params })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     } else {
       myAxios(customOptions)
         .delete(url, { data: params })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     }
   });
 }
 
 /**
  * put 方法，对应 put 请求
  * @param {String} url 接口地址
  * @param {Object Array File} params [请求参数]：只能作为第二个参数
  * @param {String} requestType [请求参数类型]：josn（默认）、query、file、data
  * @param {String} responseType [返回值类型]：（多用于下载）blob，请参数类型为query时失效
  * @param {Object} customOptions [自定义设置]：不可作为前两个参数
  */
 export function put(url: string, ...theArgs: any[]): Promise<res> {
   // 参数处理
   let params: any = null;
   let requestType: any = null;
   let responseType: any = 'json';
   let customOptions: any = null;
   if (theArgs.length) {
     theArgs.forEach((item, i) => {
       if (i === 0) {
         if (typeof item == 'object') {
           params = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'blob') {
             responseType = 'blob';
           } else if (
             item.toLowerCase() === 'json' ||
             item.toLowerCase() === 'query' ||
             item.toLowerCase() === 'file' ||
             item.toLowerCase() === 'data' ||
             item.toLowerCase() === 'form-data' ||
             item.toLowerCase() === 'formdata'
           ) {
             requestType = item.toLowerCase();
           } else {
             console.error('请求参数仅支持 Object、Array、File 类型');
           }
         } else {
           if (params) {
             console.error('请求参数仅支持 Object、Array、File 类型');
           }
         }
       } else if (i < 4) {
         if (Object.prototype.toString.call(item) == '[object Object]') {
           customOptions = item;
         } else if (typeof item == 'string') {
           if (item.toLowerCase() === 'blob') {
             responseType = 'blob';
           } else if (
             item.toLowerCase() === 'json' ||
             item.toLowerCase() === 'query' ||
             item.toLowerCase() === 'file' ||
             item.toLowerCase() === 'data' ||
             item.toLowerCase() === 'form-data' ||
             item.toLowerCase() === 'formdata'
           ) {
             requestType = item.toLowerCase();
           } else {
             console.warn('存在无法处理的参数类型，这可能会影响您的程序');
           }
         } else {
           console.warn('存在无法处理的参数类型，这可能会影响您的程序');
         }
       } else {
         console.warn('接收到多余参数，已忽略');
       }
     });
     // 提示
     if (responseType != 'json' && requestType == 'query') {
       console.warn('请参数类型为query时，设置返回值类型无效');
     }
   }
   return new Promise((resolve, reject) => {
     if (requestType === 'query') {
       myAxios(customOptions)
         .put(url, null, { params })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     } else if (requestType === 'file') {
       const formData = new FormData();
       if (params instanceof File) {
         formData.append(`file`, params);
       } else {
         for (const item in params) {
           if (params[item] instanceof File) {
             formData.append(`${item}`, params[item]);
           } else if (Object.prototype.toString.call(params[item]) == '[object Array]') {
             const fileList = params[item].filter((el: any) => el instanceof File);
             if (fileList.length && fileList.length <= params[item].length) {
               fileList.forEach((file: File, i: number) => {
                 formData.append(`${item}[${i}]`, file);
               });
               if (fileList.length < params[item].length) {
                 console.warn(`数组${item}存在非文件类型对象，已被忽略`);
               }
             } else {
               formData.append(`${item}`, JSON.stringify(params[item]));
             }
           } else {
             formData.append(`${item}`, JSON.stringify(params[item]));
           }
         }
       }
       myAxios(customOptions)
         .put(url, formData, { responseType })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     } else if (requestType === 'data' || requestType === 'form-data' || requestType === 'formdata') {
       myAxios(customOptions)
         .put(url, QS.stringify(params), { responseType })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     } else {
       myAxios(customOptions)
         .put(url, params, { responseType })
         .then(res => {
           resolve(res.data);
         })
         .catch(err => {
           reject(err);
         });
     }
   });
 }
 