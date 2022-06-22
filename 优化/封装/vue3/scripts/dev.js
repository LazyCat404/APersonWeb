const minimist = require('minimist')
const execa = require('execa')
const args = minimist(process.argv.slice(2))

// 获取打包参数
const target = args._.length ? args._[0] : 'reactivity' 
const format = args.f || 'global'
const sourcemap = args.s || false


execa('rollup',[
    '-wc',
    '--environment',
    [
        `TARGET:${target}`,
        `FORMAT:${format}`,
        sourcemap?`SOURCE_MAP:true`:''
    ].filter(Boolean).join(',')
],{
    stdio:'inherit' // 将输出打印在当前命令行
}) 