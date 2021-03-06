/**
 * 第一部分：兼容性
 * 2019/9/23
 * 注释括号内是需要传入的实参
 * [实参] 表示该实参可不传
 */

 //滚动条位置 
function getScrollOffset(){
    if(window.pageXOffset){
        return{
            x : window.pageXOffset,
            y : window.pageYOffset
        }
    }else{
        return{
            x : document.body.scrollLeft + document.documentElement.scrollLeft,
            y : document.body.scrollTop + document.documentElement.scrollTop
        }
    } 
}

/**
 * 第二部分：实用
 * 创建：2019/9/25
 * 更新：2020/7/28
 */
//防抖（函数名，[延迟时间]）
function debounce(handler,delay = 300){ //如果不传入延迟时间，默认300ms
    var timer = null;   //定时器变量
    return function(){
        var _this = this;
        var _arg = arguments;   // 参数列表
        clearTimeout(timer);    // 清除定时器
        timer = setTimeout(function (){
            handler.apply(_this,_arg);
        },delay);
    }
}

//节流（函数名，[等待时间]）
function throttle(handler,wait = 1000){ // 如果不传入等待时间，默认1000ms
    var lastTime = 0;   // 上次执行时间
    return function(){
       var nowTime = +new Date();   // 当前执行时间戳
       var _this = this;
       var _arg = arguments;   // 参数列表
       if(nowTime - lastTime > wait){   // 超过等待时间则执行
            handler.apply(_this,_arg);
            lastTime = nowTime;  
       }
    }
}

// 累加求和（柯里化，参数长度不固定）
function add(){
    let _args = Array.prototype.slice.call(arguments);  // 将（不定）参数转化为数组对象
    let _adder = function (){
        _args.push(...arguments);
        return _adder;
    }
    // toString 隐形转换特性
    _adder.toString = function() {
        return _args.reduce(function(a,b){  // reduce方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
            return a + b;
        },0)
    }
    return _adder;
}
add(1,2,3);     
add(1)(2)(3);

// rgb 转 16进制 （"rgb(255,255,255)"）
function getHexColor(rgb) {
    if(rgb.r){  //ps：（参数）也可以是对象格式  
        var r = rgb.r,
            g = rgb.g,
            b = rgb.b;
        return '#' +
            ('0' + r.toString(16)).slice(-2) +
            ('0' + g.toString(16)).slice(-2) +
            ('0' + b.toString(16)).slice(-2)
    }else{
        var color = rgb.split(',');
        var r = parseInt(color[0].split('(')[1]);
        var g = parseInt(color[1]);
        var b = parseInt(color[2].split(')')[0]);
        var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    };
}

// 日期增加 x 天（'2020-07-28',增加天数n）
function getNewData(dateTemp, days) {  
    var dateTemp = dateTemp.split("-");  
    var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]); //转换为MM-DD-YYYY格式    
    var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);  //-days 则表示减n天
    var rDate = new Date(millSeconds);  
    var year = rDate.getFullYear();  //年
    var month = rDate.getMonth() + 1;  //月
    if (month < 10) {   // 1-9 月前边加0
        month = "0" + month; 
    } 
    var date = rDate.getDate();  //日
    if (date < 10){ // 1-0 号前边加0
        date = "0" + date; 
    }  
    return (year + "-" + month + "-" + date);  
}

// 计算两个日期相差天数（'2020-07-28','2020-08-28'）
function  getDaysBetween(date1,date2){
    var  startDate = Date.parse(date1);
    var  endDate = Date.parse(date2);
    var days = (endDate - startDate)/(1*24*60*60*1000);
    return  days;
}

// 判断数据类型
function getType(target) {
    //先处理最特殊的Null
    if (target === null) {
        return "null";
    }else{
        const type = typeof(target);
        //判断是不是基础类型
        if (type !== "object") {
            return type;
        }else{
            const typeStr = Object.prototype.toString.call(target); //此方法可以准确判断数据类型
            const template = {
                "[object Object]": "object",
                "[object Array]": "array",
                // 可能是包装类
                "[object String]": "string",
                "[object Number]": "number",
                "[object Boolean]": "boolean",
              };
            return template[typeStr];
        }
    }
}

/**
 * 第三部分：可变（根据不同需求封装的方法可能存在变化）
 * 2019/9/25
 */

//拖拽（需要拖动的元素(记得要设置position)，活动范围元素）
function bindEvent(ele,wrap){
    //分成三个步骤 down -- movw -- up
    var X,  //鼠标落下点的x坐标
        Y,  //鼠标落下点的y坐标
        boxL,   //初始时box的left的值（改变left 和 top 就可以改变box位置）
        boxT,   //初始时box的top的值
        disL,   //box停下时的left的值
        disT;   //box停下时的top的值
    var drag = false;   //是否进行拖拽(监控)
    ele.onmousedown = function(e){
        drag = true;
        var event = e || window.event;//为了兼容IE
        X = event.clientX;
        Y = event.clientY;
        boxL = ele.offsetLeft;
        boxT = ele.offsetTop;
        disL = X - boxL;
        disT = Y - boxT;
    };
    wrap.onmousemove = function(e){
        var event = e || window.event;//为了兼容IE
        if(drag){
            ele.style.left = event.clientX - disL + 'px';
            ele.style.top = event.clientY - disT + 'px';
        }
    };
    ele.onmouseup = function(){
        drag = false;
    };
}
/**
 * 第四部分：其它
 * 2019/11/12
 */

// 1. Promise 应用

//图片加载（图片地址）
const loadUrl = url => new Promise((rejected,resolved) => {
    let img = new Image()
    img.onload = () => resolved(img)    // 图片成功加载
    img.onerror = () => rejected(new Error('can not load image at' + url))  //图片加载失败
    img.src = url
})

// ajax
const myAjax = (type = 'GET',data = {},url) =>{
    new Promise((resolved,rejected) => {
        $.ajax({
            type,
            url,
            data,
            success:data => resolved(data),
            error:err => rejected(err)
        })
    })
}

// 2. 指针 - 相关算法

/**
 * 寻找字符串中连续最多的字符串
 * @param {String} str  需要查找的字符串
 */
function repeatStr(str) {
    // 两个指针（数组下标）
    let i = 0;
    let j = 0;
    while(i <= str.length - 1){
        // 当两个指针对应字符不相同时，说明重复结束，将 i 指针移动到 j 位置
        if(str[i] != str[j]){
            console.log(`${i}到${j}文字相同！都是${str[i]}，重复了${j - i}次!`);
            i = j;
        }
        // j 指针后移 
        j++;
    } 
}
/**
 * 在递归实现斐波那序列的基础上，添加缓存的思想，提高效率
 * @param {Number} num 
 */
{
    // 缓存对象（类数组）
    let cache = {};
    function fib(num){
        if(cache.hasOwnProperty(num)){
            // 从缓存中直接获取数据
            return cache[num];
        }else{
            // 没有缓存，将结果加入缓存
            let v = (num == 1 || num == 2) ? 1 : fib(num - 1) + fib(num - 2);
            cache[num] = v;
            return v;
        }
    }
    // 测试
    console.log(fib(9))
}   
/**
 * 将高维数组转为对象
 * @param {Array Number String} item 
 * @returns 
 */
 function convert(item) {
    if(typeof item == 'number' || typeof item == 'string'){
        return{
            value:item
        }
    }else if(Array.isArray(item)){
        return {
            children:item.map(val => convert(val))
        }
    }
}