# 来了来了~

## 模板引擎

- 模板引擎：将数据变为视图（优雅）的解决方案

### Mustache

> 最早的模板引擎库（非正则实现）

    - tokens : JS 嵌套数组 -> 模板字符串的 JS 表示
    
![dom模板字符串](../../../Img/Vue/dom模板字符串.png)

转成 tokens 如下 :

![tokens](../../../Img/Vue/tokens.png)

tokens 数组展开:

![tokens展开](../../../Img/Vue/tokens展开.png)

```js
// 正则实现简单的模板引擎
let templateStr = '<div>我叫{{name}}，工作是{{work}}</div>';
let data = {
    name:'LazyCat404',
    work:'前端'
}
// 封装方法,利用正则表达式的 replace()
function render(template,data){
    return template.replace(/\{\{(\w+)\}\}/g,function(findStr,$1){
        // findStr:  匹配到的字符串，{{name}} {{work}}
        // $1: 第一个()捕获的字符串， name work
        return data[$1];
    })
}
// 测试调用
let result = render(templateStr,data);  // 已经得到拼接好的DOM字符串
```
[Mustache 简易封装](../../../优化/封装/Mustache/src/index.js)