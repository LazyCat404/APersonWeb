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
        wait = 1000;    //如果不传入等待时间，默认1000ms
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

 //1. Promise 应用

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

/**
 * 2. Promise 函数分装
 * 特点：
 *      ① new Promise(),必须传参数，切必须为 function,否则报错
 *      ② 传入的函数（参数），立即执行
 *      ③ pending => resolved/rejected
 *      ④ Promise 对象调用then(fn1,fn2)
 *      ⑤ then 返回Promise对象，可链式调用
 *      ⑥ 链式调用，后一个then的状态取决于前一个then返回的状态(可以这样理解)     
 */
function myPromise(fn){
    if(typeof(fn) !== 'function'){  //①
        throw Error(`Promise resolver ${fn} is not a function`);
    }
    let self = this;
    this.status = 'pending'; //模拟Promise 状态，默认是 pending 
    this.data = null;
    this.resolvedArr = []   //将当前状态存取，模拟异步
    this.rejectedArr = [];
    function resolved(data){
        setTimeout(function(){
            if(self.status == 'pending'){   //状态改变后不可在变
                self.status = 'resolved';
                self.data = data;
                self.rejectedArr.forEach(fn => fn())
            }
        },0)
    };  
    function rejected(err){
        setTimeout(function(){  //将下面执行放到事件执行队列尾部
            if(self.status == 'pending'){   //状态改变后不可在变
                self.status = 'rejected';
                self.data = err;
            }
        },0)
    };
    fn(resolved,rejected); // ②
}
myPromise.prototype.then = function(onResolved,onRejected){
    let self = this;
    if(this.status == 'resolved'){
        return new myPromise(function(resolved,rejected){   //⑤
            var res =  onResolved(self.data)
            if(res instanceof myPromise){   // 如果res是 myPromise 对象
                res.then(resolved,rejected)
            }else{
                resolved(res)
            }
        })
    };
    if(this.status == 'rejected'){
        return new myPromise(function(resolved,rejected){   //⑤
            var res =  onRejected(self.data)
            if(res instanceof myPromise){   // 如果res是 myPromise 对象
                res.then(resolved,rejected)
            }else{
                resolved(res)
            }
        })
    };
    if(this.status == 'pending'){
        return new myPromise(function(resolved,rejected){   //
            self.rejectedArr.push((function(onResolved){    //闭包
                return  function(){ 
                        var res =  onResolved(self.data)
                        if(res instanceof myPromise){   // 如果res是 myPromise 对象
                            res.then(resolved,rejected)
                        }else{
                            resolved(res)
                        }
                }
            })(onResolved))

            self.rejectedArr.push((function(onRejected){    //闭包
                return  function(){ 
                        var res =  onRejected(self.data)
                        if(res instanceof myPromise){   // 如果res是 myPromise 对象
                            res.then(resolved,rejected)
                        }else{
                            resolved(res)
                        }
                }
            })(onRejected))
        })
    }
}
