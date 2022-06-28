import { isObject } from "@vue/shared"
import { createVNode, isVNode } from "./createVNode"

/**
 * 
 * @param type dom类型，div、span ……
 * @param propsOrChildren 属性或子节点
 * @param children 子节点
 */
export function h(type:string,propsOrChildren:any,children:any) {
    let l = arguments.length
    // 写法1：h('div',{color:red})
    // 写法2：h('div',h('span'))
    // 写法3：h('div',hello)
    // 写法4：h('div',['hello','word'])
    if(l === 2){
        if(isObject(propsOrChildren) && !Array.isArray(propsOrChildren)){
            if(isVNode(propsOrChildren)){
                return createVNode(type,null,[propsOrChildren]) // h('div',{color:red})
            }
            return createVNode(type,propsOrChildren)    // h('div',h('span'))
        }else{
            return createVNode(type,null,propsOrChildren) // h('div',hello) h('div',['hello','word'])
        }
    }else{
        // 写法1：h('div',{},'孩子')
        // 写法2：h('div',{},['孩子1','孩子2'])
        // 写法3：h('div',{},[h('span'),h('span')])
        if(l>3){
            children =  Array.prototype.slice.call(arguments,2)
        }else if( l === 3 && isVNode(children)){
            children = [children]
        }
        return createVNode(type,propsOrChildren,children)
    }
}