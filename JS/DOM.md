#  DOM --> Document Object Model(文档对象模型)

> DOM 定义了表示和修改文档所需的方法（对象、这些对象的行为和属性以及这些对象之间的关系。）DOM 对象即为宿主对象，由浏览器厂商定义，用来操作 html和 xml 功能的一类对象的集合。

### DOM 基本操作 -->【遍历，查找】(大部分都是类数组) 

> document 代表整个文档（如果给 html 标签上面再套一层标签就是 document）

#### 方法类操作

- `document.getElementById()` : **id**，在 Ie8 以下的浏览器，不区分 id 大小写，而且也返回匹配 name 属性的元素。

> 一般作为顶级框架的名称存在，不要写多个也不要过于依赖（写父子选择器的时候 `#father div`很可能会被后端作为接口抽取，导致出现问题。）**在 css 中一般用 `class` 选择器**


- `document.getElementsByClassName()` : **类名** ==> 常用，ie8 和 ie8 以下的 ie 版本中没有，可以多个 class 一起，不是所有浏览器都能用

> 注意:哪怕整个文档只有一个元素，也要加`[0]`，不然选出来的就是一个组

- `document.getElementsByTagName()` : **标签名**，这是一个类数组(最主流方法，兼容性很好，IE4都能用)

- `document.getElementsByName()` : **name**,只有部分标签 name 可生效（表单，表单元素，img，iframe），不是在所有的浏览器都能用——开发*一般不用*

- `document.querySelector('css选择器')` : 可以按照css 选择器的方式选择则元素，只能**选一个**，在 ie7 和 ie7 以下的版本中没有

- `document.querySelectorAll()` : css 选择器，全选，**选一组**，在 ie7 和 ie7 以下的版本中没有

- `.querySelectorAll()` 和 `.querySelector()`选出来的元素**不是实时的（是静态的）**，所以一般不用

#### 非方法类的操作

1. **遍历节点树**

> 遍历节点树：(灵活，兼容好)——关系类的选择

- `parentNode` → 父节点 (最顶端的 parentNode 为#document);

- `childNodes` → 子节点们（直接的节点数）节点包括文本节点，属性节点

- `firstChild` → 第一个子节点

- `lastChild` → 最后一个子节点

- `nextSibling` →后一个兄弟节点

- `previousSibling` → 前一个兄弟节点

2. **遍历元素节点树（不含文本节点）**

> 除`children`外，其余 ie9 及以下不兼容）

- `children` -> 只返回当前元素的元素子节点【常用】

- `parentElement` -> 返回当前元素的父元素节点 (IE9及以下 不兼容)

> `node.childElementCount` === `node.children.length` 当前元素节点的子元素节点个数(IE 不兼容)——基本不用，因为与 length 相等

- `firstElementChild` -> 返回的是第一个元素节点(IE9及以下 不兼容)

- `lastElementChild` -> 返回的是最后一个元素节点(IE9及以下 不兼容)

- `nextElementSibling` / `previousElementSibling` -> 返回后一个/前一个兄弟元素节点(IE9及以下 不兼容)

#### 节点的类型

> 后面的数字是调用`nodeType`返回的数字

- 元素节点 —— 1

- 属性节点 —— 2 （基本没用，）

- 文本节点 —— 3

- 注释节点 —— 8

- document —— 9

- DocumentFragment —— 11 

#### 节点属性

- `nodeName` : 元素的标签名，以大写形式表示,**只读，不能写**

- `nodeValue` : Text 文本节点或注释节点(`Comment`)的文本内容,可读写

- `nodeType` : 【最有用】该节点的类型，只读返回这个 div 的所有的元素节点

- `attributes` : Element 节点的属性集合

> 属性名不能改，属性值可以改，但是通常不用这种方法，一般用 `getAttribute` 和 `setAttribute`去取

> 节点的一个方法 `Node.hasChildNodes()`——他有没有子节点，返回值是 true 或 false

### DOM 基本操作 -->【增、插、删、改】

- `document.createElement('div')` : 增加或创建元素节点（标签）——常见

- `document.createTextNode()` : 创建文本节点

- `document.createComment()` : 创建注释节点

- `父节点.appendChild()` ： 向父节点内添加元素（写在括号内）；可以理解成.push

```
var div= document.getElementsByTagName('div');
var span = document.createElement("span");
div.appendChild(span)
```
- `父节点.insertBefore(a, b)` : 在 a 前插入 b （待完善）

- `parent.removeChild()` : 将节点剪切出来

- `child.remove()` : 彻底删除

- `parent.replaceChild(new, origin)` : 用 **new** 替换 **origin**

#### DOM 节点上的方法

- `ele.innerHTML` : 可取，可写，可赋值

- `ele.innerText` : 可取，可赋值 (老版本火狐不兼容) / `textContent`(火狐使用这个，老版本 IE 不好使)

- `ele.setAttribute('属性名','属性值')` :设置行间属性

- `ele.getAttribute('属性名')` : 取属性

#### [上一篇：基础进阶二](基础进阶二.md)
