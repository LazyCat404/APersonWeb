# Vue性能优化详解（二）

>本文主要从Webpack角度讲述vue性能优化。

### 1. Webpack 对图片进行压缩
如果静态图片资源过多，**打包后文件过大**，则会出现**过度占用内存、带宽**等问题。
主要利用`image-webpack-loader`插件
```
//安装插件
npm install image-webpack-loader --save-dev
```
安装好之后需要在`webpack.base.conf.js`中进行配置（略），但是对于cli3.x隐藏了`webpack.base.conf.js`文件，因此我们需要在`vue.config.js`下进行配置：
```
module.exports={
    //chainwebpack<=>configurewebpack
    chainWebpack: config => { 
        // 图片压缩
        config.module.rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/) //匹配文件名，也可以省略
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({bypassOnDebug: true})
    },  
}
```
此外还可以对`js`、`css`甚至是`json`等静态资源利用`compression-webpack-plugin`插件进行压缩。
配置如下：
```
const CompressionPlugin = require("compression-webpack-plugin")
module.exports={
    publicPath: './',
    configureWebpack: config => {
        // 文件压缩
        if (process.env.NODE_ENV === 'production') {
            //为生产环境修改配置
            config.plugin('compressionPlugin')
            .use(new CompressionPlugin({
                test:/\.js$|\.html$|.\css/, // 匹配文件名
                threshold: 10240, // 对超过10k的数据压缩
                deleteOriginalAssets: false // 不删除源文件
            }))
        }else{
            // 为开发环境修改配置
        }
    },  
}
```
ps:这样做打包后的文件并不会减小多少甚至变大（因为未删除源文件，多了压缩包），具体使用可以去网上查找相关资料，也可以等等，后续应该会出相关的文。
### 2. 减少 ES6 转为 ES5 的冗余代码
`Babel`插件会在每个输出文件中内嵌这些依赖的辅助函数代码，如果多个源代码文件都依赖这些辅助函数，那么这些辅助函数的代码将会出现很多次，造成**代码冗余**。为了不让这些辅助函数的代码重复出现，可以在依赖它们时通过`require('babel-runtime/helpers/createClass')`的方式导入，这样就能做到只让它们出现一次。
```
//安装插件
npm install babel-plugin-transform-runtime --save-dev
```
修改`.balverc`配置文件，cli3内修改`babel.config.js`文件
### 3. 提取公共代码
如果项目中没有去将每个页面的第三方库和公共模块提取出来，则项目会存在以下问题：
-相同的资源被重复加载，浪费用户的流量和服务器的成本。
-每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。

#### [上一篇](VueOptimize1.md)
#### [下一篇](VueOptimize3.md)