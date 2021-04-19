import parse from './parse';

/**
 * 将模板Dom编译为抽象语法树，生成h函数
 */

let templateString = `
    <div>
        <h3 class="aa bb cc" id="dd">你好！</h3>
        <ul>
            <li>A</li>
            <li>B</li>
            <li>C</li>
        </ul>
    </div>
`;

const ast = parse(templateString);
console.log(ast);