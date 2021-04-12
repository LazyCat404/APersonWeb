/**
 * 在object 对象中存照用连续 . 符号的keyName 属性
 * 例子：
 * let data = {
 *    a:{
 *       b:{
 *           c:100
 *       }
 *    }
 * }
 * 那么 lookup(data,'a.b.c')  结果就是100
 * @param { Object } dataObj  数据
 * @param { String } keyName  连续调用
 * @returns 调用结果
 */
export default function lookup(dataObj,keyName=''){
    //  判断keyName 中有没有 . , 但是不能是 . 本身
    if(keyName.indexOf('.') != -1 && keyName != '.'){
        // 拆成数组
        let keys = keyName.split('.');
        // 临时变量，一层层向下找
        let temp = dataObj;
        keys.forEach(item => {
            // 每找到一层，就把它设置为新的临时变量
            temp = dataObj[item];
        })
        return temp;
    }
    // 没有.
    return dataObj[keyName];
}