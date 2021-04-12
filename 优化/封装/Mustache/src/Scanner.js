/**
 * 扫描器类，切割模板字符串
 */
export default class Scanner {
    constructor(templateStr){
        this.templateStr = templateStr;
        // 指针
        this.pos = 0;
        // 尾巴，指针后边的内容，一开始就是模板字符串原文
        this.tail = templateStr;
    }
    /**
     * 功能弱，就是走过的的指定内容，没有返回值
     * @param { String } tag 结束标记，{{
     */
    scan(tag){
        if(this.tail.indexOf(tag) == 0){
            // tag 有多长，指针后移多少位
            this.pos += tag.length;
            this.tail = this.templateStr.substring(this.pos);
        }
    }
    /**
     * 让指针进行扫描，直到遇见指定内容结束，返回结束之前路过的文字
     * @param { String } stopTag 结束标记，{{
     * @returns { String } 开始到（结束）标记之间的字符串
     */
    scanUtil(stopTag){
        // 记录一下，执行本方法的时候 pos 的值
        const pos_backup = this.pos;
        // 当尾巴的开头不是 stopTag 的时候，就说明还没有扫描到 stopTag
        while(this.tail.indexOf(stopTag) != 0 && !this.eos()){
            // 指针（类似数组下标）一点点向后移动
            this.pos++; 
            // 改变尾巴为从当前指针这个字符串开始，到最后的全部字符（包含指针）
            this.tail = this.templateStr.substring(this.pos);
        }
        return this.templateStr.substring(pos_backup,this.pos); 
    }
    // 指针是否到头，返回布尔值
    eos(){
        return this.pos >= this.templateStr.length;
    }
}