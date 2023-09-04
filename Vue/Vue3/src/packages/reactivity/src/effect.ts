/**
 * 默认执行一次
 * 数据更新再次执行
 */
// effect(()=>{
//     state.name1
//     effect(()=>{
//         state.name2
//     })
//     state.name3
// })
// effect1 = name1,name3
// effect2 = name2

let effectStack:any[] = [];   // 存储effect 和 属性 之间正确的映射关系
let activeEffect:any;   // 当前活跃的 effect

/**
 * 解绑effect-dep
 * @param effect 
 */
function cleanupEffect(effect:any){
    const {deps} = effect;
    for(let dep of deps){
        dep.delete(effect); // 移除属性对应的effect
    }
}
export class ReactiveEffect{
    active = true   // this.active = active
    deps = [];  // 让effect记录它依赖了那些属性，同时记录当前属性依赖了哪个effect
    constructor(public fn:Function,public scheduler?:Function){    // this.fn = fn

    }
    run(){  // 调用 run 会执行 fn
        if(!this.active){   // 非激活状态，不会执行fn
            return this.fn()
        }
        if(!effectStack.includes(this)){    // 避免同一个effect 重复执行
            try{
                effectStack.push(activeEffect = this)
                return this.fn()   // 取值 new Proxy 会执行get 方法（依赖收集）
            }finally{
                effectStack.pop();  // 删除（栈中的）最后一个
                activeEffect = effectStack[effectStack.length - 1]  // 重新赋值当前活跃的effect
            }
        }
    }
    stop(){ // 停止响应式：effect 和 dep 取消关联
        if(this.active){
            cleanupEffect(this)
            this.active = false;
        }
    }
}

// 判断是否依赖effect
export function isTracking(){
    return activeEffect !== undefined
}

const tragetMap = new WeakMap();
/**
 * effect 收集： 一个属性对应多个effet，一个effect中依赖了多个属性->多对多
 * @param target 
 * @param key 
 */
export function track(target:object,key:string | symbol){
    // 对象只有通过effect进行操作，才收集
    if(isTracking()){
        let depsMap = tragetMap.get(target);    // 一开始肯定是没有的
        if(!depsMap){
            tragetMap.set(target,(depsMap = new Map()));
        }
        let dep = depsMap.get(key);
        if(!dep){
            depsMap.set(key,(dep = new Set()));  
        }
        trackEffects(dep);
    }else{
        return
    }
}
// 收集dep
export function trackEffects(dep:any){
       // 一个属性多次取用，只收集一次
    let shouldTrack = !dep.has(activeEffect);   // 是否需要收集：判断属性是否被收集过
    if(shouldTrack){
        dep.add(activeEffect);
        activeEffect.deps.push(dep)
    }
}


/**
 * effect 触发
 * @param target 
 * @param key 
 */
export function trigger(target:object,key:string | symbol){
    let depsMap = tragetMap.get(target)
    if(depsMap){
        let deps = [];  // [set,set]
        if(key !== undefined){
            deps.push(depsMap.get(key))
        }
        let effects = [];
        for(const dep of deps){
            effects.push(...dep)
        }
        triggerEffects(effects)
    }else{
        return; // 说明修改的属性没有依赖任何的effect
    }
}
// 执行收集到的effect
export function triggerEffects(dep:any){
    for(const effect of dep){
        // 如果当前的effect执行和要执行的effect是同一个，不要执行，防止循环
        if(effect !== activeEffect){
            // 如果有自定义的调度函数，则执行自定义
            if(effect.scheduler){
                return effect.scheduler();
            }
            effect.run()    // 执行effect
        }
    }
}

/**
 * 响应式：取值时收集值对应的effect，改值时执行对应的effect
 * @param fn 
 * @returns effect.run 方法，调用该方法可以使effect 重新执行
 */
export function effect(fn:Function){
    const _effect = new ReactiveEffect(fn);
    _effect.run();

    let runner = _effect.run.bind(_effect);
    /**
     * 在runner 添加一个_effect属性，即对应的响应式effect实例   
     * 实例上存在stop()方法，调用runner._effect.stop()停止响应式
     */
    (runner as any)._effect = _effect; 

    return runner;
}

// 先将effect放到全局 -> 取属性时 -> 会让属性收集这个effect（属性-effect 形成映射关系）
// 数据变化后重新执行属性对应的effect方法