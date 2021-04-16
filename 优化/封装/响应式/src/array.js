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
        console.log('hello word');
        original.apply(this,arguments);
    },false);
});