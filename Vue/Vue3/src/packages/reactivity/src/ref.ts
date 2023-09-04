import { isTracking, trackEffects, triggerEffects } from "./effect";
import { toReactive } from "./reactive";

class RefImpl {
    public dep:any;
    public __v_isRef:any;
    public _value:any;
    /**
     * @param rawValue 原来的值
     */
    constructor(public _rawValue:any){
        // 如果_rawValue 是一个对象，则将其变为响应式对象
        this._value = toReactive(_rawValue)
    }
    // 类的属性访问器：最终会变为defineProperty
    get value(){ // 取值时进行依赖收集
        if(isTracking()){
            trackEffects(this.dep || (this.dep = new Set()))
        }
        return this._value
    }
    set value(newValue){    // 赋值时触发更新
        // 设置的值 !== 原来的值
        if(newValue !== this._rawValue){
            this._rawValue = newValue;  // 将原来的值变为改变后的值
            this._value = toReactive(newValue); // 赋的值可能是个对象，所以用toReactive转一下
            triggerEffects(this.dep);   // 执行收集到的effect，触发更新
        }
    }
}

function createRef(value:unknown){
    return new RefImpl(value)
}

export function ref(value:unknown){
    return createRef(value)
}