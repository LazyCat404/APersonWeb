/**
 * 属性操作Api：对比属性前后变化的差异，做diff 算法
 * @param el dom元素
 * @param key 要修改的属性
 * @param prevValue 修改前的属性值
 * @param nextValue 修改后的属性值
 */
export const patchProp = (
    el: Element,
    key: string,
    prevValue: any,
    nextValue: any
) => {
    if (key === 'class') {    // 类名
        patchClass(el, nextValue)
    } else if (key === 'style') { // 样式
        patchStyle(el, prevValue, nextValue)
    } else if (/^on[^a-z]/.test(key)) {    // 事件
        patchEvent(el, key, nextValue)
    } else {  // 其他属性
        patchAttr(el,key,nextValue)
    }
}

function patchClass(el: Element, value: string) {
    if (value == null) {
        el.removeAttribute('class')
    } else {
        el.className = value
    }
}

function patchStyle(el: Element, prev: any, next: any) {
    const style:any = (el as HTMLElement).style;
    // 新样式全部添加到dom上
    for (let key in next) {
        style[key as any] = next[key as any];
    }
    // 新的没有，但是老的有，将老的移除
    if(prev){
        for(let key in prev){
            if(next[key] == null){
                style[key as any] = null
            }
        }
    }
}

function  patchEvent(el:any, key:string, nextValue:any){
    const invokers = el._vei || (el._vei = {});

    let existingInvoker = invokers[key];
    if(existingInvoker && nextValue){   // 换绑
        existingInvoker.value = nextValue
    }else{
        const name = key.slice(2).toLocaleLowerCase();
        if(nextValue){
            const invoker = invokers[key] = createInvoker(nextValue)    // 返回一个引用
            el.addEventListener(name,invoker)
        }else if(existingInvoker){
            el.removeEventListener(name,existingInvoker)
            invokers[key] = undefined
        }
    }
}

function createInvoker(value:any){
    const invoker = (e:any) =>{
        invoker.value(e)
    } 
    invoker.value = value   // 存储这个变量，后续想换绑，可以直接更新value值
    return invoker
}

function patchAttr(el: Element,key: string, value: any,){
    if(value === null){
        el.removeAttribute(key)
    }else{
        el.setAttribute(key,value)
    }
}