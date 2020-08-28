# 坚持到现在，不错~

### async 函数

> 在[ES6进阶一](./ES6进阶一.md)中我们了解到了两种异步操作解决方案（`Promise`，`Generator`），ES2017 引入的`async` 则使异步操作更加简单方便（可以将其理解为`Generator`语法糖）。

#### 基本用法

> `Generator` 函数调用时，我们需要不断调用`.next()`（执行器），才能的到结果，这现得有些麻烦，`async` 函数就很好的解决了这一点（相当于自带执行器）。

1. `async` 函数声明

> 在常函数前加上`async`即可

- `async function test(){}`

- `let test = async function(){}`

-   `const test = async () => {};`

-   ```js
        let obj = { 
            async test(){} 
        };
    ```

-   ```js
        class test {
            async demo() {}
        }
        //调用时，别忘了 new test实例
    ```

2. `async` 函数调用

> 与正常函数一样，采用 **函数名.()**方式即： `test()`

3. 与 `Generator`函数比较

> 可以理解为，`async`就是将`Generator`的：`*`换成了`async`；`yield`换成了`await`

- 内置执行器，执行方便（和普通函数一样）

- `async`和`await`，相较于`*`和`yield`，语义更清楚

- `await`命令后不做约束，适用性更好

    - `await`命令后可以是`Promise`对象，也可以是原始数据类型（数值、字符串、不尔值），会自动转成`resolved`的`Promise`对象

    - `yield`命令后只能是`Thunk`函数或`Promise`对象

- 返回值是 `Promise`，可以使用`then()`指定下一步操作（`Generator` 函数的返回值是 `Iterator`）

```js
// 引入node 模块（这里实现依次读取两个文件）
const fs = require('fs');
function readFile(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path,function(err,data){
            if(err){
                console.log("读取文件失败！"); 
                resolve();  //方法调取，改变Promise 状态  
            }else{
                console.log("读取文件成功：",data.toString()); 
                resolve();  //方法调取，改变Promise 状态  
            }
        });
    })
}
// Generator
function* runReadFile(){
    yield readFile('./demo.txt');
    yield readFile('./index.html');
    return '结束';
}
for(var x of runReadFile()){}
// async
async function runReadFile(){
    await readFile('./demo.txt');
    await readFile('./index.html');
    console.log('执行完毕！');  //如果await 不返回一个Promise 对象，则会先执行此行
}
runReadFile();
```
> `await` **只能**配合`async`函数使用，在普通函数中会报错

#### 返回值的变化理解

> 前面说到，`async`函数会返回一个`Promise`对象，所以它可以有`.then（）`回调方法。而`async`函数内部的`return`的值，就是`.then（）`的参数。

```js
async function demo(text){
    return text;
}
demo('我执行了').then(x => {
    console.log(x);
})
```
> 如果`async`函数内部抛出错误，会导致返回的`Promise`对象变为`reject`状态，抛出的错误对象会被`catch`方法回调函数接收到

```js
async function demo(){
    throw new Error('报错了！');    // new 一个错误对象
}
demo().then(    // Promise 对象
    s => {      // resolve - 成功状态执行
        console.log('执行成功');
    },
    e => {      // reject - 失败状态执行
        console.log(e);
    }
)
```
> `async`函数返回的`Promise`对象，必须等到内部所有`await`执行完，才会发生状态改变（才会执行`.then()`函数），此外，遇到`return`或**抛出错误**也会使状态发生改变。

* 因为`Sleep`对象，本身定义了`.then()`方法，所以如果`await`后边`Sleep`对象，也会当作`Promise`处理。

* 如果我们希望，一个异步操作失败，也不会影响后面的操作，这时就需要使用到`try...catch`

```js
async function test(){
    try { 
        await Promise.reject('出错了'); 
    }catch(e) {
        console.log(e);
    }
    try {
        throw new Error();  
    }catch(e) {
        console.log(e);
    }
    return await Promise.resolve('hello world');
}
test().then(s => console.log(s),e => console.log(e))
```

### ArrayBuffer







### 装饰器[Decorator函数](https://juejin.im/post/59f1c484f265da431c6f8940)







### [上一篇：ES6进阶一](./ES6进阶一.md)

### [参考连接：阮一峰-ES6入门](http://es6.ruanyifeng.com)