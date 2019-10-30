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

> 使用`import`命令的时候，用户需要知道所要加载的变量名/函数名，否则无法加载，为了解决这个问题就用到了`export default`命令，为模块指定默认输出。

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
import aaa, { name, age } from './……';
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
> `Node` 的`require`方法是运行时加载

```js
const path = './' + fileName;
const myModual = require(path); //运行时加载，到底加载哪一个模块，只有运行时才知道（import 做不到）
```
**通过以上对比，`import()`函数，完成动态加载，应运而生，它和`import`类似，只不过一个是动态，一个是静态态**

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