import {def} from './utils';
import defineReactive from './defineReactive';
import { arrayMethods } from './array';

/**
 * 将一个正常的Object 转换为每个层级的属性都是响应式的（可以被侦测）Object
 */
export default class Observer {
    constructor(value){
        // 给实例添加 __ob__ 属性(this指向实列)
        def(value,'__ob__',this,false);
        // 判断是否为数组
        if(Array.isArray(value)){
            // 是数组，强行将该数组原型指向我们改写后的数组原型（arrayMethods）
            Object.setPrototypeOf(value,arrayMethods);
        }else{
            this.walk(value);
        }
    }
    // 遍历：将一个正常的object转换为每个层级属性都是响应式的object
    walk(value){
        for(let k in value){
            defineReactive(value,k);
        }
    }
};