import { ReactiveEffect } from '@vue/reactivity'
import { ShapeFlags } from '@vue/shared'
import { createAppAPI } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'
import { normalizeVNode, Text } from './createVNode'

export { h } from './h'
export * from '@vue/reactivity'

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
                // 组件更新 
               console.log('组件更新')
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
            mountChildren(children, container)
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
    const processElement = (n1: any, n2: any, container: Element) => {
        if (n1 == null) {
            // 组件初始化
            mountElement(n2, container)
        } else {
            // 组件更新
            // diff
        }
    }

    const processText = (n1: any, n2: any, container: Element) => {
        if (n1 == null) {
            // 文本初始化
            let textNode = hostCreateText(n2.children);
            hostInsert(textNode, container)
        } else {
            // 文本更新

        }
    }



    const patch = (n1: any, n2: any, container: Element) => {
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

