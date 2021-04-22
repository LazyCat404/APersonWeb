/**
 * 手写减弱版 h 函数（只实现3个参数的情况）
 * h 函数用法：
 * 1. h('div','文本')
 * 2. h('div',[])
 * 3. h('div',h())
 * 5. h('div',{},'文本')
 * 4. h('div',{},[])
 * 6. h('div',{},h())
 */

import vnode from './vnode';

/**
 * 低配版h 函数，必须接受3个参数，也就是说，此h函数的调用形态必须是一下三种之一：
 * 1. h('div',{},'文本')
 * 2. h('div',{},[])
 * 3. h('div',{},h())
 * @param { String } sel   标签
 * @param { Object } data  属性
 * @param { String,Number,Function,Array } c     文本/数字/函数/数组/  
 * @returns 虚拟DOM 
 */
export default function(sel,data,c){
    // 检查参数个数
    if(arguments.length == 3 ){
        // 检查 参数 c 的类型
        if(typeof c == 'number' || typeof c == 'string'){
            // h('div',{},'文本')
            return vnode(sel,data,undefined,c,undefined);
        }else if(Array.isArray(c)){     
            // h('div',{},[]) 数组内存放 h 函数
            let children = [];
            c.forEach( item => {
                // 检查每一项传入参数的格式
                if(typeof item == 'object' && item.hasOwnProperty('sel')){
                    // 参数传入时是已经调用的h函数，也就是说h函数已经被执行，只需要将执行结果收集
                    children.push(item);
                }else{
                    throw new Error(`参数类型不对：${ item }`);
                }   
            });
            return vnode(sel,data,children,undefined,undefined);
        }else if(typeof c == 'object' && c.hasOwnProperty('sel')){
            // h('div',{},h())，说明此时的 c 就是唯一的子元素，不用执行，直接收集
            let children = [c];
            return vnode(sel,data,children,undefined,undefined);
        }else{
            throw new Error('参数类型不对');
        }
    }else{
        throw new Error('必须传入3个参数');
    }
}