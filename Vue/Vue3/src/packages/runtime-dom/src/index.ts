/**
 * 该模块涵盖 dom操作、属性操作的api，将这些传入到runtime-core 中
 * runtime-core 在操作中不依赖于平台代码（平台代码是被传入的）
 */
import {createRenderer} from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = Object.assign(nodeOps, { patchProp })

// 将 renderOptions 传入到core 中



export const createApp = (component:any, rootProps:any) => {
    const { createApp } = createRenderer(renderOptions)
    let app = createApp(component,rootProps)
    let { mount } = app;    // 获取core 中得 mount 
    app.mount  = function(container){   // 重写mount
        container = nodeOps.querySelector(container);
        container.innerHTML = '';
        mount(container)     // 将节点处理后传入到mount中
    }
    return app;
}


export * from '@vue/runtime-core'
