import { ShapeFlags } from '@vue/shared'
import { createAppAPI } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'

export * from '@vue/reactivity'

export function createRenderer(renderOptions: any) {
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

