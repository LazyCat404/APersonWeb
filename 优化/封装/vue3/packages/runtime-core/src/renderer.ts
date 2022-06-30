import { ReactiveEffect } from '@vue/reactivity'
import { ShapeFlags } from '@vue/shared'
import { createAppAPI } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'
import { isSameVNodeType, normalizeVNode, Text } from './createVNode'

export function createRenderer(renderOptions: any) {
    const {
        insert: hostInsert,
        remove: hostRemove,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostparentNode,
        nextSibling: hostNextSibling,
    } = renderOptions;

    /**
     * 渲染effect
     * @param initialVNode 虚拟节点
     * @param instance 组件实例
     * @param container 渲染容器
     */
    const setupRenderEffect = (initialVNode: any, instance: any, container: Element) => {

        // 核心：（数据更新）调用render
        const componentUpdateFn = () => {
            let { proxy } = instance; // render 中的参数
            if (!instance.isMounted) {
                // 组件初始化
                // 调用render 方法（渲染页面的时候，会进行取值操作，那么取值的时候会进行依赖手机，收集对应effect，属性变化会重新执行当前方法）
                const subTree = instance.subTree = instance.render.call(proxy, proxy)    // 渲染的时候会调用 h 方法
                patch(null, subTree, container)
                initialVNode.el = subTree.el
                instance.isMounted = true
            } else {
                // 组件更新 ：diff 算法
                const prevTree = instance.subTree;
                const nextTree = instance.render.call(proxy, proxy);

                patch(prevTree,nextTree,container);
            }
        }
        const effect = new ReactiveEffect(componentUpdateFn);
        // 默认调用
        const update = effect.run.bind(effect);
        update();
    }
    /**
     * 初始化节点
     * @param initialVNode 初始节点（vuni节点）
     * @param container 渲染容器
     */
    const mountComponent = (initialVNode: any, container: Element) => {
        // 根据组件的虚拟节点，创造一个真实的节点，渲染到容器中
        // 1. 创建组件实例
        const instance = initialVNode.component = createComponentInstance(initialVNode)
        // 2. 给组件实例赋值
        setupComponent(instance);
        // 3. 调用render 函数，实现渲染，如果依赖的状态发生变化，组件需要重新渲染（响应式原理）
        // effect 可以用在组件中，这样数据变化后可以自动重新执行effect函数
        setupRenderEffect(initialVNode, instance, container);
    }
    const mountChildren = (children: any, container: Element) => {
        for (let i = 0; i < children.length; i++) {
            const child = (children[i] = normalizeVNode(children[i]))
            patch(null, child, container);
        }
    }

    /**
     * 元素挂载（元素初始化）
     * @param vnode 虚拟节点
     * @param container 挂载容器
     */
    const mountElement = (vnode: any, container: Element) => {
        // vnode 中的children 可能是字符串、数组、对象数组、字符串串数组
        let { type, props, shapeFlag, children } = vnode;
        // 创建真实元素
        let el = vnode.el = hostCreateElement(type)
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) { // 文本
            hostSetElementText(el, children)
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 数组
            mountChildren(children, el)
        }
        // 处理属性
        if(props){
            for(const key in props){
                hostPatchProp(el,key,null,props[key])
            }
        }
        hostInsert(el, container)
    }

    const processComponent = (n1: any, n2: any, container: Element) => {
        if (n1 == null) {
            // 组件初始化
            mountComponent(n2, container)
        } else {
            // 组件更新
            // updateComponent(n1, n2)
        }
    }
    
    const patchProps = (oldProps:any,newProps:any,el:Element) => {
        if(oldProps === newProps) return;
        for(let key in newProps){
            const prev = oldProps[key];
            const next = newProps[key];
            if(prev !== next){
                hostPatchProp(el,key,prev,next);
            } 
        }
        for(const key in oldProps){
            // 老的有 新的没有，移除老的
            if(!(key in newProps)){
                hostPatchProp(el,key,oldProps[key],null)
            }
        }
    }

    // 删除子节点
    const unmountChildren = (children:any) => {
        for(let i = 0;i<children.length;i++){
            unmount(children[i])
        }
    }
    /**
     * 用新的子元素（n2）与老的子元素（n1）作比较，更新容器元素
     * @param n1 原来的子元素
     * @param n2 新的子元素
     * @param el 挂载容器
     */
    const patchChildren = (n1: any, n2: any, el: Element) =>{
        const c1 = n1 && n1.children;
        const c2 = n2 && n2.children;
        const prevShapeFlag  = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;
        /**
         * c1、c2 子元素有那些类型
         * 1. 之前是数组，现在是文本：删除老节点，替换上新的文本
         * 2. 之前是数组，现在也是数组：比较两次子节点的差异（* diff 算法核心）
         * 3. 之前是文本，现在是空：直接删除老文本
         * 4. 之前是文本，现在也是文本：直接更新文本
         * 5. 之前是文本，现在是数组：删除文本，替换上新的子节点
         * 6. 之前是空，现在是文本/数组：插入新的文本/数组
         */
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            // 现在是文本
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                // 之前是数组
                unmountChildren(c1);
            }
            if(c1 !== c2){
                // 之前是文本/空
                hostSetElementText(el,c2)
            }
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
            // 现在是数组
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                // 之前也是数组（最复杂、核心、diff算法）
                
            }else{
                // 之前是文本/空
                mountChildren(c2,el)
            }
        }else{
            // 现在是空
            hostSetElementText(el,'')
        }
    }

    const patchElement = (n1: any, n2: any) => {
        // 2. 如果两个元素一致（类型和key相等），则比对俩个元素的属性（patchProps）
        let el = n2.el = n1.el; 
        const oldProps = n1.props || {};
        const newProps = n2.props || {};
       
        patchProps(oldProps,newProps,el); // 比较属性

        // 3. 比较两个元素的子元素：diff 算法，同级比较
        patchChildren(n1,n2,el) 
    }
    const processElement = (n1: any, n2: any, container: Element) => {
        if (n1 == null) {
            // 组件初始化
            mountElement(n2, container)
        } else {
            // 组件更新 diff
            patchElement(n1,n2)  // 更新两个元素之间的差异
        }
    }

    const processText = (n1: any, n2: any, container: Element) => {
        if (n1 == null) {
            // 文本初始化
            let textNode = hostCreateText(n2.children);
            n2.el = textNode;
            hostInsert(textNode, container)
        } else {
            // 文本更新

        }
    }

    const unmount = (vnode:any) => {
        hostRemove(vnode.el)
    }

    const patch = (n1: any, n2: any, container: Element) => {
        if(n1 && !isSameVNodeType(n1,n2)){
            // 1. 先比较两个元素是否一致，不一致（div->span）直接删除（div）替换（span），不需要diff
            unmount(n1);
            n1 = null;
        }

        if (n1 == n2) return;
        const { shapeFlag, type } = n2
        switch (type) {
            case Text:
                processText(n1, n2, container)
                break;
            default:
                if (shapeFlag & ShapeFlags.COMPONENT) {
                    processComponent(n1, n2, container)   // 组件
                } else if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container);// 元素
                }
        }
    }
    /**
     * 将虚拟节点转换成真实的节点渲染到容器中
     * @param vnode 虚拟节点
     * @param container 渲染容器
     */
    const render = (vnode: any, container: Element) => {
        // 包含初次渲染 和 后续更新
        patch(null, vnode, container) // 后续更新：prevNode nextNode container
    };
    return {
        createApp: createAppAPI(render),
        render
    }
}

