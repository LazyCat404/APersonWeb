/**
 * @param {Object} obj 对象
 * @param {String} key 键名
 * @param {*} value 设置的值
 * @param {Boolean} eunmerable 是否可被枚举
 */
export const def = function(obj,key,value,enumerable){
    Object.defineProperty(obj,key,{
        value,
        enumerable,
        writable:true,
        configurable:true
    });
}