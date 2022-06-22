import { isObject } from "@vue/shared";
import { track,trigger } from "./effect";

const enum reactiveFlags {
    IS_REACTIVE = '__v_isReacitve'
}

/**
 * 代理对象的可变式处理
 */
const mutableHandlers:ProxyHandler<Record<any, any>> = {
    /**
     * 获取/使用对象时，会执行get方法
     * @param target 原始对象
     * @param key 对象属性的Key
     * @param recevier 代理后的对象
     * @returns 
     */
    get(target,key,recevier){ 
        if(key === reactiveFlags.IS_REACTIVE){
            return true
        }
        track(target,key)  // 收集器：记录属性对应的effect
        const res = Reflect.get(target,key,recevier)
        return res
    },
    /**
     * 改变/赋值对象时，会执行set方法
     * @param target 原始对象
     * @param key 对象属性的Key
     * @param value 要给对象赋的值
     * @param recevier 赋值后的代理后的对象
     * @returns 是否成功
     */
    set(target,key,value,recevier){
        let oldValue = (target as any)[key]
        const res = Reflect.set(target,key,value,recevier)
        // 值发生改变，触发值对应的effect
        if(oldValue !== value){ 
            trigger(target,key) // 找到属性对应的 effect 让他重新执行
        }
        return res
    }
}

// Map 和 WeakMap 区别
const reactiveMap = new WeakMap();  // weakmap 弱引用，key 必须是对象，如果key没有被引用，可以被自动销毁

/**
 * 工厂函数：创建一个响应式对象
 * @param target 原始对象
 * @returns 代理对象
 */
function createReactiveObject(target:any){
    // 默认目标是代理过的值:一个对象被代理过，再次被代理会返回之前的代理对象
    if(target[reactiveFlags.IS_REACTIVE]){
        return target
    }
    // 不是对象直接返回
    if(!isObject(target)){
        return target
    }
    // 同一个对象被代理多次，返回同一个对象
    const exisitingProxy = reactiveMap.get(target); //缓存
    if(exisitingProxy){
        return exisitingProxy;  // 如果该对象已经被代理过，直接返回代理对象
    }
    const proxy = new Proxy(target,mutableHandlers);  // 劫持用户数据
    reactiveMap.set(target,proxy);  // 将元对象 和 代理对象做一个映射表
    return proxy; // 返回对象     
}

/**
 * reactive api，返回一个响应式对象
 * @param target 原始对象
 * @returns 经过代理的响应式对象
 */
export function reactive(target:Object)  {
    return createReactiveObject(target)
}

export function toReactive(value:unknown){
    // 判断一个值是否为对象，是对象则包装成响应式返回，否则返回原值
    return isObject(value) ? reactive(value):value
}

export function readonly()  {
   
    
}
export function shallowReactive()  {
   
    
}

export function shallowReadonly(){

}