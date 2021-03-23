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

```js
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

```js
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

### 防抖节流（闭包应用）

> 用户行频繁的触发事件执行，对于DOM操作，资源加载等都是十分耗费性能，很可能导致**页面卡顿**甚至是**浏览器崩溃**

#### 防抖

* 原理：在事件被触发 N 秒后在执行回调，如果在这 N 秒内又被出发，则重新计时

* 使用场景：搜索联想、拖拽（resize）……

```js
function test(){
    var timer = null;//声明定时器 
    clearTimeout(timer);//清除定时器
    timer = setTimeout(function (){
        //函数体
    },1000);    //延迟执行
}
```
> 主要思想：利用定时器，使函数延迟执行（在[Currency.js](../优化/封装/Currency.js)内有封装方法）

#### 节流

* 原理： N 秒内只运行一次，若在 N 秒内重复触发，只有一次执行一次

* 使用场景：连续点击（持续提交）

```js
function test(){
    //函数体
}
oBtn.onclick = test;
//我们想点击一次执行一次，但如果我们利用控制台：
for(var i = 0;i<1000;i++){oBtn.click()} 
//这样一来就可以迅速执行1000次，远远超过点击速度（所以要节流）
```
> 主要思想：计算 **此次执行时间** - **上次执行时间** >= **等待时间** ，（在[Currency.js](../优化/封装/Currency.js)内有封装方法）

#### 函数柯里化

> 把接受多个参数的函数，转变为接受一个参数的函数，并且返回接受余下参数且返回结果的新函数。

```js
    // 简单粗暴版(参数长度固定)
    function add(a){
        return function(b){
            return function(c){
                return a + b + c;
            }
        }
    }
    // 调用
    add(1)(2)(3);   // 6
```

