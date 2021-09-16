# 想绘制一个新世界吗？

### [canvas 标签理解](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_usage)

> 就像`div` 一样，它拥有标签的全部特性，但同时，它是一个双标签，也就是说`</canvas>`不可省略，标签内的内容，为替代内容。

```html
<canvas id="myCanvas">
  当浏览器不兼容时，我将会显示
</canvas>
```

#### whidth/height

对于 `<canvas>` 来说，`whidth`和`height`两个属性是必须属性，如果不写，则会默认` width='300px' height='150px'`

> 通常情况下，尝试用`width`和`height`属性为`<canvas>`明确规定宽高，而不是使用CSS，因为如果CSS的尺寸与初始画布的比例不一致，它会出现扭曲。

#### 渲染上下文

> 这里主要介绍 2D 渲染，3D 渲染请移步[WebGL](./WebGL.md)

```js
// 获取 canvas 对象
let canvas = document.getElementById('myCanvas'); 
/**
 * 获取上下文，以获得渲染和绘画的能力
 * 这就是canvas的神奇之处，要知道，普通标签的 dom 对象，是没有getContext()方法的
 */ 
if(canvas.getContext){  // 兼容一下浏览器不支持的可能
  let ctx = canvas.getContext('2d');  // 2d，说明我们获取的是平面相关的API，不能写成2D
}
```

#### 坐标（栅格）

`canvas`元素默认被网格所覆盖。通常来说网格中的一个单元相当于`canvas`元素中的一像素。栅格的起点为左上角（**坐标为(0,0)**）。所有元素的位置都相对于原点定位。当然这个原点是可以变的。

![Canvas栅格](../Img/HTML/canvas_grid.png)

