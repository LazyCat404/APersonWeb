import { isFunction } from "@vue/shared";
import { isTracking, ReactiveEffect, trackEffects,triggerEffects } from "./effect";
/**
 * 计算属性是一个effect，dirty = true
 * 计算属性的依赖会收集这个effect
 * 计算属性具备依赖收集功能，会收集对应的effect 方法
 * 
 * 第一次执行effect时会取computed的值，dirty = true
 * 多次执行会走缓存
 * 
 * 计算属性依赖的值发生了变化，dirty = true，触发计算属性收集的effect
 * 再次取计算属性的值，会重新计算（因为dirty = true）
 */


class ComputedRefImpl {
    public dep:any; // this.dep = undefined
    public _dirty = true;
    public __v_isRef = true;
    public effect:any;  // 计算属性依赖于effect
    public _value:any;
    constructor(getter:Function,setter:Function){
        // 将计算属性包装成一个effect，那么计算属性中的属性会收集这个effect
        this.effect = new ReactiveEffect(getter,()=>{
            // 计算属性依赖的值变化，不需要执行计算属性的effect，而是执行此函数
            if(!this._dirty){
                this._dirty = true;
                // 执行计算属性收集的effect
                triggerEffects(this.dep);
            }
        })
    }
    get value(){    // 取值时会执行get方法
        if(isTracking()){
            // 收集计算属性effect
            trackEffects(this.dep || (this.dep = new Set()))
        }
        if(this._dirty){
            // 将结果缓存到this._value
            this._value = this.effect.run();
            this._dirty = false
        }
        return this._value;
    }
    set value(newValue){
        this.effect(newValue)
    }
}

export function computed(getterOptions:any){
    const onlyGetter = isFunction(getterOptions);   // 只传了 getter

    let getter:Function;
    let setter:Function;

    if(onlyGetter){
        getter = getterOptions as Function;
        setter = () =>{}
    }else{
        getter = getterOptions.get;
        setter = getterOptions.set;
    } 
    return new ComputedRefImpl(getter,setter)  
}