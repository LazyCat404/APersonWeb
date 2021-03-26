/**
 * Promise 封装
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
        // 回调
        _this.callback.forEach(item => {
            item.onResolved(data);
        });
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
        // 回调
        _this.callback.forEach(item => {
            item.onRejected(data);
        });
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
 * @param { function } onResolved 成功状态回调
 * @param { function } onReject 失败状态回调
 * 返回结果是一个 Promise ，Promise 的状态由返回结果确定
 */
Promise.prototype.then = function (onResolved,onRejected) {
    let _this = this;
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
            callback(onResolved)
        }
        // 失败状态执行失败回调函数
        if(this.PromiseState === 'rejected'){  
            callback(onRejected); 
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