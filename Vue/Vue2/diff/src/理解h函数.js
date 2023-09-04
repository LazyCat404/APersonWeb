/**
 * 此文件用于学习和理解，想要查看执行结果，将文件名改为index.js即可
 * 通过调用 snabbdom 的相关方法，进一步了解h()以及patch() 
 * 1. Vdom 如何被渲染函数（h()）产生？
 * 2. diff 原理
 * 3. Vdom 如何通过
 */

import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

// 利用 h 函数创建虚拟节点
var myVnode = h('a',{
props:{
    href:'http://www.baidu.com',
    target:'_blank'
}
},'百度');
console.log('h 函数创建出来的虚拟Dom:',myVnode);

var myVnode1 = h('ul',[
  h('li','苹果'),
  h('li','香蕉'),
  h('li','大鸭梨')
])


// 初始化 patch 函数（diff 算法核心）
const patch = init([classModule,propsModule,styleModule,eventListenersModule]);

// 让虚拟Dom 上树（将虚拟Dom 渲染到真实Dom 树上）
const container = document.getElementById('container'); // 先获取真是 Dom 节点

// 利用patch 渲染dom 节点，注意以下方法同时执行，只会渲染第一个dom节点 
patch(container,myVnode);
patch(container,myVnode1);