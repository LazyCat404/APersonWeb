import Compiler from "./Compiler";
import observe from './observer/observe';
import Watcher from './observer/Watcher';

export default class Vue{
    constructor(options){
        this.$options = options || {};
        // 数据
        this._data = options.data || undefined;
        // 数据要变为响应式
        observe(this._data);
        this._initData();
        this._initComputed();
        this._initWarch();
        // 模板编译
        new Compiler(options.el,this);
    }
    _initData(){
        let _this = this;
        Object.keys(this._data).forEach(key => {
            Object.defineProperty(_this,key,{
                get(){
                    return _this._data[key];
                },
                set(newValue){
                    _this._data[key] = newValue;
                }
            })
        })
    }
    _initComputed(){

    }
    // 数据监听
    _initWarch(){
        let _this = this;
        let watch = this.$options.watch;
        Object.keys(watch).forEach(key => {
            new Watcher(_this,key,watch[key]);
        })
    }
}