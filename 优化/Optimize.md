# JS通用优化

### 在顶部声明

把所有声明放在每段脚本或函数的顶部

### 初始化变量

声明变量时对其进行初始化是个好习惯

### 请勿使用 new Object()

- 请使用 `{}` 来代替 `new Object()`

- 请使用 `""` 来代替 `new String()`

- 请使用 `0` 来代替 `new Number()`

- 请使用 `false` 来代替 `new Boolean()`

- 请使用 `[]` 来代替 `new Array()`

- 请使用 `/()/` 来代替 `new RegExp()`

- 请使用 `function (){}`来代替 `new Function()`

### 设置默认值

调用函数时缺少一个参数，那么这个缺失参数的值会被设置为 `undefined`，`undefined` 值会破坏代码，所以尽量为参数设置默认值

### 减少循环中的活动

能够放在循环之外的语句或赋值会使循环运行得更快

```
// 差
var i;
for (i = 0; i < arr.length; i++) {}
//更好
var i;
var l = arr.length;
for (i = 0; i < l; i++) {}

```
### 减少 DOM 访问

若频繁访问某 DOM 元素，将它作为本地变量来使用，会更好

```
var obj;
obj = document.getElementById("demo");
obj.innerHTML = "Hello"; 
```
### 缩减 DOM 规模

尽量保持 HTML DOM 中较少的元素数量

### 延迟 JavaScript 加载

> HTTP 规范定义浏览器不应该并行下载超过两种要素,脚本在下载时，浏览器不会启动任何其他的下载。此外所有解析和渲染活动都可能会被阻塞。

把脚本放在页面底部，使浏览器首先加载页面

### 用 default 来结束 switch

### 使用 === 比较

### 避免使用 with

### 避免使用 eval()

`eval()` 是**魔鬼**，几乎所有情况下，都没有必要使用它。

