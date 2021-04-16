import observe from './observe';
/**
 * @param {Object} data 数据对象 
 * @param {String} key 键名
 * @param {*} val 值 
 */
export default function defineReactive(data,key,val){
    if(arguments.length == 2){
        val = data[key];
    }
    // 循环调用
    let childOb = observe(val);
    Object.defineProperty(data,key,{
        // 可枚举
        enumerable:true,
        // 可配置（比如：删除）
        configurable:true,
        get(){
            return val;
        },
        set(newValue){
            if(val === newValue){
                return;
            }else{
                val = newValue;
                // 当设置了新值，也要被observe
                childOb = observe(newValue);
            }
        }
    })
}
