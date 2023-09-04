/**
 * 发布-订阅 模式，收集依赖
 */
var uid = 0;
export default class Dep{
    constructor(){
        this.id = uid++;
        // 用数据存储自己的订阅者，其实这里存放的就是watcher实例
        this.subs = [];
    }
    // 添加订阅
    addSubs(sub){
        this.subs.push(sub);
    }
    // 添加依赖
    depend(){
        // target 是自定义的一个全局变量，这里使用window.target也行，也就是说只要全局唯一，没有歧义即可
        if(Dep.target){
            this.addSubs(Dep.target);
        }
    }
    // 通知更新
    notify(){
        // 浅克隆一份
        const subs = this.subs.slice();
        for(let i = 0,l = subs.length;i < l;i++){
            subs[i].update();
        }
    }
}