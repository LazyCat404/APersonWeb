/**
 * H5 history api ：
 *      history.pushState 添加浏览器历史记录
 *      history.replaceState 修改浏览器历史记录中当前记录
 *      history.popState history发生变化时出发
 */

/**
 * hash 模式
 */

// 定义 Router 
class Router {
    constructor(){
        this.routes = {}; // 存放路由path 及 callback
        this.currentUrl = '';

        // 监听路由change调用对应路由回调
        window.addEventListener('load',this.refresh,false);
        window.addEventListener('hashchange',this.refresh,false);
    }
    route(path,callback){
        this.routes[path] = callback;
    }
    push(path){
        this.routes[path] && this.routes[path]();
    }
}


/**
 * history 模式
 */

// 定义 Router
class Router {
    constructor() {
        this.routes = {};
        this.listerPopState()
    }
    init(path){
        history.replaceState({path:path},null,path);
        this.routes[path] && this.routes[path]();
    }
    route(path,callback){
        this.routes[path] = callback;
    }
    path(path){
        history.pushState({path:path},null,path);
        this.routes[path] && this.routes[path]();
    }
    listerPopState(){
        window.addEventListener('popstate',e => {
            const path = e.state && e.state.path;
            this.routes[path] && this.routes[path]();
        })
    }
}

// 使用 Router

window.userRouter = new Router();   // 创建实例

userRouter.route('/page1',() => { console.log('当前 Page1') });     // 监听
userRouter.push('/page2');  // 跳转