/**
 * 第一部分：兼容性
 * 2019/9/23
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
