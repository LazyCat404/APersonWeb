# 你以为结束了？天真！

### module（模块）

> ES6模块自动采用严格模式（严格模式相关可查看[常识](./常识.md)），其中，`this`的限制使得ES6模块中，顶层的`this`指向`undefined`，即不应该在顶层代码使用`this`

#### export（输出/出口）

> `export`命令用于规定模块的对外接口

**1. 利用 `export` 对外输出变量**

```js
//方式一：
export var name = 'xiaoMing';
export var age = '18';

//方式二（推荐）：
var name = 'xiaoMing';
var age = '18';
export {name,age};  //这样可以写在后边，清晰明了
```
**2. 利用 `export` 对外输出函数/类**

```js
//方式一：
export function test(){
    //……
}

//方式二（推荐）：
function test1() { 
    //... 
}
function test2() { 
    //... 
}
export {
    tes1,
    test2 as demo2, //as 关键字用来重命名
    test2 as testDemo2  //可以进行多次重命名
};
```
> `export`命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系

```js
// 报错
export 1;

// 报错
var m = 1;
export m;
//正确写法参考上边
```
> `export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值

```js
export var foo = 'var'; // 输出变量foo，值为 bar
setTimeout(()=>foo = 'baz',500) //500毫秒后变成 baz
```
> `export`/`import`命令可以出现在在模块的任何位置，只要处于模块的顶层就可以，如果处于块级作用域内（没法做静态优化，违背ES6模块设计初衷），会报错

```js
function foo() {
  export default 'bar' // Uncaught SyntaxError: Unexpected token 'export'
}
```

#### import（引入/入口）

> 通过`import`命令加载`export`定义的接口模块（不同js文件），有提升效果，会提升到整个模块最前边，如下：

```js
function sayName(){
    console.log(name);  //输出从另一个模块中引入的 name 变量
}
import {name,age} from './……';  //{} 里边的变量名，必须与被导入模块对外接口名相同
// 或者
import {name as myName,age} from './……';    // as 为变量重新命名，from 后边可以是相对路径，也可是绝对路径
```
**1. `import` 命令输入的变量都是只读的，即不允许在加载模块的脚本里面，改写接口**

```js
import {a} from './xxx.js'
a = {}; // 报错，因为 a 是只读的，不能为它重新赋值

//如果上述 a 是一个对象，改写其属性是允许的
a.name = 'xiaoHong' //正确执行
```
> 如上述，成功改写 a 的属性，并且在其它模块也可以读到改写后的值，但是这种写法很难**查错**，因此，建议但凡输入的变量，都做只读

**2. import语句会执行所加载的模块**

```js
import 'lodash';    // 仅仅执行 lodash 模块，但不输入任何值
```
**3. 模块整体加载**

> 模块整体加载，不允许运行时改变

```js
import * as test from './……';   //整体加载

console.log(test.name)  //正确打印 

//下边这种形式不被允许
test.heigt = '180cm'    
```

#### export default 命令

> 使用`import`命令的时候，用户需要知道所要加载的变量名/函数名，否则无法加载，为了解决这个问题就用到了`export default`命令，为模块指定默认输出（绝大多数第三方模块都是使用该命令）。

```js
// default-test.js
export default function () {    //默认输出函数，import命令可以为该匿名函数指定任意名字
    console.log('我用来测试 default');
}

// main.js
import aaa from './default-test.js';    //任意起名字，但注意这里对应的 import 命令后不能再有 {}
```
**1. 一个模块只能有一个`export default`（默认输出），即使它声明方法有名字，也会被`import`命令指定的名字覆盖**

```js
//test.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等于
export default add;

//main.js
import { default as foo } from 'modules';
// 等于
import foo from 'modules';

```
**2. 默认输入和其它接口**

```js   
import aaa, { name, age } from './……';  //aaa 是默认输出（暴漏），{}里是分别输出、统一输出
```
**3. class类 也可以输出**

```js
// MyClass.js
export default class { ... }

// main.js
import MyClass from 'MyClass';
let o = new MyClass();
```

#### import()

> 阅读完上边，我们可以知道`import`被js引擎静态分析（编译时加载），因此它并**不能实现**按需加载

```js
//报错
if (x) {    //if 语句在运行时才执行
    import * from './……';   //在编译时就执行
}
```
> `ConmmonJS` 的`require`方法是运行时加载

```js
const path = './' + fileName;
const myModual = require(path); //运行时加载，到底加载哪一个模块，只有运行时才知道（import 做不到）
```
**通过以上对比，`import()`函数，完成动态加载，应运而生，它和`import`类似，只不过一个是动态，一个是静态**

```js
import(path);   //path -> 模块位置变量
```
**`import()`加载模块成功以后，这个模块会作为一个对象，当作`then`方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口**

```js
import('./myModule.js')
.then(({export1, export2}) => {
    // ...
});
```

#### 模块化使用 

> 因为现在浏览器还没有完全支持`import`,在无服务器支持的情况下，不同浏览器可能会出现不同的报错，因此需要引入第三方工具使得浏览器识别 ES6 语法 —— [bable](https://www.babeljs.cn/)

```js
npm install babel-cli -g
// 继续安装
npm install babel-preset-es2015
```
PS：事实上，babel 将ES6的模块化语法，依旧转成了ConmmonJS，所以如果这样使用，还要使用浏览器认识ConmmoJS

```js
// 安装后执行命令（编译）
babel src -d dist   
// 至此浏览器依旧报错，因还需要将生成的文件在进行编译，即 ConmmonJS
```
PS：关于ConmmonJS 的使用，请移步[Node 模块化](../Node/常识.md)

### Promise （承诺、保证、答应）

> `Promise` 是异步编程的一种解决方案，比传统的解决方案（回调函数和事件）更合理，更强大

#### 特点

> `Promise`可以理解为一个容器（或状态集），里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，`Promise` 是一个对象，通过它可以获取异步操作的消息

**1. `Promise`对象的状态不受外界影响**

`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`resolved`（已成功）和`rejected`（已失败）；只有异步操作的结果才能决定`Promise`到底处于那种状态

**2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果**

`Promise`对象的状态改变，只有两种可能：

- `pending` => `resolved`

- `pending` => `rejected`

**PS：只要这两种情况发生，状态就不会在发生改变（会一直保持这个结果），继续回调会立刻得到这个结果**

**3. Promise 缺点**

- 无法取消`Promise`，一旦新建它就会立即执行，无法中途取消

- 如果**不设置**回调函数，`Promise`内部抛出的错误，不会反应到外部

- 当处于`pending`状态时，无法得知目前进展到哪一个阶段

> 如果某些事件**不断地反复**发生，一般来说，使用 [Stream](https://nodejs.org/api/stream.html) 模式是比部署`Promise`更好的选择。

#### 基本用法

> ES6 规定`Promise`对象是一个构造函数，用来生成`Promise`实列

1. `Promise `构造函数接收函数（`resovle`、`reject`）作为参数，这两个参数由JS引擎提供，自己不能部署

```js
const pro = new Promise(function(resolve, reject) {
    // ... 
    if (/* 异步操作成功 */){
        resolve(value);
    } else {
        reject(error);
    }
});
```
2. `Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数

> `then` 方法可以接受**两个回调函数**作为参数，这两个函数都接受`Promise`对象传出的值作为参数

```js
pro.then(function(value) {
    // PRimise 变为 resolved 时调用
}, function(error) {    //可选参数
    // PRimise 变为 rejected 时调用
});
```
3. `Promise`新建后会立即执行

```js
let pro = new Promise(function(resolve,reject){
    console.log('我会第一个输出');    // Promise 新建后立即执行，所以最先输出
    resolve();
});
pro.then(function(){
    console.log('我是最后输出');   // then 方法指定回调函数，在（当前脚本）所有同步任务执行完后才会执行，所以最后输出
});
console.log('我会第二个输出'); // 同步任务，执行完后才执行then方法回调函数
```
#### Promise.prototype.then() 

> 为 `Promise` 实例添加**状态改变时**的回调函数，第一个参数是`resolved`状态的回调函数，第二个参数（可选）是`rejected`状态的回调函数；返回一个**新的**`Promise`实列，因此可以采用链式写法调用

```js
getJSON("/post/1.json").then(function(post) {
    return getJSON(post.commentURL);
}).then(function (comments) {   //链式调用，将上一个then方法的返回结果作为参数，传入
    console.log("resolved: ", comments);    //第一个then方法返回resolved调用
}, function (err){
    console.log("rejected: ", err); //第一个then方法返回rejected调用
});

// 箭头函数写法
getJSON("/post/1.json").then(
    post => getJSON(post.commentURL)
).then(
    comments => console.log("resolved: ", comments),
    err => console.log("rejected: ", err)
);
```
#### Promise.prototype.catch()

> 该方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定**发生错误**时的回调函数

```js
getJSON('/posts.json').then(function(posts) {
    // ...
}).catch(function(error) {
    // 处理 getJSON 和 前一个回调函数运行时发生的错误
    console.log('发生错误！', error);
});
```
> `Promise`对象的错误具有**冒泡**性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获

```js
// 方式一：
promise.then(function(data) {
    // success
}, function(err) {
    // error
});

/*
    方式二（建议）：
    该写法可以捕获前面then方法执行中的错误，更接近同步的写法（try/catch）
    建议使用catch方法，而不使用then方法的第二个参数。
*/
promise.then(function(data) { //cb
    // success
}).catch(function(err) {
    // error
});
```
#### Promise.prototype.finally()

> 该方法用于指定不管`Promise`对象最后状态如何，都会执行的操作

```js
promise.then(result => {
    //成功
}).catch(error => {
    //失败
}).finally(() => {
    //必执行
});
```
#### Promise.all()

> 该方法用于将多个`Promise`实例，包装成一个新的`Promise`实例，参数必须有`Iterator`接口，返回`Promise`实例

> 可以理解为：只有所有参数的状态都为`resolved`（成功）状态，返回的`Promise`才为`resolved`状态

```js
const p = Promise.all([p1, p2, p3]); //p1、p2、p3都是 Promise 实例，如果不是也会调用Promise.resolve方法后在处理
/*
    p的状态由p1、p2、p3决定:
    1. p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时，p1、p2、p3的返回值组成一个数组，传递给p的回调函数
    2. p1、p2、p3中有一个被rejected，p的状态就变成rejected，此时，第一个被reject的实例的返回值，会传递给p的回调函数
*/
```
#### Promise.race()

> 该方法也是将多个`Promise`实例，包装成一个新的`Promise`实例（参考`Promise.all()`）

> 可以理解为：**只要有一个**参数的状态为`resolved`（成功）状态，返回的`Promise`就为`resolved`状态

```js
var P1 = new Promise((resolved,rejected) =>{
    setTimeout(function(){
        resolved('P1');
    },Math.random()*5000)
})
var P2 = new Promise((resolved,rejected) =>{
    setTimeout(function(){
        resolved('P2');
    },Math.random()*5000)
})
var P3 = new Promise((resolved,rejected) =>{
    setTimeout(function(){
        resolved('P3');
    },Math.random()*5000)
})
Promise.race([P1,P2,P3]).then(data => console.log(data),err => console.log(err))    //谁先达到resolved,就用谁的
```
#### Promise.allSettled()

> 该方法接受一组`Promise`实例作为参数，包装成一个新的`Promise`实例。只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束

### Generator 函数（生成器）

> 是ES6标准引入的**新的数据类型**。一个generator看上去像一个函数，但可以**返回多次**

#### generator由function*定义（注意多出的 * 号，普通函数没有），并且除了return语句，还可以用yield(关键字)返回多次

```js
function* test(x) {
    yield x + 1;
    yield x + 2;
    return x + 3;
}
```
以上就是一个简单的`generator`，按照普通函数的调用方法，我们可能会想到`test(1)`来执行函数，结果如下：

![test(1)结果截图](../Img/JS/generator1.jpg)

#### generator调用：

> 通过上边的截图我们可以看出按照普通函数的调用方式`test(1)`，仅仅是创建了一个`generator`对象，还没有去执行它

**方法一：不断地调用`generator`对象的`next()`方法**

> `next()`方法会执行`generator`的代码，然后，每次遇到`yield`；就返回一个对象`{value: x, done: true/false}`，然后“暂停”。返回的`value`就是`yield`的返回值，`done`表示这个`generator`是否已经执行结束了。如果`done`为`true`，则`value`就是`return`的返回值。当执行到`done`为`true`时，这个`generator`对象就已经全部执行完毕，不要再继续调用`next()`了

由此，我们使用`test(1).next()`执行（这里只调用了一次），结果如下：

![test(1)结果截图](../Img/JS/generator2.jpg)

**方法二：直接用`for ... of`循环迭代`generator`对象**

> 这种方式不需要我们自己判断`done`

```js
for (var x of test(1)) {
    console.log(x); //2 3   (并没有返回 return 的返回值)
}
```
#### generator作用 ：

- `generator`可以在执行过程中**多次返回**，所以它看上去就像一个可以**记住执行状态**的函数，利用这一点，写一个`generator`就可以实现需要用面向对象才能实现的功能

- `generator`可以把**异步回调**代码变成**同步**代码

```js
// 不使用generator
ajax('http://url-1', data1, function (err, result) {
    if (err) {
        return handle(err);
    }
    ajax('http://url-2', data2, function (err, result) {
        if (err) {
            return handle(err);
        }
        ajax('http://url-3', data3, function (err, result) {
            if (err) {
                return handle(err);
            }
            return success(result);
        });
    });
});
// 使用generator
try {
    r1 = yield ajax('http://url-1', data1);
    r2 = yield ajax('http://url-2', data2);
    r3 = yield ajax('http://url-3', data3);
    success(r3);
}
catch (err) {
    handle(err);
}
```
#### 此外,作为对象属性时简写generator

```js
var obj = {
    * myGenerator() {
        yield 'hello world';
    }
};
//等同于
var obj = {
    myGenerator: function* () {
        yield 'hello world';
    }
};
```

### [下一篇：ES6进阶二](./ES6进阶二.md)

### [上一篇：ES6基础二](./ES6基础二.md)

### [参考连接：阮一峰-ES6入门](http://es6.ruanyifeng.com)