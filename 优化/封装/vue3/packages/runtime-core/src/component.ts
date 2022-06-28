import { reactive } from "@vue/reactivity";
import { hasOwn, isFunction, isObject } from "@vue/shared";

/**
 * 创建组件实例
 * @param vnode 虚拟节点
 * @returns 组件实例
 */
export function createComponentInstance(vnode: any) {
    const type = vnode.type // 用户自己传入的属性
    const instance = {
        vnode,  // 实例对应的虚拟节点
        type,   // 组件对象
        subTree: null, // 组件渲染的内容（括号内为vue2中的属性），vue3中组件的vnode叫：vnode（$vnode），组件渲染的结果叫：subTree（_vnode）；
        ctx: {},    // 组件上下文
        props: {},  // 组件属性
        attrs: {},  // 除了props中的属性
        slots: {},   // 组件插槽
        propsOptions: type.props,    // 属性选项
        proxy: null,// 实例的地理对象
        render: null,// 组件的渲染函数
        emit: null, // 事件触发
        exposed: null,  // 暴漏的方法
        isMounted: false,// 是否挂载完成
    }
    instance.ctx = { _: instance }
    return instance;
}

export function initProps(instance: any, rawProps?: any) {
    const props: any = {};
    const attrs: any = {};
    const options = Object.keys(instance.propsOptions);
    if (rawProps) {
        for (let key in rawProps) {
            const value = rawProps[key]
            if (options.includes(key)) {
                props[key] = value
            } else {
                attrs[key] = value
            }
        }
    }
    instance.props = reactive(props)
    instance.attrs = attrs
}

export function createSetupContext(instance: any) {

    return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: instance.emit,
        expose: (exposed: any) => instance.expected = exposed || {}

    }
}
const PublicInstanceProxyHandlers = {
    get({ _: instance }: any, key: string){
        const { setupState, props } = instance
        if(hasOwn(setupState,key)){
            return setupState[key];
        }else if(hasOwn(props,key)){
            return props[key];
        }else{
            // ……
        }
    },
    set({ _: instance }: any, key: string,value:any){
        const { setupState, props } = instance
        if(hasOwn(setupState,key)){
           setupState[key] = value
        }else if(hasOwn(props,key)){
            console.warn('属性是只读的！')
            return false;
        }else{
            // ……
        }
        return true
    }
}

export function setupStatefulComponent(instance: any) {
    // 调用组件的setup 函数
    const Component = instance.type;
    const { setup } = Component;  // 组件中setup 方法
    instance.proxy = new Proxy(instance.ctx,PublicInstanceProxyHandlers) // 代理的上下文
    if (setup) {
        const setupContext = createSetupContext(instance);
        let setupResult =  setup(instance.props,setupContext);  // 获取setup 返回值
        if(isFunction(setupResult)){    // 如果setup 返回一个函数，即为render函数
            instance.render = setupResult
        }else if(isObject(setupResult)){
            instance.setupState = setupResult
        }
    }
    if(!instance.render){
        instance.render = Component.render; // 如果setup 没写render，则直接采用组件本身的render
        // 如果组件本身也没写render，而是写的 template 则需要做模板编译（暂略） 
    }
}

/**
 * 组件实例启动（给组件实例赋值）
 * @param instance 组件实例
 */
export function setupComponent(instance: any) {
    const { props, children } = instance.vnode
    // 初始化组件的 props、attrs
    initProps(instance, props);
    // 插槽初始化（略）
    setupStatefulComponent(instance);   // 调用setup 函数，拿到返回之
}