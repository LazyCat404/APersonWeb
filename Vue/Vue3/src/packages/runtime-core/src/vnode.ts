import { isObject, isString, ShapeFlags } from "@vue/shared"

/**
 * 创建虚拟节点
 * @param type 虚拟节点的类型
 * @param props 虚拟节点的属性
 * @param children 虚拟节点的子节点
 */
export function createVNode(type: any, props: any, children:any = null) {
    // 是对象，就是一个组件；是字符串，就是一个元素
    const shapeFlag = isObject(type) ?
        ShapeFlags.COMPONENT :
        isString(type) ?
            ShapeFlags.ELEMENT :
            0

    const vnode = {
        __v_isVNode: true,
        type,
        shapeFlag,
        props,
        children,
        key: props && props.key,
        component: null, // 如果组件是虚拟节点需要保存组件的实例
        el: null // 虚拟节点对应的真实节点
    }
    if (children) {
        vnode.shapeFlag |=  isString(children) ? ShapeFlags.TEXT_CHILDREN : ShapeFlags.ARRAY_CHILDREN
        // vnode.shapeFlags = vnode.shapeFlags ||(isString(children) ? ShapeFlags.TEXT_CHILDREN : ShapeFlags.ARRAY_CHILDREN) 
    }
    return vnode
}

export function isVNode(vnode:any){
    return !!vnode.__v_isVNode;
}  
 
export const Text = Symbol('Text');
export const Fragment = Symbol('Fragment');

export function normalizeVNode(vnode:any){
    if(isObject(vnode)){
        return vnode;
    }
    return createVNode(Text,null,String(vnode))
}

// 判断两个虚拟节点是否是同一节点
export function isSameVNodeType(n1:any,n2:any){
    return n1.type === n2.type && n1.key === n2.key;
}

