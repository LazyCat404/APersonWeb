/**
 * 将传入的参数以对象的形式返回
 * @param { String } sel                        标签
 * @param { Object } data                       属性
 * @param { String,Number,Function } children   子元素
 * @param {*} text                              文本
 * @param {*} elm                               dom 节点
 * @returns 虚拟节点
 */
export default function(sel,data,children,text,elm){
    const key = data.key;
    return{
        sel,
        data,
        children,
        text,
        elm,
        key
    }
}