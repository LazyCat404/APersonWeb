/**
 * 
 * @param {String} attrStr dom 熟悉 组成的字符串
 * @returns 属性拆成 name-value 形式返回的对象 
 */
export default function parseAttrStr(attrStr){
    // 如果没有属性直接返回
    if (attrStr == undefined) return [];
    // 判断当前字符是否在引号内
    let isYinhao = false;
    // 断点
    let point = 0;
    // 结果数组
    let result = [];
    for(let i = 0;i < attrStr.length;i++){
        let char = attrStr[i];
        if(char == '"'){
            isYinhao = !isYinhao;
        }else if(char == ' ' && !isYinhao){
            if(!/^\s*$/.test(attrStr.substring(point,i))){
                // 遇到空格,并且不在引号内(这里不考虑单引号)
                result.push(attrStr.substring(point,i).trim());
                point = i;
            }
        }
    }
    // 循环结束之后,最后还剩一个属性
    result.push(attrStr.substring(point).trim());
    // 根据 等号 将属性拆分
    result = result.map(item => {
        const o = item.match(/^(.+)="(.+)"$/);
        return {
            value:o[1],
            name:o[2],
        }
    })
    return result
}