import Dep from "./Dep";

let uid = 0;
export default class Watcher {
    /**
     * 监听数据变化，该类有vue主程序引用，即，用到数据的地方都可以引用watcher（diff、指令等）
     * @param {*} target 监听对象
     * @param {*} expression 对象表达式，例如：a.b.c
     * @param {*} callback 回调函数
     */
    constructor(target,expression,callback){
        this.id = uid++;
        this.target = target;
        this.getter = parsePath(expression); 
        this.callback = callback;
        this.value = this.get();
    }
    update(){
        this.run();
    }
    get(){
        //让全局的Dep.target设置为Watcher本身，进入依赖收集阶段 
        Dep.target = this;
        const obj = this.target;
        let value;
        // 只要能找到，就一直找
        try{
            value = this.getter(obj);
        }finally{
            // 退出依赖收集阶段
            Dep.target = null;
        }
        return value;
    }
    run(){
        this.getAndInvoke(this.callback);
    }
    getAndInvoke(cb){
        const value = this.get();
        if(value !== this.value || typeof value == 'object'){
            const oldValue = this.value;
            this.value = value;
            cb.call(this.target,value,oldValue);
        }
    }
}
/**
 * 根据字符串表达式，获取对象对应值
 * @param {String} srt 'a.b.c' 
 * @returns 对象对应表达式的值
 */
function parsePath(srt){
    let segments = srt.split('.');
    return (obj => {
        for(let i = 0;i<segments.length;i++){
            if(!obj) return;
            obj = obj[segments[i]];
        }
        return obj;
    })
}