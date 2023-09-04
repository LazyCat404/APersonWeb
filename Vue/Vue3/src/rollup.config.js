import path from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const packageFormats = process.env.FORMAT && process.env.FORMAT.split(',')
const sourcemap = process.env.SOURCE_MAP

// 根据target 找到要打包得目录
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)    // 打包入口
const resolve = p => path.resolve(packageDir, p)    // 已打包的目录解析文件
const pkg = require(resolve(`package.json`))    // 打包信息
const name = path.basename(packageDir)


const packageConfigs = packageFormats || pkg.buildOptions.format;   // 打包所有文件时,packageFormats可能没有值


const outputConfig = {
    'esm-bundler': {
      file: resolve(`dist/${name}.esm-bundler.js`),
      format: `es`
    },
    'cjs': {
      file: resolve(`dist/${name}.cjs.js`),
      format: `cjs`
    },
    'global': {
      file: resolve(`dist/${name}.global.js`),
      format: `iife`
    },
}

function createConfig(format, output) {
    output.sourcemap = sourcemap
    output.exports = 'named'
    let external = []   // 外部模块不需要打包
    if(format === 'global'){
        output.name = pkg.buildOptions.name
    }else{
        external = [...Object.keys(pkg.dependencies)]
    }
    return {
        input:resolve(`src/index.ts`),
        output,
        external,
        plugins:[
            json(),
            ts(),
            commonjs(),
            nodeResolve()
        ]
    }
}

// 返回数组一次打包
export default packageConfigs.map(format => createConfig(format, outputConfig[format]))