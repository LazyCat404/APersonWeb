/**
 * 折叠topkens，将#和/之间的tokens能够整合起来，作为子项
 * @param { Array } tokens 
 * @returns { Array } 整合之后的数组 
 */

export default function nextToken(tokens) {
    // 结果数组
    let nextedTokens = [];
    // 栈结构，存放小tokens，栈顶（靠近端口的，最新进入的）的tokens数组中当前操作的这个tokens子数组
    let sections = [];
    // 收集器，天生指向nextedTokens结果数字，引用类型值，所以指向的是同一数组
    // 收集器的指向会变化，当遇见#的时候，收集器会指向token的下标为2的新数组
    var collector = nextedTokens;
    for(let i = 0;i < tokens.length;i++){
        let token = tokens[i];
        switch(token[0]){
            case '#':
                // 收集器中放入这个token
                collector.push(token);
                // 压栈（入栈）
                sections.push(token);
                // 收集器要换人，给tokent添加下标为2的项，并且让收集器指向它
                collector = token[2] = [];
                break;
            case '/':
                // 出栈，pop() 会返回数组最后一项（这是刚刚弹出的项）
                let sections_pop = sections.pop();
                // 改变收集器为栈结构队尾那项的下标为2的数组
                collector = sections.length > 0 ? sections[sections.length - 1][2]: nextedTokens;
                break;
            default:
                // 甭管当前的collector是谁，可能是结果nextedTokens，也可能是某个token的下标为2的数组，甭管谁，推入collctor 即可
                collector.push(token);
        }
    }
    return nextedTokens;
}