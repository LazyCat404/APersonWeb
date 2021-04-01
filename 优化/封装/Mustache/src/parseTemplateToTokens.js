import Scanner from './Scanner';
import nextTokens from './nextTokens';
/**
 * 将模板字符串变为 tokens 数组
 * @param { String } templateStr 
 */
export default function parseTemplateToTokens(templateStr) {
    let tokens = [];
    let scanner = new Scanner(templateStr);
    let words;
    while(!scanner.eos()){
        /**
         * 收集标记出现之前的文字
         */ 
        // 创建一个标记
        words = scanner.scanUtil('{{');
        if(words != ''){
            // 去掉空格,判断普通文字空格,还是标签内空格,标签内空格不能去掉(如:标签属性)
            let isInTag = false;    // 默认不在标签内
            let _words = '';        // 删除空格后的字符串
            for(let i = 0;i < words.length;i++){
                // 判断空格位置
                if(words[i] == '<'){
                    isInTag = true;
                }else if(words[i] == '>'){
                    isInTag = false;
                }
                // 当前字符不是空格,直接拼上
                if(!/\s/.test(words[i])){
                    _words += words[i];
                }else{  
                    if(isInTag){    // 是空格且在标签内,在拼上空格,其他情况不拼,间接删掉了空格
                        _words += ' ';
                    }
                }
            }
            // 存起来
            tokens.push(['text',_words]);
        }
        // 越过 {{ 现在指针已经来到双大括号内了
        scanner.scan('{{');
        /**
         * 收集第一个标记（{{ ），到下一个标记（}}）之间的文字，即 data 字段
         */ 
        // 重新创建标记
        words = scanner.scanUtil('}}'); 
        if(words != ''){
            // words 为双大括号中间的字符
            if(words[0] == '#'){
                // 存起来，从下表为1 的项开始存，因为下标为0的是#
                tokens.push(['#',words.substring(1)]);
            }else if(words[0] == '/'){
                tokens.push(['/',words.substring(1)]);
            }else{
                tokens.push(['name',words]);
            }
        }
        // 越过 }} 现在指针已经移除双大括号
        scanner.scan('}}');
    }
    return nextTokens(tokens);
} 