import lookup from './lookup';
import renderTemplate from './renderTemplate';
/**
 * 处理数组，结合renderTemplate 实现递归
 * 这个函数要递归调用renderTemplate函数，调用多少次，由data决定
 * @param { Array } token 只一个简单的数组，例如：['#','xx',[]]
 * @param { * } data 模板数据
 * @return 
 */
export default function parseArray(token,data) {
    // 得到整体数据中，需要使用的部分
    let v = lookup(data,token[1]);
    // 结果字符串
    let resultStr = '';
    if(v){
        v.forEach(item => {
            // 简单数组['小明','小红'] 不再是a.b 而是一个 . 表示每一项的本身
            // 因此,这里要补一个 . 属性
            resultStr += renderTemplate(token[2],{
                ...item,
                '.':item
            });
        });
    }
    return resultStr;
};