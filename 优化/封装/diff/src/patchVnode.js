import createElement from './createElement';

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
            // oldVnode有children；此时oldVnode、newVnode 都有 children 
            let un = 0;     // 所有未处理的节点开头
            newVnode.children.forEach(item => {
                let isExist = false;
                // 便利oldVnode子节点，判断新旧子节点中是否有相同的节点
                oldVnode.children.forEach(ite => {
                    if(ite.sel == item.sel && ite.key == item.key){
                        // 标记当前节点
                        isExist = true;
                    }
                })
                if(!isExist){
                    let dom = createElement(item);
                    dom.elm = dom;
                    if(un < oldVnode.children.length){
                        oldVnode.elm.insertBefore(dom,oldVnode.children[un].elm);
                    }else{
                        oldVnode.elm.appendChild(dom);
                    }
                }else{
                    un++;
                }
            })








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