# [fs - 文件系统](http://nodejs.cn/api/fs.html)

> 要知道浏览器中的 JS 是没有文件处理能力的。<br>
  文件模块引入： <br>
  `const fs = require('fs');`

### 读文件

```js
const fs = require('fs');   // 引入fs模块

// 读文件
fs.readFile('./xxx/xxx.xx',function(err,data){
    if(err){
        console.log("读取文件失败！");  //可能文件不存在   
    }else{
         console.log("读取文件成功：",data.toString());   //若不toString()则读到的是二进制->十六进制的字符
    }
})
```
![](../Img/Node/node读文件.png)

### 写文件

> 这里的写文件方法呢，是将原文件内容**覆盖**，并不是追加内容

```js
const fs = require('fs');   // 引入fs模块

//写文件
fs.writeFile('./xxx/xxx.xx','写入内容',function(err){
    if(err){
        console.log("写入文件失败！");  //可能有错误字符
    }else{
        console.log("写入文件成功！");   
    }
})
```

### 目录读取

```js
fs.readdir(path,function(err,files){});  //读取目录
fs.rmdir(path,function(err){}); //删除空目录（不能删除文件），如果目录下有文件则无法删除
```