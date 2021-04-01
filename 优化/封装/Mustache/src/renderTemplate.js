import lookup from './lookup';
import parseArray from './parseArray';

/**
 * 让tokens数组变为dom字符串
 * @param { Array } tokens  符合dom结构的数组
 * @param { * } data 模板数据
 * @return 转成dom后的字符串
 */

export default function renderTemplate(tokens,data) {
    // console.log(tokens);
    // 结果字符串
    let resultStr = '';
    tokens.forEach(item => {
        if(item[0] == 'text'){
            resultStr += item[1];
        }else if(item[0] == 'name'){
            // 如果是name类型，那么就直接使用它的值，调用lookup 防止出现'a.b.c'的形式
            resultStr += lookup(data,item[1]);
        }else if(item[0] == '#'){   // # 标记需要递归处理下标为2的子数组
            resultStr += parseArray(item,data);
        }
    });
    return resultStr;
}