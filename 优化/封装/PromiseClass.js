/**
 * Promise 类封装 学习建议看 Promise.js
 */

class Promise {
    // 构造方法
    constructor(executor){
        // 添加属性
        this.PromiseState = 'pending';      // 状态
        this.PromiseResult = null;          // 结果
        this.callback = [];                 // 保存回调函数，用以处理异步回调，数组可支持多个回调                 
        let _this = this;                   // 保存对象this

        /**
         * resolve 函数 供执行器函数调用
         * @param {*} data 
         * 1. 修改对象状态：promiseState -> fulfilled
         * 2. 设置对象结果值：promiseResult
         * 3. 调用成功回调函数，在这里调用可实现异步回调
         */
        function resolve(data){
            if (_this.PromiseState !== 'pending') return;   // 状态改变，直接返回，不在继续执行（状态只能改变一次）
            _this.PromiseState = 'fulfilled';
            _this.PromiseResult = data;
            // 回调(异步执行)
            setTimeout(() => {
                _this.callback.forEach(item => {
                    item.onResolved(data);
                });
            })
        }

        /**
         * reject 函数 供执行器函数调用
         * @param {*} data
         * 1. 修改对象状态：PromiseState -> rejected
         * 2. 设置对象结果值： PromiseResult
         * 3. 调用失败回调函数，在这里调用可实现异步回调
         */
        function reject(data){
            if (_this.PromiseState !== 'pending') return;   // 状态改变，直接返回，不在继续执行（状态只能改变一次）
            _this.PromiseState = 'rejected';
            _this.PromiseResult = data;
            // 回调(异步执行)
            setTimeout(() => {
                _this.callback.forEach(item => {
                    item.onRejected(data);
                });
            })
        }
        
        try{
            /**
             * Promise 对象传入的函数 同步调用 执行
             * @param { function } resolve 成功状态回调
             * @param { function } reject  失败状态回调     
             */
            executor(resolve,reject);
        }catch (error){
            // 修改 PromiseState -> rejected
            reject(error);
        }
    }

    // then 方法
    then(onResolved,onRejected) {
        let _this = this;
        if( typeof onRejected != 'function'){   // 第二个参数未传（错误回调可以不传）
            onRejected = error => {
                throw error;
            }
        };
        if( typeof onResolved != 'function'){   // 第一个参数未传（成功可以不传）
            onResolved = value => value;
        };
        return new Promise((resolve,reject) => {
            // 封装函数 [回调函数]
            function callback(type) {
                try{
                    let result = type(_this.PromiseResult);
                    // 如果返回结果是Promise 类型对象
                    if(result instanceof Promise){  
                        // 返回结果的状态就是回调对象的状态
                        result.then(v => {
                            resolve(v);
                        },e => {
                            reject(e);
                        })
                    }else{
                        // 结果对象状态为[成功]
                        resolve(result);
                    }
                }catch(error){
                    reject(error);
                }
            }
            // 成功状态执行成功回调函数
            if(this.PromiseState === 'fulfilled'){  
                // 异步执行
                setTimeout(() => {
                    callback(onResolved)
                })
            }
            // 失败状态执行失败回调函数
            if(this.PromiseState === 'rejected'){ 
                // 异步执行 
                setTimeout(() => {
                    callback(onRejected); 
                })
            }
            // pending 状态，保存回调函数，待状态改变时调用（用于处理异步操作）
            if(this.PromiseState === 'pending'){ 
                this.callback.push({ 
                    onResolved:function (){ // 写成函数，为了异步执行时调用
                        callback(onResolved)
                    },
                    onRejected:function (){
                        callback(onRejected); 
                    }
                })
            }
        });
    }

    // catch 方法
    catch(onRejected){
        // 只穿入失败回调
        return this.then(undefined,onRejected);
    }

    /**
     * 添加静态方法
     */
    // resolve 方法
    static resolve(value){
        return new Promise((resolve,reject) => {
            if(value instanceof Promise){
                value.then(v => {
                    resolve(v);
                },e => {
                    reject(e);
                });
            }else{
                resolve(value);
            }
        });
    }

    // reject 方法 
    static reject(reason){
        return new Promise((resolve,reject)=> {
            reject(reason);
        });
    }
    
    // all 方法
    static all(promise){
        return new Promise((resolve,reject) => {
            let count = 0;  // 用于判断每个传入对象
            let arr = [];   // 存放成功的结果
            promise.forEach((item,i) => {
                item.then(v => {
                    count++;
                    arr[i] = v; // 不用push，防止异步方法改变顺序
                    if(count === promise.length){
                        // 因为 Promise 状态只能修改一次
                        resolve(arr);
                    }
                },e => {
                    reject(e);
                });
            })
        });
    }

    // race 方法
    static race(promise){
        return new Promise ((resolve,reject) => {
            promise.forEach((item,i) => {
                item.then(v => {
                    // 直接修改状态为 [成功]
                    resolve(v);
                },e => {
                    // 直接修改状态为失败
                    reject(e);
                })
            })
        });
    }
}