# 还没完呢

### Class 类

> 在ES6中，`class`(类)作为**对象的模板**被引入，可以通过`class`关键字定义类；其本质就是`function`，只是它的出现让对象原型的写法更**清晰**，更像面向对象编程语法

#### 类声明/类定义

> 1. 类声明**不会提升**，也就是需要先声明，在访问，否则会报错
>
> 2. 且类声明**不可以重复**
>
> 3. 类必须使用 `new` 调用，否则会报错；普通构造函数不使用`new`也可以执行

**方式一：关键字声明**
```js
class Test{
    constructor(){
        //……
    }
}
```
**方式二：表达式定义**

```js
let Test = class{
    constructor(){
        //……
    }
}
let Test = class Test{
    constructor(){
        //……
    }
}
```
#### constructor => 构造方法

> * 看过上边我们会发现，每个类里都有一个 `constructor`的方法，其实`constructor`方法是类的默认方法，通过`new`命令生成对象实例时，自动调用该方法（默认返回实例对象 `this`）
>
> * 一个类必须有`constructor` 方法，如果没有显式定义，则会自动的将一个空的`constructor`方法添加到类中
>
> * 一个类只能拥有一个名为`constructor`的方法，如果有多个`constructor`方法，则会报`SyntaxError`错误
>
> * `constructor`中定义的属性可以称为实例属性（即定义在`this`对象上），`constructor`外声明的属性都是定义在原型上的，可以称为原型属性（即定义在`class`上)
>
> * `hasOwnProperty()`用于判断属性是否是实例属性

```js
//ES5（没有类）
function Person(name) { // 声明构造函数Person，首字母大写
    this.name = name;
}
Person.prototype.say = function(){  //在原型上定义say方法
    return "My name is " + this.name;
}
var obj = new Person("小明");   // 通过构造函数创建对象
console.log(obj.say()); // 实例对象调用原型方法say，打印：My name is 小明

//ES6（引入类）
class Person{   //定义/声明了一个名字为Person的类
    constructor(name){  //constructor是一个构造方法，用来接收参数
        this.name = name;   //this代表的是实例对象
    }   //没有‘，’ 分割，也不要加上‘，’否则会报错
    say(){  //这是一个类的方法，不能加上function
        return "My name is " + this.name;;
    }
}
var obj=new Person("小明");
console.log(obj.say()); // My name is 小明
```
#### 类中的方法

> 类的所有方法都定义在类的`prototype`属性上面，在类的实例上面调用方法，其实就是调用原型上的方法

PS：有关原型方法/静态方法/实例方法的相关了解可在[常识](./常识.md)中找到

**1. 静态方法**

> 静态方法（`class`本身的方法）可以通过**类名调用**，不能通过实例对象调用，否则会报错

```js
class Person {
    static sum(a, b) {  //静态方法,ES6 中规定，Class 内部只有静态方法，（没有）静态属性有规范，浏览器没有实现，。
        console.log(a + b)
    }
}
var p = new Person()    //p 是 Person 类的实例对象
Person.sum(1, 2)  // 3
p.sum(1,2)  //  TypeError p.sum is not a function
```
**2. 原型方法**

> 原型方法可以通过**实例对象调用**，但不能通过类名调用，会报错

```js
// 给 Person 的原型添加方法
Person.prototype.toVal = function() {
	console.log('I so cool')
}
//等同于
class Person {
    constructor(name,age){
        //……
    }
    toVal(){
        console.log('I so cool')
    }
}

//通过Object.assign为对象动态添加方法
console.log(Person.prototype);  //输出的结果是一个对象
Object.assign(Person.prototype,{
    getName:function(){
        return this.name;
    },
    getAge:function(){
        return 18;
    }
})
var obj=new Person("小明");
console.log(obj.getName());//小明
console.log(obj.getAge());//18
```
**3. 实例方法**

> 实例方法可以通过**实例对象调用**，但同样不能通过类名调用，会报错

```js
class Person {
    constructor() {
        this.sum = function() { //实例方法
            console.log('I so cool')
        }
    }
}
var p = new Person()
p.sum()       // I so cool
Person.sum()    // 报错
```
#### 继承

> 子类`constructor`方法中必须有`super`，且必须出现在`this`之前：（因为）子类没有`this`，需要使用`super`方法，调用父类的构造函数，将`this`绑定到自己身上
```js
/*
    ES5 继承 ==> 原型链继承
    B.__proto__.prototype = A.prototype  ==> 方法的继承
*/
function A (){}
var a = new A()
console.log(a.__proto__ == A.prototype) //true

/* 
    ES6 继承 ==> extends(关键字)
    B.__proto__ = A  ==> 构造函数的继承
*/
class A {
    constructor(){
        this.name = '小明'
    }
    print(){
        console.log(this.name)
    }
}
class B extends A {
    constructor(){
        super() //不写会报错，子类一定要调用super函数才能使用this
        this.name = '小红'
    }
}
var b = new B()
b.print()   //小红
```
> `super`作为对象，在普通方法中，指向**父类的原型对象**，在静态方法中，指向**父类**，此外还具有绑定子类`this`的功能

```js
class A {
    constructor(name = '默认小朋'){
        this.name = '小明'
    }
    print(){
        console.log('Father A')
    }
}
A.prototype.name = 'Name A'
class B extends A {
    constructor(){
        super() 
    }
    print(){
        console.log(super.name) //作为对象使用，在普通方法中，指向父类原型对象
    }
}
var b = new B()
b.print()  // Name A （如果没有‘A.prototype.name = 'Name A'’ 则是 undefined）
```
#### [Decorator函数](https://juejin.im/post/59f1c484f265da431c6f8940)

#### 其它

**1. 立即执行class**

```js
new class{
    //……
}
```
**2. this指向**

> 普通函数：谁调用指向谁
> 箭头函数：父级作用域




### Generator（生成器）

> 是ES6标准引入的**新的数据类型**。一个generator看上去像一个函数，但可以**返回多次**

1. `generator`由`function*`定义（注意多出的`*`号，普通函数没有），并且除了`return`语句，还可以用`yield`(关键字)返回多次

```js
function* test(x) {
    yield x + 1;
    yield x + 2;
    return x + 3;
}
```
以上就是一个简单的`generator`，按照普通函数的调用方法，我们可能会想到`test(1)`来执行函数，结果如下：

![test(1)结果截图](../Img/JS/generator1.jpg)

2. `generator`调用：通过上边的截图我们可以看出按照普通函数的调用方式`test(1)`，仅仅是创建了一个`generator`对象，还没有去执行它

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
3. `generator`作用 ：

* `generator`可以在执行过程中**多次返回**，所以它看上去就像一个可以**记住执行状态**的函数，利用这一点，写一个`generator`就可以实现需要用面向对象才能实现的功能

* `generator`可以把**异步回调**代码变成**同步**代码

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
4. 此外,作为对象属性时简写`generator`

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