import Watcher from './observer/Watcher';

export default class Compiler{
    /**
     * 模板编译
     * @param {*} el 挂载点
     * @param {*} vue vue 实例
     */
    constructor(el,vue){
        // vue 实例
        this.$vue = vue;
        // 挂在点
        this.$el = document.querySelector(el);
        // 如果挂在点存在
        if(this.$el){
            // 调用函数，让节点变为fragment,相当于mustache中的Tokens，Vue实际是AST,这里轻量级的选择使用fargment
           let $fragment = this.node2Fragment(this.$el);
            // 编译    
           this.compiler($fragment); 
            // 替换好的内容渲染到DOM树
            this.$el.appendChild($fragment);
        }
    }
    node2Fragment(el){
        /**
         * 菜鸟地址：https://www.runoob.com/jsref/met-document-createdocumentfragment.html
         * createDocumentFragment() 会创建一个虚拟节点
         */
        var fragment = document.createDocumentFragment();
        var child;
        // 让所有DOM 节点，都进入fragment
        while(child = el.firstChild){
            fragment.appendChild(child);
        }
        return fragment;
    }
    compiler(el){
        let _this = this;
        let childNodes = el.childNodes;
        // 双大括号模板正则
        let reg = /\{\{(.*)\}\}/;   
        childNodes.forEach(node => {
            let text = node.textContent
            if(node.nodeType == 1){     // 节点类型
                _this.compilerElement(node);
            }else if(node.nodeType == 3 && reg.test(text)){   // 文字类型，模板
                let name = text.match(reg)[1];
                _this.compilerText(node,name)
            }
        })
        
    }
    /**
     * 节点编译 - 指令分析
     * @param {Dom} node 真正的dom节点对象 
     */
    compilerElement(node){
        let _this = this;
        // 节点属性列表（类数组）
        let nodeAttrs = node.attributes;
        // 将类数组对象变为数组(也可以使用扩展运算符 => ...)
        Array.prototype.slice.call(nodeAttrs).forEach(attr => {
            // arr 为节点的每一个属性，由此，我们可以进行指令分析
            let attrName = attr.name;   // 属性名
            let attrValue = attr.value; // 属性值
            // 判断是否是指令，v- 开头
            if(attrName.indexOf('v-') == 0){
                // 指令都是以 v- 开头，所以从第二个字符开取，得到指令
                let dir = attrName.substring(2);
                // 不同指令的判断及处理
                if(dir == 'model'){
                    new Watcher(this.$vue,attrValue,(value) => {
                        node.value = value
                    });
                    // 将模板内获取到的值绑定到节点
                    let v = _this.getVueValue(_this.$vue,attrValue);
                    node.value = v;
                    // 监听input 节点
                    node.addEventListener('input',e => {
                        let newVal = e.target.value;
                        // 将修改的值绑定到节点上
                        _this.setVueValue(_this.$vue,attrValue,newVal);
                        v = newVal;
                    })
                }else if(dir == 'for'){
                    console.log('监听到指令：for')
                }else if(dir == 'if'){
                    console.log('监听到指令：if')
                }
            }
        })
    }
    /**
     * 文本 - 模板编译
     * @param {String} node 文本节点（字符串）
     * @param {String} name 模板内容 
     */
    compilerText(node,name){
        node.textContent = this.getVueValue(this.$vue,name);
        new Watcher(this.$vue,name, (value) => {
            node.textContent = value
        });
    }
    /**
     * 从vue实例中获取对应的值
     * @param {*} vue vue 实例
     * @param {*} exp 数据获取字符
     * @returns 数据值
     */
    getVueValue(vue,exp){
        let val = vue;
        exp = exp.split('.');
        exp.forEach(k => {
            val = val[k];
        });
        return val;
    }
    /**
     * 修改对应值
     * @param {*} vue vue 实例
     * @param {*} exp 数据获取字符
     * @param {*} value 设置的新值
     */
    setVueValue(vue,exp,value){
        let val = vue;
        exp = exp.split('.');
        exp.forEach((k,i)=> {
            if(i < exp.length-1){
                val = val[k];
            }else{
                val[k] = value;
            }
        });
    }
}