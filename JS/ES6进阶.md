# 还没完呢

### Set/Map 数据解构

> ES6 提供的新的数据结构`Set`（类似于数组）
> ES6 还提供了`Map`数据结构（它类似于对象）

#### Set

> `Set`本身是一个构造函数，用来生成`Set`数据结构

**1. `Set`函数可以接受一个数组（或者具有 `iterable` 接口的其他数据结构）作为参数，用来初始化**

```js
const s = new Set()
const s1 = new Set([1, 2, 3, 4, 4]);    // {1, 2, 3, 4}
[...s1] // [1, 2, 3, 4]
```
**2. `add()`不会向`Set`结构添加重复的值**

```js
// 基础用法
const s = new Set();
var arr = [2, 3, 5, 4, 5, 2, 2]
arr.forEach(x => s.add(x)); //s：{2, 3, 5, 4}

//数组去重
[...new Set(arr)]  
//Array.from方法可以将 Set 结构转为数组
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);    
//封装成一个通用方法
function dedupe(array) {    //封装后的方法 dedupe
  return Array.from(new Set(array));
};

// 字符串去重
[...new Set('ababbc')].join('') // abc

// Set 内部，两个NaN是相等的
let a = NaN;
let b = NaN;
s.add(a);
s.add(b);     // Set {NaN}

// Set 内部，两个对象总是不相等的，即使看上去一样，它们也被视为是两个值
s.add({});
s.size // 1
s.add({});
s.size // 2
```
**3. `Set` 实例的属性**

* `Set.prototype.constructor`：构造函数，默认就是`Set`函数

* `Set.prototype.size`：返回`Set`实例的成员总数

**4. `Set` 实例操作数据的方法**

* `Set.prototype.add(value)`：添加某个值，返回 `Set`结构本身

* `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功

* `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员

* `Set.prototype.clear()`：清除所有成员，没有返回值

> `Object结构`和`Set结构`的写法不同，`Object结构`也有判断是否是自己的成员，但是判断方法不同，详细可在[基础进阶一](./基础进阶一.md)中查看

```js
// 对象的写法
const obj = {
    key1:1,
    key2:2,
};

if (obj[objKey]) {  //判断 obj对象是否存在 objKey 属性
    console.log('很好，继续')
}

// Set的写法
const set = new Set();
set.add('key1');
set.add('key2');

if (set.has(setVal)) {
    console.log('干的不错')    
}
```
**5. `Set` 实例遍历数据的方法**

> `keys()`、`values()`、`entries()`（最好结合对象处对应的方法理解）用于遍历对象，但`Set`结构`没有键名，只有键值`（或者说键名和键值是同一个值），因此`keys()`/`values()`的行为完全一致。

* `Set.prototype.keys()`：返回键名的遍历器

* `Set.prototype.values()`：返回键值的遍历器

* `Set.prototype.entries()`：返回键值对的遍历器（返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等）

```js
let set = new Set([1, 2, 3]);
for (let item of set.keys()) {
  console.log(item);    // 1 2 3
}

for (let item of set.entries()) {
  console.log(item);    // [1, 1] [2, 2] [3, 3]
}
```
> 事实上，`Set` 结构的实例默认可遍历(不用遍历方法)，它的默认遍历器生成函数就是它的`values`方法，也就是说可以直接用`for...of`循环遍历`Set`

```js
Set.prototype[Symbol.iterator] === Set.prototype.values //true

//for...of
for (let x of set) {
    console.log(x);
}
```
* `Set.prototype.forEach()`：具体请参考[基础进阶二有关数组的部分](./基础进阶二.md)Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的

> `forEach`方法还可以有第二个参数，表示绑定处理函数内部的`this`对象。

#### WeakSet（不能遍历，强行遍历会返回undefined）

> `WeakSet 结构`与 `Set` 类似，也是不重复的值的集合。但`WeakSet`的成员**只能是对象**，否则报错

```js
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```
> WeakSet 中的对象都是**弱引用**（垃圾回收机制不考虑`WeakSet` 对该对象的引用），也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 `WeakSet` 之中

**PS：`WeakSet`方法请参照`Set`（遍历方法除外，它不能遍历）**

#### Map   

> 类似于对象（键-值组合），但是‘键’的范围不限，各种类型甚至包括对象都可以（对象的键名只能是字符串）

```js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content') // 将对象 o 当作 m 的一个键（可以理解为添加一个键）
m.get(o) // "content"   get方法读取这 o 键

m.has(o) // true    m 上存在 o 键
m.delete(o) // true 删除成功
m.has(o) // false   m 上不存在这个键

// 也可以通过Set生成Map对象
const set = new Set([
    ['foo', 1],
    ['bar', 2]
]);
```
> `Map` （作为构造函数）也可以接受一个数组作为参数，该数组的成员是一个个表示键值对的数组

```js
const map = new Map([
  ['name', '小明'],
  ['title', '程序猿']
]);

map.size // 2
map.has('name') // true
map.get('name') // "小明"
map.has('title') // true
map.get('title') // "程序猿"
map.get('age') // undefined (age 是未知键)
```
**PS：不仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数（方法参见Set）**

> `Map`在判断是否是同一个键的时候，实际上是判断内存地址，只要内存地址不同，则视为两个键（使用对象最为键名，内存地址不同）；如果 `Map` 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，即可判断为同一个键

* **0** 和 **-0** 是一个键

* `NaN` 是一个键

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined ，两个方法看上去是针对同一个键，但实际上是两个不同的数组实例，内存地址是不一样的
```

**PS：`Map`遍历方法请参照`Set`遍历方法，但需要注意的是，Map的遍历顺序就是插入顺序**

#### WeakMap

> `WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合，但与Map有以下两点区别：

1. `WeakMap`只接受对象作为键名（null除外），否则报错

2. `WeakMap`的键名所指向的对象，不计入垃圾回收机制（自动回收，避免造成内存泄漏）

> 应用场景：在网页的 `DOM` 元素上添加数据，就可以使用`WeakMap`结构。当该 `DOM` 元素被清除，其所对应的`WeakMap`记录就会自动被移除。

### Proxy（代理/拦截）

> 对目标对象的读取、函数调用等操作进行**拦截**，然后进行操作处理。它不直接操作对象，而是像代理模式，通过对象的代理对象进行操作

#### Proxy 构造函数，用来生成 Proxy 实例

```js
/*
    new Proxy()：生成一个Proxy实例
    target： 要拦截的目标对象
    handler：也是对象，用来制定拦截行为
*/
var proxy = new Proxy(target, handler);

// 另一种写法
var proxy = new Proxy({}, { // 目标对象设置为空对象
    get: function(target, property) {   //访问任何属性都只返回 35
        return 35;
    }
});
```
**PS：handler没有设置任何拦截，那就等于直接通向原对象（访问`proxy`就等同于访问`target`）**

#### 将Proxy对象，设置到object.proxy属性，就可以在object对象上调用

```js
var object = { proxy: new Proxy(target, handler) };
```
#### Proxy 实例可以作为其它对象的原型

```js
//结合上边的 proxy 实例代码
let obj = Object.create(proxy); // Object.create 在原型上创建对象
obj.time // 35   obj 对象本身没有time属性，根据原型链读取proxy对象上属性，被拦截
```
#### Proxy支持得拦截操作（实例方法）

> 以下方法参数对应：`target`< = >目标对象、`propKey`< = >属性名、`receiver`< = >`proxy`实例本身

- `get(target, propKey, receiver)`：拦截对象属性的读取,如果有`get`拦截，访问目标对象不存在属性会报错，没有拦截则是`undefined`

```js
proxy.foo
proxy['foo']
```
- `set(target, propKey, value, receiver)`：拦截对象属性的设置，返回一个布尔值

> `value` 为自定义参数 

```js
proxy.foo = v
proxy['foo'] = v
```
- `has(target, propKey)`：拦截`HasProperty`的操作，即判断对象是否具有某个属性，返回一个布尔值

> 典型操作就是 `in` 运算符，无法对`for……in`起作用

```js
var handler = {
    has (target, key) {
        if (key[0] === '_') {   // 以 _ 开头的属性，返回 false ，达到了隐藏属性的效果
            return false;
        }
    }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```
> 如果原对象不可配置或者禁止扩展，这时`has`拦截会报错

```js
var obj = { a: 10 };
Object.preventExtensions(obj);  //obj 禁止扩展
```

- `deleteProperty(target, propKey)`：拦截`delete`操作，如果这个方法**抛出错误**或者返回`false`，当前属性就无法被`delete`命令删除

> 目标对象自身的不可配置（`configurable`）的属性，不能被`deleteProperty`方法删除，否则报错

```js
delete proxy.name   //会被deleteProperty拦截
```
- `ownKeys(target)`：拦截对象自身属性的读取操作，返回一个数组

> 该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性

> 拦截以下操作：
`Object.getOwnPropertyNames()`
`Object.getOwnPropertySymbols()`
`Object.keys()`
`for...in`循环

- `getOwnPropertyDescriptor(target, propKey)`：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象

- `defineProperty(target, propKey, propDesc)`：拦截`Object.defineProperty`即添加属性操作，返回一个布尔值

> 如果目标对象不可扩展（`non-extensible`），则`defineProperty`不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（`writable`）或不可配置（`configurable`），则`defineProperty`方法不得改变这两个设置

- `preventExtensions(target)`：拦截`Object.preventExtensions()`，返回一个布尔值（不是布尔值会被自动转为布尔值）

> 只有目标对象不可扩展时（即`Object.isExtensible(proxy)`为`false`），`proxy.preventExtensions`才能返回`true`，否则会报错，为了防止出现这个问题，通常要在`proxy.preventExtensions`方法里面，调用一次`Object.preventExtensions`

```js
var proxy = new Proxy({}, {
    preventExtensions: function(target) {
        console.log('called');
        Object.preventExtensions(target);
        return true;
    }
});
Object.preventExtensions(proxy)
// "called"
// Proxy {}
```
- `getPrototypeOf(target)`：拦截获取**对象原型**，返回一个布尔值

> 拦截以下操作：
`Object.prototype.__proto__`
`Object.prototype.isPrototypeOf()`
`Object.getPrototypeOf()`
`Reflect.getPrototypeOf()`
`instanceof`

- `isExtensible(target)`：拦截`Object.isExtensible`操作，返回一个布尔值

> 该方法的返回值必须与目标对象的`isExtensible`属性保持一致，否则就会抛出错误

```js
Object.isExtensible(proxy) === Object.isExtensible(target)
```
- `setPrototypeOf(target, proto)`：拦截`Object.setPrototypeOf()`，只返回一个布尔值

- `apply(target, object, args)`：拦截 `Proxy` 实例作为**函数的调用**、`call`和`apply`操作

```js
var target = function () { return 'I am the target'; }; //一个函数
var p = new Proxy(target, {
    apply: function () {
        return 'I am the proxy';
    }
});
p() // "I am the proxy" p执行，目标函数执行target()调用，触发apply拦截
```
- `construct(target, args)`：用于拦截`new`命令，该方法返回的必须是一个对象，否则会报错

> `args`：构造函数的参数对象

```js
var p = new Proxy(function () {}, {
    construct: function(target, args) {
        return { value: args[0] * 10 };
    }
});
new p(1)    // {value: 10}
```
#### Proxy.revocable()

> 该法返回一个可取消的 `Proxy` 实例，方法返回一个对象，该对象的`proxy`属性是`Proxy`实例，`revoke`属性是一个函数

```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
> 应用场景：目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问

### Reflect

> 与`Proxy`对象一样，为了操作对象二提供新的API

#### 设计目的

**1. 将Object对象的一些明显属于语言内部的方法（如：`Object.defineProperty`），放到Reflect对象上**

**2. 修改某些Object方法的返回结果，让其变得更合理**

```js
/* 
    老写法：Object.defineProperty
    在无法定义属性时，会抛出一个错误
*/
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

/* 
    新写法：Reflect.defineProperty
    在无法定义属性时，会返回false
*/
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```
**3. 让Object操作都变成函数行为**

> 某些Object操作是命令式，比如`name in obj`和`delete obj[name]`

**4. Reflect对象的方法与Proxy对象的方法一一对应**

> 不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为

#### 静态方法

> 大部分与`Object对象`的同名方法的作用都是相同的，而且它与`Proxy对象`的方法是一一对应的

- `Reflect.get(target, name, receiver)`：查找并返回`target`对象的`name`属性，如果没有该属性，则返回`undefined`

- `Reflect.set(target, name, value, receiver) `：设置`target`对象的`name`属性等于`value`

- `Reflect.has(obj, name)`：对应name in obj里面的in运算符

- `Reflect.deleteProperty(obj, name)`：等同于`delete obj[name]`，用于删除对象的属性

- `Reflect.construct(target, args)`：等同于`new target(...args)`，这提供了一种不使用`new`，来调用构造函数的方法

- `Reflect.getPrototypeOf(obj)`：读取对象的`__proto__`属性

- `Reflect.setPrototypeOf(obj, newProto)`：设置目标对象的原型（`prototype`）

- `Reflect.apply(func, thisArg, args)`：用于绑定`this`对象后执行给定函数

- `Reflect.defineProperty(target, propertyKey, attributes)`：用来为对象定义属性

- `Reflect.getOwnPropertyDescriptor(target, propertyKey)`：用于得到指定属性的描述对象，将来会替代掉后者

- `Reflect.isExtensible (target)`：表示当前对象是否可扩展

- `Reflect.preventExtensions(target)`：于让一个对象变为不可扩展，返回一个布尔值

- `Reflect.ownKeys (target)`：用于返回对象的所有属性

#### Proxy简单实现观察者模式

> 观察者模式即实现`observable`和`observe`两个函数：`observable`函数返回一个原始对象的`Proxy`代理，拦截赋值操作，触发充当观察者的各个函数

```js
const queuedObservers = new Set();  //所有观察者函数都放进这个集合

const observe = fn => queuedObservers.add(fn);
// 返回原始对象的代理，拦截赋值操作。拦截函数set之中，会自动执行所有观察者
const observable = obj => new Proxy(obj, {set});   

function set(target, key, value, receiver) {    //观察者
    const result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach(observer => observer());
    return result;
}
```

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

### [下一篇：Promise](./Promise.md)

### [上一篇：ES6基础](./ES6基础.md)

### [参考连接：阮一峰-ES6入门](http://es6.ruanyifeng.com/)