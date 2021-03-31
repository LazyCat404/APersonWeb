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
            // 存起来
            tokens.push(['text',words]);
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
                tokens.push(['text',words]);
            }
        }
        // 越过 }} 现在指针已经移除双大括号
        scanner.scan('}}');
    }
    return nextTokens(tokens);
} 