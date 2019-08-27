#####元素筛选
```
nextAll()           /*后边全部元素*/
prevAll()           /*前边所有元素*/
children()          /*子元素*/
parent()            /*父元素（向上找一级）*/
parents()           /*父元素（全部父元素）*/
siblings()          /*兄弟元素*/
.replace(/<\/s>/g,"")	       /*正则表达式删除是指定字符</s> ,\为在转义字符*/
ul>li:nth-child(n)            /*n可以是数字、even(奇)、odd(偶)、公式（2n-1）等*/
input[type="checkbox"]       /*标签[属性名='属性值']*/
input[type="radio"]:checked	/*复选框选中*/
option:selected		       /*下拉列表选中的 option*/
```
#####input复选框是否选中
```
$("input").is(":checked")        /*返回 true/false*/
$("input").prop('checked')      /*返回 true/false*/
$("input").attr('checked')     /*返回 xx/undefined 属性判断，需添加checked 属性*/
```
#####css样式
```
border: 1px dashed #F00		    /*边框为虚线*/
letter-spacing  			    /*字间距*/
border-spacing: 0;			    /*去掉表格边距*/
resize:none ;    		        /*<textarea>右下角隐藏*/
outline:none;  				    /*输入框点击时边框隐藏*/
background: url() no-repeat  	/*【左右】px 【上下】px;*/
text-decoration:none;		    /*去掉下划线*/
cursor: pointer;			    /*鼠标变成手*/
calc(100% - 500px)		       /*css 宽高计算*/
/*css属性设置元素的垂直对齐方式*/
vertical-align:middle/text-bottom/text-top/bottom……	
/*:hover可操纵该元素及其子元素，若想操作不相关两种元则要用 :hover+*/
:hover(:hover)		
```
#####设置宽高比
```
width:100%;
height:0;
overflow:hidden;
padding-bottom:31.25%;
```
或者（可能存在兼容性）
```
width:100%;
height:31.25vw;
```
#####flex布局
写在父元素上，子元素会居中
```
display: flex;	            		/*定位（写在父元素中）*/
justify-content:center;     	  /*水平居中*/
align-items:Center;	        	/*垂直居中 */
```
#####文字超出隐藏
单行文本溢出显示省略号
```
overflow: hidden;               /*把超出的内容进行隐藏*/
white-space: nowrap;          /*设置内容不换行*/
text-overflow: ellipsis;    /*设置超出内容为省略号*/
```
多行文本溢出显示省略号
```
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;     /*设置行数*/
-webkit-box-orient: vertical;
```
文字超出换行
```
word-break:break-all;     /*写一个就可以*/
word-wrap:break-word；
```
#####三角制作方法(利用边框的宽度去实现)
```
border-top: 50px solid transparent;
border-bottom: 50px solid transparent;
border-right: 50px solid red;/*箭头背景颜色，使其颜色与整体颜色一致*/
border-left: 50px solid transparent;  
```
说明：transparent—>透明色
  画三角的时候，省略对边（画左三角，不用写右边）；
 边宽即为三角宽
外层div不要设置高（设置就设成0，或等边宽）
宽最好设成0
#####checkbox选中样式修改
```
input[type="checkbox"]{
    width:15px;
    height:15px;
    border-radius: 5px;
    display: inline-block;
    text-align: center;
    vertical-align: middle; 
    line-height: 18px;
    position: relative;
}
input[type="checkbox"]::before{
    content: "";
    position: absolute;
    top: -2px;
    left: 0;
    background: #fff;
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
}
input[type="checkbox"]:checked::before{
    content: "\2713";
    background-color: #3498DB;
    position: absolute;
    top: -2px;
    left: 0;width:100%;
    border: 1px solid #3498DB;
    color:#fff;
    font-size: 14px;
    font-weight: bold;
}
```
#####其它
```
accept="image/*"					 //input只能上传图片
accept="image/gif, image/jpeg"      //限制图片类型
placeholder="输入你想说的话"         //提示文字
字符串.split("字符[串]")			  //把字符串切割成数组
$(window).resize(function() { }); //窗口大小改变
$('#content_box').load('/mana/weekly/write_admin.html');	//引入html页面
<input type="datetime-local">	 //input-->data兼容性替换
window.location.reload();		//刷新页面
blur						   //失去焦点事件
```
#####回车执行
```
$(document).keyup(function(event){
    if(event.keyCode ==13){
        $("#login").trigger("click");
    }
});
```
#####获取url参数
方法1：
```
//方法封装
function GetRequest() { 
    //获取url中"?"符后的字串 
	var url = location.search; 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
	      var str = url.substr(1); 
	      strs = str.split("&"); 
	      for(var i = 0; i < strs.length; i ++) { 
		theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
	      } 
	} 
	return theRequest; 
} 
// 方法调用
var Request = new Object(); 
Request = GetRequest(); 
var urlCan = Request['参数名'];   
```
方法2：
```
function getUrlParam(key) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}
//调用
getUrlParam("参数名");
```
#####双层ul展开
```
function liLa_title(e){
    if($(e).find("ul").css("display")=="none"){
        $(e).find("ul").slideUp("slow");
        $(e).find("ul").slideDown("slow");
    }else{
        $(e).find("ul").slideUp("slow");
        $(e).find("ul").find("ul").slideUp("slow");
    }
}
```
#####文字颜色渐变
```
p{
    /*渐变背景*/
    background-image: -webkit-linear-gradient(
        left, 
        #3498db, 
        #f47920 10%, 
        #d71345 20%, 
        #f7acbc 30%,
        #ffd400 40%, 
        #3498db 50%, 
        #f47920 60%, 
        #d71345 70%, 
        #f7acbc 80%, 
        #ffd400 90%, 
        #3498db
    );
    /*文字填充色为透明*/
    color: transparent; 
    -webkit-text-fill-color: transparent;
     /*背景剪裁为文字，只将文字显示为背景*/
    -webkit-background-clip: text;         
    /*背景图片向水平方向扩大一倍，这样background-position才有移动与变化的空间*/
    background-size: 200% 100%;            
    /* 动画调用*/
    animation: masked-animation 4s infinite linear;
}
/*动画*/
@keyframes masked-animation {
    0% {
        /*background-position 属性设置背景图像的起始位置。*/
        background-position: 0 0;   
    }
    100% {
        background-position: -100% 0;
    }
}
```
#####点击定位（滚动条滚动）
```
function scrollToLocation() {
    var mainContainer = $('#thisMainPanel'),
    //滚动到<div id="thisMainPanel">中类名为son-panel的最后一个div处
    scrollToContainer = mainContainer.find('.son-panel:last');
    //滚动到<div id="thisMainPanel">中类名为son-panel的第六个处
    scrollToContainer = mainContainer.find('.son-panel:eq(5)');
    //非动画效果
    mainContainer.scrollTop(
     scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop()
    );
    //动画效果
    mainContainer.animate({
        scrollTop: scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop()
    }, 2000);//2秒滑动到指定位置
}
```
#####JQ事件绑定
```
// 拿到所有的a标签，全部绑定事件，并且自动解决浏览器兼容问题
$("a").on("click", removerItem);
// 解除绑定事件
$("a").off()
// 拿到按钮标签
$("#id").on("click", addItem)
//例
$("#cut_right").on("click",function (){})
```
 注意:jqery绑定事件的时候 \$(this)代表当前的标签，通过$(this)就可以实现给多个标签绑定相同事件，达到可以操作当前点击的标签;如果不使用jQuery，原生js需要使用this.getArrribute('ga')可以获得当前点击的标签的ga属性的值
#####JQ动画
```
$("div").animate({left:'250px'});
```
#####input日期修改
```
::-webkit-datetime-edit // 控制编辑区域的
::-webkit-datetime-edit-fields-wrapper // 控制年月日这个区域的
::-webkit-datetime-edit-text // 这是控制年月日之间的斜线或短横线的
::-webkit-datetime-edit-month-field // 控制月份
::-webkit-datetime-edit-day-field // 控制具体日子
::-webkit-datetime-edit-year-field // 控制年文字, 如2017四个字母占据的那片地方
::-webkit-inner-spin-button // 这是控制上下小箭头的
::-webkit-calendar-picker-indicator // 这是控制下拉小箭头的
::-webkit-clear-button //这是控制清除按钮的
```
#####兼容性写法
```
-webkit-		 /* Safari 和 Chrome */
-moz-		/* Firefox */
-o-		/* Opera */
```
