# BOM --> Browser Object Model(浏览器对象模型)

> Browser Object Model，定义了操作浏览器的接口,BOM 对象: `Window`, `History`,`Navigator`,`Screen`, `Location` 等由于浏览器厂商的不同，**BOM**对象的兼容性极低。一般情况下，只用其中的部分功能。

### BOM 对象

- `Window` : JS中最顶层对象，表示浏览器窗口

> 当然，下边四个对象都是 `Window` 下的属性

- `Navigator` : 客户端浏览器信息

- `History` : 浏览器窗口访问过的 URL

- `Location` : 当前 URL 信息

- `Screen` : 客户端显示屏信息（很少用）

### Window 对象

> 表示一个**浏览器窗口**或一个**框架**（`iframe`），所有浏览器都支持 Window 对象。

1. 所有全局 JavaScript 对象，函数和变量自动成为 window 对象的成员。

2. 全局变量是 window 对象的属性（document 对象也是 window 对象属性）。

3. 全局函数是 window 对象的方法。



#### [上一篇：DOM](DOM.md)

#### [下一篇：DOM](进阶提升一.md)