import { createVNode } from "./vnode"


export function createAppAPI(render: any) {
    return (rootComponent: any, rootProps: any) => {
        let isMounted = false   // 是否挂载
        const app = {
            mount(container: any) {
                // 1. 创造组件虚拟节点
                let vnode = createVNode(rootComponent, rootProps)
                // 2. 挂载：根据传入的对象，创建一组虚拟节点，在将虚拟节点挂载到容器上
                render(vnode, container)
                if (!isMounted) {
                    isMounted = true
                }
            },
            use() { },
            mixins() { },
            component() { },
            unmount() { },
            // 等等 很多api
        }
        return app;
    }
}