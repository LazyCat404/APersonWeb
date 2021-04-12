/**
 * 将vNode节点创建为真实Dom（注意，并不插入到dom树上）
 * @param {*} vnode 
 * @returns dom 对象
 */
export default function createElement (vnode){
    // 根据传入的vnode创建一个dom节点(这里只能创建标签选择器)
    let domNode = document.createElement(vnode.sel);
    // 简化版，文本 和 子节点不共存
    if(vnode.text != '' && (vnode.children == undefined || vnode.children.length == 0)){
        // 文本，直接添加
        domNode.innerText = vnode.text;
    }else if(Array.isArray(vnode.children) && vnode.children.length > 0){
        // 数组，有子节点，需要递归创建子节点
        vnode.children.forEach(item => {
            // 递归创建dom节点
            let chDom = createElement(item);
            // 利用appendChild将新创建的节点添加进已经创建的节点内
            domNode.appendChild(chDom);
        })
    } 
    // 手动添加elm属性（必须写这句）   
    vnode.elm = domNode;   
    return domNode;
}