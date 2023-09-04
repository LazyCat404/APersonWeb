import createElement from './createElement';
import updateChildren from './updateChildren';

/**
 * 对比虚拟节点
 * @param { Object } oldVnode 老节点
 * @param { Object } newVnode 新节点
 * @returns 空返回,什么都不做
 */
export default function  patchVnode(oldVnode,newVnode) {
    // 判断新旧vnode是否为同一个对象，是什么都不做
    if(oldVnode === newVnode) return;
    // 判断newVnode没有text属性
    if(newVnode.text != undefined && (newVnode.children == undefined || newVnode.length == 0)){
        // newVnode有text属性
        if(newVnode.text != oldVnode.text){
            // 新旧节点中text不同（相同就什么都不做），直接让新的text 写入旧的elm中，如果旧的elm有children,也会被替换掉
            oldVnode.elm.innerText = newVnode.text; 
        }
    }else{  // newVnode没有text属性
        // 判断oldVnode有没有children
        if(oldVnode.children != undefined && oldVnode.children.length > 0){
            /**
             * 重点：oldVnode有children；此时oldVnode、newVnode 都有 children
             */ 
            updateChildren(oldVnode.elm,oldVnode.children,newVnode.children);
        }else{
            // oldVnode没有children；此时newVnode有children，oldVnode没有children 
            // 将oldVnode文本清空
            oldVnode.elm.innerHTML = '';
            // 便利新节点，创建Dom
            newVnode.children.forEach(item => {
                let dom = createElement(item);
                oldVnode.elm.appendChild(dom);
            });
        }
    }
}