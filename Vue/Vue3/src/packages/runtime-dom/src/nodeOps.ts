//  节点操作Api：增删改查

export const nodeOps = {
    /**
     * 节点插入（有追加的功能）
     * @param child 子节点
     * @param parent 父节点
     * @param anchor 参照
     */
    insert: (child: Node, parent: Element, anchor: Node | null) => {
        parent.insertBefore(child, anchor || null)
    },
    /**
     * 节点移除
     * @param child 要删除的节点
     */
    remove: (child: Node) => {
        const parent = child.parentNode
        if (parent) {
            parent.removeChild(child)
        }
    },
    /**
     * 创建dom元素
     * @param tag dom 标签名
     * @returns 
     */
    createElement: (tag: keyof HTMLElementTagNameMap) => document.createElement(tag),

    /**
     * 创建文本
     * @param text 文本内容
     * @returns 
     */
    createText: (text: string) => document.createTextNode(text),

    /**
     * 设置（修改）元素文本内容
     * @param el dom 元素
     * @param text 修改的文本内容
     */
    setElementText: (el: Element, text: string) => {
        el.textContent = text
    },

    /**
     * 设置（修改）节点文本
     * @param node 节点
     * @param text 文本内容
     */
    setText: (node: Node, text: string) => {
        node.nodeValue = text
    },
    // 获取父节点
    parentNode: (node: Node) => node.parentNode,
    // 查询子节点
    nextSibling: (node: Node) => node.nextSibling,
    // 节点查找
    querySelector: (selector: string) => document.querySelector(selector),

}