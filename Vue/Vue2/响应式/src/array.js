import { def } from './utils';

const arrayPropotype = Array.prototype;

// 以Array.prototype为原型，创建arrayMethods对象
export const arrayMethods = Object.create(arrayPropotype);
// 要被改写的7个数组方法
const methodsNeedChange = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

methodsNeedChange.forEach(methodName => {
    // 备份原来的方法
    const original = arrayPropotype[methodName];
    // 定义新方法
    def(arrayMethods,methodName,function(){
        // 恢复原来的方法
        const result = original.apply(this,arguments);
        // 把类数组对象变为数组
        const args = [...arguments];
        // 将数组身上的__ob__取出来
        const ob = this.__ob__;
        // 有三种方法push\unshift\splice能够插入新项，需要把插入的新项变为响应式
        let inserted = [];
        switch(methodName){
            case 'push':
            case 'unshift':
                inserted = arguments;
                break;
            case 'splice':
                // splice(下标,数量,插入的新项)
                inserted = args;
                break;
        }
        // 判断有没有要插入的新项
        if(inserted){
            ob.observeArray(inserted);
        }
        ob.dep.notify();
        return result;
    },false);
});