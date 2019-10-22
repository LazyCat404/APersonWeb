# 前端都要会的

### let 与 const [关键字]

> ES6 明确规定，代码块内如果存在 `le`t 或者 `const`，代码块会对这些命令声明的变量从块的开始就形成一个封闭作用域。代码块内，在声明变量 PI 之前使用它会报错。

#### let

1. `let` 声明的变量只在 `let` 所在的代码块内有效（用法上和 `var`类似）

```js
{
    let a = 0;  //如果 用 var 声明，则下边并不会报错
    console.log(a); //打印a
}
console.log(a); //报错，变量未生名
```
2. `let`只能声明一次（多声明会报错），`var`可以声明多次

> 注意：如果一个变量先用`var`声明过，在用`let`声明也是会报错的；同样，先用`let`声明，再用`var`声明也是会报错的，也就是说，`let`声明的变量只能是未被声明过的。

3. `let` 不存在变量提升，`var` 会变量提升

> 可参考[基础进阶一](基础进阶一.md)的预编译部分，了解变量提升

```js
console.log(a);  //报错，变量未定义（未经声明就调用）
let a = "apple";

console.log(b);  //undefined，预编译环节，变量提升，所以并不会报错，但未进行赋值
var b = "banana"; 
```

>综合`let`声明变量的优点，在`for`循环语句中用`let`代替`var`可避免`bug`的出现

#### const 

1. `const` 声明一个只读的常量，一旦声明，常量的值就不能被改变（如果强行改变常量的值会报错）

> `const` 如何做到变量在声明初始化之后不允许改变的？其实 const 其实保证的不是变量的值不变，而是保证变量指向的内存地址所保存的数据不允许改动。此时，你可能已经想到，简单类型和复合类型保存值的方式是不同的。是的，对于简单类型（`number` 、`string` 、`boolean`）,值就保存在变量指向的那个内存地址，因此 `const` 声明的简单类型变量等同于常量。而复杂类型（`object` 、`array` 、`functio`n），变量指向的内存地址其实是保存了一个指向实际数据的指针，所以 `const` 只能保证指针是固定的，至于指针指向的数据结构变不变就无法控制了，所以使用 `const` 声明复杂类型对象时要慎重。

### 解构赋值

> 是一种针对**数组**或者**对象**进行模式匹配，然后对其中的变量进行赋值。

####  数组模型

```js
// 基本
let [a,b,c] = [1,2,3];
/*
    a = 1
    b = 2 
    c = 3
*/
//可嵌套
let [a, [[b], c]] = [1, [[2], 3]];
/*
    a = 1
    b = 2 
    c = 3
*/
// 可忽略
let [a, , b] = [1, 2, 3];
/*
    a = 1
    b = 2 
*/
// 不完全解构
let [a = 1, b] = [];
/*
    a = 1
    b = undefined
*/
// 剩余运算符
let [a, ...b] = [1, 2, 3];
/*
    a = 1
    b = [2, 3]
*/
// 字符串
let [a, b, c, d, e] = 'hello';
/*
    a = 'h'
    b = 'e'
    c = 'l'
    d = 'l'
    e = 'o'
*/
// 默认值
let [a = 2] = [undefined]; 
let [a = 2, b = a] = [];
/*
    a = 2  （2 是 a 的默认值）
    b = 2  （但是这里不能把b = a ,写在 a = 2 前边，会报错）
    当解构模式有匹配结果，且匹配结果是 undefined 时，会触发默认值作为返回结果
*/
```

####  对象模型

```js
// 基本

let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
/*
    foo = 'aaa'
    bar = 'bbb'
*/ 
let { baz : foo } = { baz : 'ddd' };
/* 
    foo = 'ddd'
*/
// 可嵌套可忽略
let obj = {p: ['hello', {y: 'world'}] };
let {p: [x, { y }] } = obj;
/*
    x = 'hello'
    y = 'world'
*/
let obj = {p: ['hello', {y: 'world'}] };
let {p: [x, {  }] } = obj;
/* 
    x = 'hello'
*/
// 不完全解构
let obj = {p: [{y: 'world'}] };
let {p: [{ y }, x ] } = obj;
/*
    x = undefined
    y = 'world'
*/
// 剩余运算符
let {a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40};
/*
    a = 10
    b = 20
    rest = {c: 30, d: 40}
*/
// 解构默认值
let {a = 10, b = 5} = {a: 3};
/* 
    a = 3
    b = 5;
*/
let {a: aa = 10, b: bb = 5} = {a: 3};
/*
    aa = 3
    bb = 5;
    a,b 未定义
*/
```

### Symbol

> 一种新的原始数据类型 Symbol ，表示独一无二的值，最大的用法是用来定义对象的唯一属性名；不是对象，不能`new`，但可以接收一个字符串作为参数，为新创建的 `Symbol` 提供描述。

```js
let sy = Symbol("KK");
console.log(sy);   // Symbol(KK)
typeof(sy);        // "symbol"
 
// 相同参数 Symbol() 返回的值不相等
let sy1 = Symbol("kk"); 
sy === sy1;       // false
```

#### 使用场景

1. 作为属性名

> 由于每一个 `Symbol` 的值都是**不相等**的，所以 `Symbol` 作为对象的属性名，可以**保证属性不重名**

```js
let sy = Symbol("key1");
 
// 写法1
let syObject = {};
syObject[sy] = "kk";
console.log(syObject);    // {Symbol(key1): "kk"}
 
// 写法2
let syObject = {
  [sy]: "kk"
};
console.log(syObject);    // {Symbol(key1): "kk"}
 
// 写法3
let syObject = {};
Object.defineProperty(syObject, sy, {value: "kk"});
console.log(syObject);   // {Symbol(key1): "kk"}
```
**注意：**`Symbol` 作为对象属性名时不能用 **.** ，要用 **[]** ，因为 **.** 运算符后面是字符串，所以取到的是字符串 `sy` 属性，而不是 `Symbol` 值 `sy` 属性。

```js
let syObject = {};
syObject[sy] = "kk";
 
syObject[sy];  // "kk"
syObject.sy;   // undefined
```
> `Symbol` 值作为属性名时，该属性是**公有属性**不是私有属性，可以在类的外部访问。但是不会出现在 `for...in` 、 `for...of` 的循环中，也不会被 `Object.keys()` 、 `Object.getOwnPropertyNames()` 返回。如果要读取一个对象的 `Symbol` 属性，可以通过 `Object.getOwnPropertySymbols()` 和 `Reflect.ownKeys()` 获取。

```js
let syObject = {};
syObject[sy] = "kk";
console.log(syObject);
 
for (let i in syObject) {
  console.log(i);
}    // 无输出
 
Object.keys(syObject);                     // []
Object.getOwnPropertySymbols(syObject);    // [Symbol(key1)]
Reflect.ownKeys(syObject);                 // [Symbol(key1)]
```
2. 定义常量

> 在 ES5 使用字符串表示常量，不能保证常量是**独特的**，这样会引起一些问题；而使用 `Symbol` 定义常量，就可以保证这一组常量的值**都不相等**

```js
//ES5 定义字符串常量
const COLOR_RED = "red";
const COLOR_YELLOW = "yellow";
//Symbol定义常量
const COLOR_RED = Symbol("red");
const COLOR_YELLOW = Symbol("yellow");
```

#### Symbol.for()

> `Symbol.for()` 类似单例模式，首先会在全局搜索被登记的 `Symbol` 中是否有该字符串参数作为名称的 `Symbol` 值，如果有即返回该 `Symbol` 值，若没有则新建并返回一个以该字符串参数为名称的 `Symbol` 值，并登记在全局环境中供搜索。

```js
let yellow = Symbol("Yellow");
let yellow1 = Symbol.for("Yellow");
console.log(yellow === yellow1);      // false

let yellow2 = Symbol.for("Yellow");
console.log(yellow1 === yellow2);     // true
```

#### Symbol.keyFor()

> `Symbol.keyFor() `返回一个已登记的 `Symbol` 类型值的 `key` ，用来检测该字符串参数作为名称的 `Symbol` 值是否已被登记。

```js
let yellow1 = Symbol.for("Yellow");
Symbol.keyFor(yellow1);    // "Yellow"
```

### 函数

#### 参数默认值

> ES6规定参数默认值可以直接写在括号内，但使用函数默认参数时，**不允许有同名参数**（会报错）

```js
function(age = 18){ 
    console.log(age);
}
/*
    只有在未传递参数，或者参数为 undefined 时，才会使用默认参数
    null/false被认为是有效的值传递
*/
```
> 在函数参数默认值表达式中，还**未初始化赋值**的参数值无法作为其他参数的默认值

```js
function f(x,y=x){
    console.log(x,y);
}
f(1);  // 1 1
 
function f(x=y){
    console.log(x);
}
f();    // ReferenceError: y is not defined
```
#### 不定参数

> `...变量名`，具名参数只能放在参数组的最后，并且有且只有一个不定参数

```js
function f(...values){
    console.log(values.length);
}
f(1,2);      //2
f(1,2,3,4);  //4
```
#### 箭头函数

> 参数 => 函数体，**不可以作为构造函数**，也就是**不能使用 `new` 命令**，否则会报错

```js
// 基本用法
var f = v => v;
//等价于
var f = function(v){
    return v;
}
f(1);  //1
```
> **多个参数**要用()括起来；当**只有一行语句**，并且**需要返回结果**时，可以**省略 {}** , 结果**会自动返回**

```js
var f = (x,y) => x + y

//当箭头函数要返回对象的时候，为了区分于代码块，要用 () 将对象包裹起来
var f = (id,name) => ({id: id, name: name});    //如果没写()会报错
f(6,2); //{id: 6, name: 2}

// 多行语句
var f = (a,b) => {
    let result = a+b;
    return result;
}
f(6,2);  // 8
```
> 箭头函数没有 `this`、`super`、`arguments` 和 `new.target` 绑定。箭头函数体中的 `this` 对象，是**定义函数时的对象**，而**不是使用函数时的对象**

### 模板字符串

> 利用两个[ ` ]将字符串包裹

1. 语义化：支持换行，格式化HTML标签

2. 添加变量：变量用`${变量}`包裹

3. 添加表达式：

```js
let x = 1,y = 2;
let str = `${x + y}`    // 3 字符串
```
4. 添加方法：`${方法名()}`

5. 嵌套：模板字符串内写模板字符串

```js
let arr = [1,2,3,4,5];
let resStr = `${arr.map(function(item,index){
    return `${item}:${index}`
})}`    // "1:0,2:1,3:2,4:3,5:4"
```

### 标签模板

> 函数调用的一种特殊形式，参数是模板字符串

1. ` 方法名`` ` 就相当于执行了方法，` `` ` 可以有参数，有点类似 方法名() 

```js
let name = 'xiaoMing';
let place = 'BeiJing';
function show(){
    console.log(arguments);
}
show `hello${name},welcome to ${place}`
/*
    依据以下截图,以上方法调用等价于：
    show(['hell',',welcome to ',''],name,place)
*/
```
![结果截图](../Img/JS/标签模板.png)

2. 常用于**过滤HTML字符串**，防止用户输入恶意内容

```js
let name = '<script>alter("xiaoMing")</script>';
HT`<p>Hello${name},welcome!</p>`;
function HT (data){
    /*
        arguments:[['<p>Hello',',welcome!</p>'],<script>alter("xiaoMing")</script>]
        data:['<p>Hello',',welcome!</p>']     ==> 解构赋值，对应的结果
    */
    let str = data[0];
    for(let i = 1;i < arguments.length;i++){
        let arg = String(arguments[i]);
        str += arg.replace(/&/g,'amp').replace(/</g,'&lt;').replace(/>/g,'&gt');
        str += data[i];
    }
    console.log(str)//<p>Hello&lt;script&gtalter("xiaoMing")&lt;/script&gt,welcome!</p>
}
```