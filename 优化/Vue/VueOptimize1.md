# Vue性能优化详解（一）

>本文主要从代码层面对vue项目性能优化进行总结

### 1.v-if 和 v-show 区分场景使用
`v-if`真正的条件渲染，也就说，当值为假的时候，不做DOM渲染。
`v-show`则是利用`display:none`来控制DOM显示。当需要频繁更新DOM时，尽量使用后者。
### 2.computed 和 watch
`computed`计算属性，依赖其它属性值，只有它依赖的属性值发生改变，才会重新计算，并且有缓存。当我们需要进行数值计算，并且依赖于其它数据时，可以利用计算属性的缓存特性，避免每次获取值时，都要重新计算。
`watch`监听回调，每当监听的数据变化时都会执行回调进行后续操作。当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，它允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。
### 3.避免同时使用v-for 和 v-if
`v-for`比`v-if`优先级高，如果每一次都需要遍历整个数组，将会影响速度，尤其是当之需要渲染很小一部分的时候，必要情况下应该替换成 computed 属性。
```
//推荐
<ul>
  <li
    v-for="user in activeUsers" //遍历计算属性
    :key="user.id">
    {{ user.name }}
  </li>
</ul>
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
     return user.isActive //筛选后用于计算
    })
  }
}
//不推荐
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id">
    {{ user.name }}
  </li>
</ul>
```
### 4.长列表优化
Vue 会通过`Object.defineProperty`对数据进行劫持，来实现视图响应数据的变化，但当一个组件只是用于数据的展示，那么不需要 Vue 进行数据，当数据过大时，能够很明显的减少组件初始化的时间。我们可以通过`Object.freeze`方法来冻结一个对象，一旦对象被冻结就再也不能被修改了。
```
export default {
  data: () => ({
    users: {}
  }),
  async created() { //声明一个异步函数
    const users = await axios.get("/api/users");
    this.users = Object.freeze(users);
  }
};
```
### 5.事件销毁
Vue 组件销毁时，会自动清理它与其它实例的连接，解绑它的全部指令及事件监听器，但这仅限于组件本身的事件。如果在 js 内使用`addEventListene`等方式绑定事件，是不会自动销毁的，这就需要在组件销毁时手动移除这些事件的监听，以免造成**内存泄露**。
```
created() {
  addEventListener('click', this.click, false)
},
beforeDestroy() {
  removeEventListener('click', this.click, false)
}
```
### 6.图片资源懒加载
当图片资源过多，为了加速页面加载，我们可以暂时先不加载那些不出现在可视区域的图片，等需要展示的时候在进行加载。
①使用`v-lazyload`插件：
```
//安装插件
npm install vue-lazyload --save-dev
//在入口文件main.js 中引入并使用
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
//或者添加自定义选项
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dist/loading.gif',
  attempt: 1
})
```
②在 vue 文件中将 `<img>`的`src`属性直接改为`v-lazy`，从而将图片显示方式更改为懒加载显示。
```
<img v-lazy="图片地址">
```
### 7.路由懒加载
vue 是单页面应用，也就是说在进入首页时会加载全部资源，当加载的资源过多时，页面可能会出现**白屏**的情况，不利于用户体验。因此，我们可以把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，更加高效。这样做会大大提高首屏显示的速度，但是可能其它的页面的速度就会降下来。
```
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component:resolve => require(['./views/Home.vue'],resolve),
        }
    ]
})
```
### 8.无限列表性能优化
当页面中需要展示很多列表时，过去我们会通过分页的方式来展现，它能够足够保证高性能和适当的内存使用，但页面的切换会**打断用户的浏览连贯性**，同时也会增加用户的**等待时间**。因此现在流行的长列表加载方式，即当用户将滚到页面底部时，就会通过`ajax`请求下一页的内容，然后渲染到页面上，从而实现**无缝**的浏览体验(网络不佳除外)。但这种方式也有致命的缺点，用户不断浏览时，**页面上的列表节点就越来越多，内存的使用就会大大提升，性能也就跟着下降**。
解决办法：
```
vue-virtual-scroll-list
//或
 vue-virtual-scroller
```
### 9.SSR（服务端渲染）【具体实现略】
**服务端渲染**:指 Vue 在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的 html 片段直接返回给客户端这个过程就叫做服务端渲染。
①优点：
-更好的 SEO：因为 SPA（单页应用程序） 页面的内容是通过 ajax 获取，而搜索引擎爬取工具并不会等待 ajax 异步完成后再抓取页面内容，所以在 SPA中是抓取不到页面通过 ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面。
-首屏加载更快：SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间。
②缺点：
-更多的开发条件限制：例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且需要处于 `Node.js server `运行环境；
-更多的服务器负载：在 `Node.js`中渲染完整的应用程序，显然会比仅仅提供静态文件的`server`占用更多的CPU 资源。
### 10.预渲染【具体实现略】
如果一个项目只需**改善少数页面的SEO**，可以使用**预渲染**的方式实现。即在构建时（`build`）简单地生成**针对特定路由**的静态 HTML 文件。
优点是**设置简单**，并且可以将前端作为一个完全静态的站点，具体可以使用`prerender-spa-plugin`就可以轻松地添加预渲染 。
### 11.第三方插件按需引入（略）

#### [下一篇](VueOptimize2.md)