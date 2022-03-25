# 快速构建 Node Serve

> 基础模块引入： <br>
  `const http = require('http');`
  
### 构建 Web 服务器 

```js
const http = require('http');   //引入http模块

let server = http.createServer();
/**
 * 注册 request 请求事件
 * 当客户端请求时，就会自动触发回调函数
 * 回调函数接收两个参数：
 * Request 请求对象
 *      用来获取户端的一些请求信息，如，请求路径
 * Response 相应对象
 *      用来给客户端发送响应消息 
 */
server.on('request',function(req,res){ 
    console.log('收到客户端请求，请求地址：',req.url);
    if(req.url === '/'){
        res.end('首页');    // 向客户端响应并结束，响应数据只能是字符串或二进制数据
    }else if(req.url === '/login'){
        res.write('登录');      // write() 可使用多次，但一定要用 end() 结束
        res.write("用户名、密码");
        res.end();
    }else{
        res.end('404 Not Found'); // 可以将res.end('相应内容'); 理解为一种简写方式
    }
});

//绑定端口号，启动服务器
server.listen(3000,function(){
    console.log('服务器启动成功！');
})
```

* 利用某些工具（VScode 插件）可以快速构建一个Node服务

```js
var http = require('http');
http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');
```

### [Content-Type](https://tool.oschina.net/commons)

PS: 我们已经可以创建一个简单的**Web服务**，但是仍旧存在一些问题，在 `Chrome` 浏览器中，中文会出现乱码（有的浏览器的可能不会乱码），其实这是因为我们在响应请求的时候，没有告诉浏览器的正确的编码格式（浏览器会按照操作系统默认编码格式进行编码）。

```js
res.setHeader('Content-Type','text/plain;charset=utf-8');
/**
 * 针对不同的响应内容，更改 【text/plain】，以达到正确编码
*/
```
- `text/plain`  普通文本

- `text/html`   html格式

- `image/jpeg`  .jpg格式

    - 图片文件不用指定编码格式

- ……

> 到此，可以利用 `fs` 和 `http` 模块，创建服务器并响应 html 页面了

```js
const http = require('http');   //引入http模块
const fs = require('fs');

let server = http.createServer();

server.on('request',function(req,res){ 
    var url = req.url;
    console.log('收到客户端请求，请求地址：',url);
    if(url === '/'){
        fs.readFile('./www/index.html',function(err,data){
            if(err){
                res.end('404 Not Found');
            }else{
                res.end(data);
            }
        });
    }else{
        res.end('404 Not Found');
    }
});

//绑定端口号，启动服务器
server.listen(3000,function(){
    console.log('服务器启动成功！');
})
```
有时候，我们想要通过 url 请求全部的某个路径下的文件，如果按照上边的写法，就显得有些麻烦了，而且当有文件扩展的时候，处理起来也不容易，所以我们有更好的解决办法。

```js
let wwwDir = './';  //也可能是一个绝对路径，或者ip地址什么的
server.on('request',function(req,res){ 
    var url = req.url;
    console.log('收到客户端请求，请求地址：',url);
    let filtePath = 'www/index.html'    //默认显示页
    if(url !== '/'){
        filtePath = url;    //只要不是默认请求路径，就让文件路径=当前请求路径
    };
    fs.readFile(wwwDir + filtePath,function(err,data){
        if(err){
            res.end('404 Not Found');
        }else{
            res.end(data);
        }
    });
});
```

这样似乎还是不太完美，如果我们想知道某个请求目录下可请求的资源列表怎么做呢？

PS：自己写了一个简单的[NodeServe](./NodeServe/index.js)，功能比较单一，作为一个前端自用的简易资源服务器还是可以的(￣▽￣)"