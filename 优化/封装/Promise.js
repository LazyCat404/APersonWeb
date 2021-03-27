/**
 * Promise 函数封装
 */

/**
 * 创建 Prmise 函数 
 * @param {*} executor  执行器函数
 */
function Promise(executor){
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

/**
 * 添加实例方法 then  
 * @param { function } onResolved 成功状态回调（非必填）
 * @param { function } onRejected 失败状态回调（非必填）
 * 返回一个 Promise ，Promise 的状态由返回结果确定
 */
Promise.prototype.then = function (onResolved,onRejected) {
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

/**
 * 添加实例方法 catch  
 * @param { function } onRejected 失败状态回调
 * 失败回调，没有成功回调，功能在then 方法中都已经实现
 */
Promise.prototype.catch = function (onRejected){
    // 只穿入失败回调
    return this.then(undefined,onRejected);
}

/**
 * 添加属性方法 resolve   
 * @param {*} value
 * 返回一个 Promise 对象，Promise 的状态由返回结果确定
 */
Promise.resolve = function(value){
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

/**
 * 添加属性方法 reject   
 * @param {*} reason
 * 返回一个 Promise 对象，Promise 的状态永远是失败
 */
Promise.reject = function(reason){
    return new Promise((resolve,reject)=> {
        reject(reason);
    });
}

/**
 * 添加属性方法 all   
 * @param { Array } promise promise对象组成的数组
 * 返回一个 Promise 对象，Promise 的状态由传入的Promise决定，如果都为成功则为成功，返回结果为每个传入的Promise 结果组成的数组；如果传入的Promise 有一个失败，则为失败，返回结果为失败的Promise的结果
 */
Promise.all = function(promise){
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

/**
 * 添加属性方法 race   
 * @param { Array } promise promise对象组成的数组
 * 返回一个 Promise 对象，Promise 的状态由传入的Promise决定，谁先改变状态，结果就为谁的状态，和值
 */
Promise.race = function (promise){
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
};