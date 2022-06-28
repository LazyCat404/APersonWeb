import { ReactiveEffect } from '@vue/reactivity'
import { ShapeFlags } from '@vue/shared'
import { createAppAPI } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'

export { h } from './h'
export * from '@vue/reactivity'

export function createRenderer(renderOptions: any) {
    /**
     * 渲染effect
     * @param initialVNode 虚拟节点
     * @param instance 组件实例
     * @param container 渲染容器
     */
    const setupRenderEffect = (initialVNode:any,instance:any,container:Element) => {

        // 核心：（数据更新）调用render
        const componentUpdateFn = () => {
            let {proxy} = instance; // render 中的参数
            if(!instance.isMounted){
                // 组件初始化
                // 调用render 方法（渲染页面的时候，会进行取值操作，那么取值的时候会进行依赖手机，收集对应effect，属性变化会重新执行当前方法）
                const subTree = instance.subTree = instance.render.call(proxy,proxy)    // 渲染的时候会调用 h 方法
                
                instance.isMounted = true
            }else{  
                // 组件更新 

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
    const mountComponent = (initialVNode:any,container:Element,)=> {
        // 根据组件的虚拟节点，创造一个真实的节点，渲染到容器中
        // 1. 创建组件实例
        const instance = initialVNode.component  = createComponentInstance(initialVNode)
        // 2. 给组件实例赋值
        setupComponent(instance); 
        // 3. 调用render 函数，实现渲染，如果依赖的状态发生变化，组件需要重新渲染（响应式原理）
        // effect 可以用在组件中，这样数据变化后可以自动重新执行effect函数
        setupRenderEffect(initialVNode,instance,container);
    }

    const processComponent = (n1:any,n2:any,container:Element) => {
        if(n1 == null){
            // 组件初始化
            mountComponent(n2,container)
        }else{
            // 组件更新
            // updateComponent(n1, n2)
        }

    }
    const patch = (n1:any,n2:any,container:Element)=>{
        if(n1 == n2) return;
        const {shapeFlag} = n2
        if(shapeFlag & ShapeFlags.COMPONENT){
            processComponent(n1,n2,container)
        }
    }
    /**
     * 将虚拟节点转换成真实的节点渲染到容器中
     * @param vnode 虚拟节点
     * @param container 渲染容器
     */
    const render = (vnode:any, container:Element) =>{
        // 包含初次渲染 和 后续更新
        patch(null,vnode,container) // 后续更新：prevNode nextNode container
    };
    return {
        createApp: createAppAPI(render),
        render
    }
}

