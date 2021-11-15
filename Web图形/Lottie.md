# 前端常用动效实现方式

### CSS3 帧动画

CSS 发展到了今天，它的强大几乎不是我们可以想像到的。合理的使用`Animation`可以实现很多神奇效果。配合设计师的导出图，前端使用序列帧即可实现动画效果。

![序列帧](../Img/Web图形/css3序列帧.png)

帧动画的缺点和局限性比较明显，导出图文件大，且在不同屏幕分辨率下可能会失真。

### JS

通过**JS**方法控制`DOM`，从而实现动画效果

### GIF

关于这个不想多废话了！！！

### canvas/svg

> 首先说明这篇文章不是在叙述`canvas/svg`的用法，所以并不过多赘述。

`js + canvas/svg` 应该是目前前端实现复杂动效的最优方案了，但要注意`canvas`和`svg`二者之间区别，根据不同使用场景选取最优的实现方案。

### Lottie 重点来了o(*￣▽￣*)ブ

> Lottie一个适用于[Web](https://github.com/airbnb/lottie-web)，[Android](https://github.com/airbnb/lottie-android)，[iOS](https://github.com/airbnb/lottie-ios)，[React Native](https://github.com/airbnb/lottie-react-native)和[Windows](https://aka.ms/lottie) 的移动库，它可以使用`Bodymovin`解析以`json`格式导出的**Adobe After Effects**动画，并在移动设备上进行本地渲染！

#### 安装

关于lottie的用法，在网上可以查到很多，今天我们要说的是`vue  + lottie-web`

```js
npm install lottie-web
```
ps：如果是vue-cli3.x 或 4.x 可以直接通过 vue ui 通过搜索安装
（以下是个人认为比较优雅的使用方案）

```vue
<template>
    <div class="box">
        <div id="lottie_box"></div>
        <button @click="startFun">播放</button>   
        <button @click="suspendFun">暂停</button>   
    </div>
</template>

<script>
import lottie from 'lottie-web';

export default {
    name:'Lottie',
    data(){
        return{
            lottie:{},  
        }
    },
    methods:{
        suspendFun:function(){
            this.lottie.pause();
        },
        startFun:function(){
            this.lottie.play()
        }
    },
    mounted(){
        this.lottie = lottie.loadAnimation({
            container: document.getElementById('lottie_box'),
            renderer: 'svg',
            loop: true,
            path: 'https://labs.nearpod.com/bodymovin/demo/markus/halloween/markus.json'
        })
    }
}
</script>

<style>
    .box{
        width: 100%;
        height: 100%;
    }
    #bm{
        width: 100%;
        height:100%;
        margin: 0px auto;
    }
</style>
```

#### 基本用法

```js
const animation = lottie.loadAnimation({
    container: document.getElementById('box'),
    renderer: 'svg',        // 渲染方式:svg：支持交互、不会失帧、canvas、html：支持3D，支持交互
    loop: true,             // 循环播放，默认：true
    autoplay: true,         // 自动播放 ，默认true
    path: ''                // json 路径
})
```

#### 常用方法

- `animation.play()`：播放，从当前帧开始播放

- `animation.stop()`：停止，并回到第**0帧**

- `animation.pause()`：暂停，并保持当前帧

- `animation.goToAndStop(value, isFrame)`：跳到某个**时刻/帧**并停止

    > `isFrame`（默认:`false`，表示**毫秒**）指示`value`是**帧**还是**毫秒**

- `animation.goToAndPlay(value, isFrame)`：跳到某个**时刻/帧**并播放

    ```js
    animation.goToAndStop(30, true)     // 跳转到第30帧并停止
    animation.goToAndPlay(300)          // 跳转到第300毫秒并播放
    ```

- `animation.playSegments(arr, forceFlag)`：以帧为单位，播放指定片段

    > `arr`可以包含两个**数字**或者两个数字组成的**数组**，`forceFlag`表示是否立即强制播放该片段

    ```js
    animation.playSegments([10,20], false)          // 播放完之前的片段，播放10-20帧
    animation.playSegments([[0,5],[10,18]], true)   // 直接播放0-5帧和10-18帧
    ```

- `animation.setSpeed(speed)`：设置播放**速度**，`speed`为**1**表示正常速度

- `animation.setDirection(direction)`： 设置播放**方向**，**1**表示正向播放，**-1**表示反向播放

- `animation.destroy()`： 删除该动画，移除相应的元素标签等。

    > 在`unmount`的时候，需要调用该方法

#### 常用钩子

- `data_ready`：动画数据加载完毕

    ```js
    animation.addEventListener('data_ready', () => { console.log('(*^_^*)'); });
    ```

- `config_ready`：完成初始配置后

- `data_failed`：当无法加载动画的一部分时

- `loaded_images`：当所有图像加载成功或错误时

- `DOMLoaded`：将元素添加到`DOM`时