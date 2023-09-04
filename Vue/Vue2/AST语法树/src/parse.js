import parseAttrStr from './parseAttrStr';
/**
 * @param {String} templateString 模板字符串
 */
export default function parse(templateString){
    // 先简单去掉首尾空字符串
    let tempStr =templateString.trim()
    // 指针
    let index = 0;
    // 剩余部分（永远检测剩余部分）
    let rest = '';
    // 开始标记: <div>、<h1> ……
    let startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/; 
    // 结束标记：</div>、</h1> ……
    let endRegExp = /^\<\/([a-z]+[1-6]?)\>/; 
    // 抓取 开始-结束 前的文字（暂时不考虑 结束-开始 之间的文本）
    let wordRegExp = /^([^\<]+)\<\/([a-z]+[1-6]?)\>/;
    // 准备两个栈（vue 源码一个栈）
    var stack1 = [];    // 标签栈
    var stack2 = [{children:[]}];    // 内容栈
    while (index < tempStr.length -1){
        // 每次循环修改剩余部分，剩余部分，为指针所在位置到字符串最后
        rest = tempStr.substring(index);
        // 检测是否为开始标签
        if(startRegExp.test(rest)){
            // 捕获标签
            let tag = rest.match(startRegExp)[1];
            // 捕获属性
            let attrStr = rest.match(startRegExp)[2];
            // console.log('检测到开始标记：',tag)
            // 检测到开始标记，将标记推入stack1
            stack1.push(tag);
            // 同时推入一个预设对象到stack2中
            stack2.push({
                tag:tag,
                children:[],
                attr:parseAttrStr(attrStr)
            });
            // 属性字符串长度
            const attrStrLength = attrStr ? attrStr.length : 0;
            // 指针移动标签长度+属性长度，在加2，是因为<>占位
            index += tag.length + attrStrLength + 2;
        }else if(endRegExp.test(rest)){
            let tag = rest.match(endRegExp)[1];
            // console.log('检测到结束标记：',tag)
            // 检测到结束标记tag，tag 一定与 stack1 栈顶相同
            let pop_tag = stack1.pop(tag);
            if(tag == pop_tag){
                // 出栈
                let pop_arr = stack2.pop(tag);
                if(stack2.length > 0){
                    stack2[stack2.length - 1].children.push(pop_arr);
                }
            }else{
                throw new Error(`${stack1[stack1.length -1]} 标签没有闭合`);
            }
            // 指针移动标签长度，加3是因为</>占位
            index += tag.length + 3;
        }else if(wordRegExp.test(rest)){
            let word = rest.match(wordRegExp)[1];
            // 捕获的字符串内容不能全为空
            if(!/^\s+$/.test(word)){
                // console.log('检测文字：',word);
                // 改变内容栈，压入文本
                stack2[stack2.length - 1].children.push({
                    text:word,
                    type:3
                })
            }
            // 指针移动文本长度
            index += word.length;
        }else{
            // 标签内容（文本）
            index++;
        }
    }
    return stack2[0].children[0];
}