const path = require('path'); // 导入 node.js 中专门操作路径的模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html

module.exports = {
    // 指定构建模式：开发模式
    mode: 'development', 
    // 打包入口文件的路径
    entry: path.join(__dirname, './src/index.js'), 
    devtool: 'inline-source-map',
    // 配置html页面显示（必须要配置这个才能运行后直接显示出页面）
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './www/index.html', //指定要用到的模板文件
            filename: 'index.html' //生成在目录中
        })
    ],
    // 输出路径
    output: {
        path: path.join(__dirname, './dist'), // 输出文件的存放路径
        filename: 'bundle.js', // 输出文件的名称
    },
    devServer: {
        compress: true,
        port: 9000,
    },
}