import vnode from './vnode';
import createElement from './createElement';
import patchVnode from './patchVnode';
/**
 * 将虚拟节点渲染到真实 Dom 树上
 * @param { Object } oldVnode   旧节点、真实dom节点（初次上树）
 * @param { Object } newVnode          新节点
 */
export default function patch(oldVnode,newVnode) {
    // 判断传入的第一个参数，是Dom节点，还是vDom节点
    if(!oldVnode.sel){  
        // oldVnode拥有sel，说明传入的是一个vDom节点 
        // oldVnode没有sel，说明传入的是一个Dom节点，此时需要将它包装成为一个vDom节点
        // sel：自己的标签名（转小写）,data：空,children：空,text：undefined,elm：自己
        oldVnode = vnode(oldVnode.tagName.toLowerCase(),{},[],undefined,oldVnode);
    }
    // 判断 oldVnode 和 newVnode 是否为同一个节点
    if(oldVnode.sel == newVnode.sel && oldVnode.key == newVnode.key){
        patchVnode(oldVnode,newVnode);
    }else{
        // 不是同一节点，暴力删除旧的，插入新的
        let newVnodeElm = createElement(newVnode);
        // 在老节点的前插入新的dom节点
        if(oldVnode.elm.parentNode && newVnodeElm){
            oldVnode.elm.parentNode.insertBefore(newVnodeElm,oldVnode.elm);
        }
    }
}