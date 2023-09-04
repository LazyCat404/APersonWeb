import Dep from './Dep';
import observe from './observe';
/**
 * @param {Object} data 数据对象 
 * @param {String} key 键名
 * @param {*} val 值 
 */
export default function defineReactive(data,key,val){
    const dep = new Dep();
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
            // console.log(`你正在访问 ${ key } 属性`)
            // 如果存在dep
            if(Dep.target){
                dep.depend()
                if(childOb){
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set(newValue){
            if(val === newValue){
                return;
            }else{
                // console.log(`你正在修改 ${ key } 属性`)
                val = newValue;
                // 当设置了新值，也要被observe
                childOb = observe(newValue);
                // 发布订阅模式，通知dep
                dep.notify();
            }
        }
    })
}
