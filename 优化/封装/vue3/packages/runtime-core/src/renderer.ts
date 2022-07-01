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
    const mountElement = (vnode: any, container: Element, anchor:any) => {
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
        hostInsert(el, container, anchor)
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
    const patchKeyedChildren = (c1: Array<any>, c2:  Array<any>, container: Element) => {
        let e1 = c1.length - 1; // 旧节点结束位置
        let e2 = c2.length - 1; // 新节点结束位置
        let i = 0;  // 当前位置（指针），从头开始
        // 从前往后比
        while(i <= e1 && i<= e2){
            const n1 = c1[i];    // 旧节点当前位置
            const n2 = c2[i];    // 新节点当前位置 
            if(isSameVNodeType(n1,n2)){
                // 如果两个节点是相同节点，则递归比较子节点和自身属性
                patch(n1,n2,container);
            }else{
                break;
            }
            i++;    // 指针向后移动
        }
        // 从后往前比
        while(i <= e1 && i<= e2){
            const n1 = c1[e1];    // 旧节点当前位置
            const n2 = c2[e2 ];    // 新节点当前位置 
            if(isSameVNodeType(n1,n2)){
                // 如果两个节点是相同节点，则递归比较子节点和自身属性
                patch(n1,n2,container);
            }else{
                break;
            }
            e1--;    
            e2--;    
        }
        // 以下是新旧节点不一样多的情况
        if(i > e1){ // 看i 和 e1 之间的关系，如果 i 大于 e1，说明有新增的元素（新的比旧得多）
            if(i <= e2){    // i 和 e2 之间的内容就是新增的
                // e2 的下一个元素，如果下一个个没有，则长度和当前长度相同，说明追加
                const nextPos = e2 + 1; 
                // 如果有，说明在头部插入，则取出下一个节点作为参照物
                const anchor = nextPos < c2.length ? c2[nextPos].el : null; 
                // anchor 为参照节点，以此判断向前插入向后插入
                while(i <= e2){
                    patch(null,c2[i],container,anchor);
                    i++;
                }
            }
        }else if(i > e2){   // 看i和额e2的关系，如果e2 比 i 小，说明：旧的多，新的少
            while(i <= e1){
                unmount(c1[i]);
                i++;
            }
        }
        // 未知序列对比
        const s1 = i; // s1 -> e1 旧的孩子列表（排除首尾可复用后的子列表）
        const s2 = i; // s2 -> e2 新的孩子列表（排除首尾可复用后的子列表）
        // 根据新的节点，创造一个映射表，用老的列表去里边找，有则复用，没有则删除。多余的追加
        const keyToNewIndexMap = new Map(); // 新的孩子列表索引和内容做的映射
        for(let i = s2;i <= e2; i++){
            const child = c2[i];
            keyToNewIndexMap.set(child.key,i)
        }
        const toBepatched = e2 - s2 + 1;    // 新的孩子列表长度
        const newIndexToOldMapIndex =  new Array(toBepatched).fill(0);   // 创建一个已知长度，并且每一项都填充为0的数组
        for(let i = s1;i <= e1; i++){
            const prevChild = c1[i];    // 拿到老的每一个节点
            let newIndex = keyToNewIndexMap.get(prevChild.key);
            if(newIndex == undefined){
                // 在新列表中没有找到对应的旧的节点，则直接将这个节点从旧的中删除
                unmount(prevChild)
            }else {
                newIndexToOldMapIndex[newIndex -s2] = i + 1 ; // +1 保证值不为0
                // 比较节点
                patch(prevChild,c2[newIndex],container);    
            }
        };
        for(let i = toBepatched -1; i >= 0; i--){
            let lastIndex = s2 + i;
            let lastChild = c2[lastIndex];
            let anchor = lastIndex + 1 < c2.length ? c2[lastIndex + 1].el : null
            if(newIndexToOldMapIndex[i] === 0){ // 数组项为0，说明在旧得中没有找到对应项，这是一个新增的节点，需要创建真实节点后在插入
                patch(null,lastChild,container,anchor); 
            }else{
                // 这里可以进行优化
                hostInsert(lastChild.el,container,anchor); // 倒序插入
            }
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
                patchKeyedChildren(c1,c2,el);
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
    const processElement = (n1: any, n2: any, container: Element,anchor?:any) => {
        if (n1 == null) {
            // 元素初始化
            mountElement(n2, container, anchor)
        } else {
            // 更新 diff
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

    const patch = (n1: any, n2: any, container: Element, anchor = null) => {
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
                    processElement(n1, n2, container, anchor);// 元素
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

