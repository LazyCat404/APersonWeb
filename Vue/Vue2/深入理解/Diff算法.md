# diff算法(发生在Vdom)：精细化比对，最小量更新(旧Vdom ↔ 新Vdom)

## snabbdom : 虚拟Dom库（vue 借鉴）

> 这里我们通过 snabbdom 理解两个重要的方法：`h()`,`pach()`

### h()

> 用来产生虚拟节点（vnode），或者说虚拟 DOM 都可以

```js
h('a',{props:{href:'http:www.baidu.com'}},'百度');

// 它将得到如下的虚拟节点：
{
    sel:'a',
    data:{
        props:{
            href:'http:www.baidu.com'
        }
    },
    text:'百度'
}

// 它对应的真是DOM如下：
<a href='http:www.baidu.com'>百度</a>

// 虚拟节点属性解释
{
    children:undefined,   // 子节点，undefined 表示没有子元素
    data:{},              // 放置属性、样式
    elm:undefined,        // 对应的真实dom 节点，undefined 表示还没有上树（没有被渲染到dom树上）
    key:undefined,        // 唯一标识
    sel:'div',            // 选择器
    text:'文本',    
}
```

### diff 算法核心 -> patch() 

1. **只有同一个虚拟节点（选择器相同，且key 相同），才进行精细化比较**，否则就暴力删除旧的、插入新的。

2. **只进行同层比较**，否则依旧就暴力删除旧的、插入新的。

![diff算法流程图](../../../Img/vue/diff算法流程图.png)

### diff 算法优化更新策略 - 命中查找

> 命中一个就不再继续

1. 新前 - 旧前

2. 新后 - 旧后

3. 新后 - 旧前  : 新前节点移动到旧后节点之后

4. 新前 - 旧后  : 新前节点移动到旧前之前

PS: 如果都没命中,要通过循环查找,移动到旧前之前