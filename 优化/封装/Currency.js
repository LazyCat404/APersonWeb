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
 * 2019/9/25
 */
//防抖（函数名，[延迟时间]）
function debounce(hander,delay){
    if(delay == undefined){ 
        delay = 300;    //如果不传入延迟时间，默认300ms
    }
    var timer = null;   //定时器变量
    return function(){
        var _this = this, _arg = arguments;
        clearTimeout(timer);
        timer = setTimeout(function (){
            hander.apply(_this,_arg);
        },delay);
    }
}

//节流（函数名，[等待时间]）
function throttle(handler,wait){
    if(wait == undefined){ 
        wait = 800;    //如果不传入等待时间，默认1000ms
    }
    var lastTime = 0;   //上次执行时间
    return function(){
       var nowTime = new Date().getTime();
       if(nowTime - lastTime > wait){   //超过等待时间
           handler.apply(this,arguments);
           lastTime = nowTime;  
       }
    }
}

/**
 * 第三部分：可变（根据不同需求封装的方法可能存在变化）
 * 2019/9/25
 */

 //拖拽（需要拖动的元素，活动范围元素）
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