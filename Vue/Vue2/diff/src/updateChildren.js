import patchVnode from './patchVnode';
import createElement from './createElement';
/**
 * diff 算法精细化比较,四个指针思想
 * @param { Object } parentElm 父节点
 * @param { Array } oldCh 老节点的子元素
 * @param { Array } newCh 新节点的子元素
 */
export default function updateChildren(parentElm,oldCh,newCh){
    /**
     * 指针
     */ 
    // 新前
    let newStartIdx = 0;
    // 旧前
    let oldStartIdx = 0;
    // 新后
    let newEndIdx = newCh.length - 1;
    // 旧后
    let oldEndIdx = oldCh.length - 1;

    // key 缓存
    let keyMap = null;

    /**
     * 节点
     */
    // 新前节点
    let newStartVnode = newCh[0];
    // 旧前节点
    let oldStartVnode = oldCh[0];
    // 新后节点
    let newEndVnode = newCh[newEndIdx];
    // 旧后节点
    let oldEndVnode = oldCh[oldEndIdx];

    // (旧节点)开始循环 
    while(newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx){
        // 首先要略过已经加了undefined标记的项
        if(oldStartVnode == null || oldCh[oldStartIdx] == undefined){
            oldStartVnode = oldCh[++oldStartIdx];
        }else if(oldEndVnode == null || oldCh[oldEndIdx] == undefined){
            oldEndVnode = oldCh[--oldEndIdx];
        }else if(newStartVnode == null || newCh[newStartIdx] == undefined){
            newStartVnode = newCh[++newStartIdx];
        }else if(newEndVnode == null || newCh[newEndIdx] == undefined){
            newEndVnode = newCh[--newEndIdx];
        }else if(checkSameVnode(oldStartVnode,newStartVnode)){
            console.log('新前 - 旧前 命中');
            patchVnode(oldStartVnode,newStartVnode);
            // 前指针后移
            newStartVnode = newCh[++newStartIdx];
            oldStartVnode = oldCh[++oldStartIdx];
        }else if(checkSameVnode(oldEndVnode,newEndVnode)){
            console.log('新后 - 旧后 命中');
            patchVnode(oldEndVnode,newEndVnode);
            // 后指针前移
            newEndVnode = newCh[--newEndIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        }else if(checkSameVnode(oldStartVnode,newEndVnode)){
            console.log('新后 - 旧前 命中');
            patchVnode(oldStartVnode,newEndVnode);
            // 移动新前指向节点,到老节点旧后的后面
            parentElm.insertBefore(oldStartVnode.elm,oldEndVnode.elm.nextSibling);
            // 指针移动,新后前移,旧前后移
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }else if(checkSameVnode(oldEndVnode,newStartVnode)){
            console.log('新前 - 旧后 命中');
            patchVnode(oldEndVnode,newStartVnode);
            // 移动新前指向节点,到老节点旧前的前面
            parentElm.insertBefore(oldStartVnode.elm,oldStartVnode.elm);
            // 指针移动,新前后移,旧后前移
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }else {
            console.log('都没有命中');
            // 寻找key,形成一个map 缓存 
            if(!keyMap){
                keyMap = {};
                for(let i = oldStartIdx;i <= oldEndIdx;i++){
                    const key = oldCh[i].key;
                    if(key != undefined){
                        keyMap[key] = i;
                    }
                }
            }
            // 寻找当前这项(newStartIdx)在keyMap中的映射位置序号
            const idxInOld = keyMap[newStartVnode.key];
            if(idxInOld == undefined){
                // 全新的项,只需要插入即可
                parentElm.insertBefore(createElement(newStartVnode),oldStartVnode.elm)
            }else{
                // 不是全新的项,需要移动
                const elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove,newStartVnode);
                // 把这项设为undfined,表示已经处理完该项
                oldCh[idxInOld] = undefined;
                // 移动,调用inserBefore 实现移动
                parentElm.insertBefore(elmToMove.elm,oldStartVnode.elm)
            }
            // 指针下移,只移动新的头
            newStartIdx = newCh[++newStartIdx];
        }
    };
    // 循环结束
    if(newStartIdx <= newEndIdx){
        // 新节点未全部循环,说明还有剩余节点,需要插入剩余新节点
        // console.log('还有剩余节点待插入');
        // 插入的标杆
        const before = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1] : null;
        for(let i = newStartIdx; i <= newEndIdx;i++){
            parentElm.insertBefore(createElement(newCh[i]),oldCh[oldStartIdx].elm)
        }
    }else if(oldStartIdx <= oldEndIdx){
        // 此时说明新节点少于老节点,应批量删除 oldStart - oldEnd 之间的节点
        // console.log('还有剩余节点待删除');
        for(let i = oldStartIdx;i <= oldEndIdx;i++){
            if(oldCh[i]){
                parentElm.removeChild(oldCh[i].elm)
            }
        }
    }
}

/**
 * 判断两个节点是否是同一个节点
 * @param { Object } a 节点对象
 * @param { Object } b 节点对象
 * @returns 是否相同
 */
function  checkSameVnode(a,b) {
    return a.sel == b.sel && a.key == b.key
}