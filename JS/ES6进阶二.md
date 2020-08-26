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
    fs.readFile(path,function(err,data){
        if(err){
            console.log("读取文件失败！");  
        }else{
            console.log("读取文件成功：",data.toString());   
        }
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
}
runReadFile();
```
> `await` **只能**配合`async`函数使用，在普通函数中会报错

#### 返回值的变化理解

### ArrayBuffer









### [上一篇：ES6进阶一](./ES6进阶一.md)

### [参考连接：阮一峰-ES6入门](http://es6.ruanyifeng.com)