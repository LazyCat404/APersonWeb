import parseTemplateToTokens from './parseTemplateToTokens';
import renderTemplate from './renderTemplate';

window.SSG_TemplateEngine = {
    render(templateStr,data) {
        // 调用 parseTamplateToTokens 函数，让模板字符串变为tokens数组
        let tokens = parseTemplateToTokens(templateStr);
        // 调用 renderTempLate 函数，让tokens数组变为dom字符串
        let domStr = renderTemplate(tokens,data);



    },
}