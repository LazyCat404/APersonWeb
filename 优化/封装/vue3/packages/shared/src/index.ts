export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isFunction = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'function'
export const isString = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'string'

export const enum ShapeFlags {
    ELEMENT = 1,    // 元素
    FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
    STATEFUL_COMPONENT = 1 << 2,    // 普通组件
    TEXT_CHILDREN = 1 << 3, // 孩子是文本
    ARRAY_CHILDREN = 1 << 4,   // 孩子是数组
    SLOTS_CHILDREN = 1 << 5,    // 组件插槽
    TELEPORT = 1 << 6,  // teleport 组件
    SUSPENSE = 1 << 7,  // suspernse 组件
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}