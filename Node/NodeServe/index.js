const http = require('http');   //引入http模块
const fs = require('fs');
const path=require('path');
let server = http.createServer();

server.on('request',function(req,res){ 
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.setHeader("Access-Control-Allow-Origin","*");
    var url = decodeURI(req.url);
    console.log('收到客户端请求，请求地址：', url);
    fs.readdir('./www',function(err,dir){
        if(err){
            console.log('读取资源文件夹失败！');
        }else{
            fs.readFile('./utils/mime.json',function(err,data){
                if(err){
                    console.log('ContentType读取失败！');
                }else{
                    // 根据路径,返回静态资源
                    let ContentType = JSON.parse(data.toString())
                    if(url === '/'){
                        res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                        res.end('暂未指定默认资源!');
                    }else{
                        let extName = path.extname(url) || null
                        if(extName){
                          fs.readFile(`./www${url}`,(err,data)=>{
                                if(err){
                                    res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                    res.end('文件读取失败!');
                                }else{
                                    res.setHeader("content-type",`${ContentType[extName]};charset=UTF-8`);
                                    res.end(data);
                                }
                          })
                        }else{
                            fs.readdir(`./www${url}`,(err,fileList) =>{
                                if(err){
                                    res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                    res.end('未找到资源文件夹!');
                                }else{
                                    if(fileList.length === 0){
                                        res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                        res.end('该路径下暂无资源');
                                    }else if(fileList.length === 1){
                                        fs.readFile(`./www${url}/${fileList[0]}`,(err,data)=>{
                                            if(err){
                                                res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                                res.end('文件读取失败!');
                                            }else{
                                                let type = path.extname(fileList[0]);
                                                res.setHeader("content-type",`${ContentType[type]};charset=UTF-8`);
                                                res.end(data);
                                            }
                                        })
                                    }else{
                                        let defFile = false // 是否有index 文件
                                        for(let i = 0;i<fileList.length;i++){
                                            if(path.basename(`/${fileList[i]}`,path.extname(fileList[i])) === 'index'){
                                                defFile = true;
                                                fs.readFile(`./www/${fileList[i]}`,function(err,data){
                                                    if(err){
                                                        res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                                        res.end('文件读取失败!');
                                                    }else{
                                                        let type = path.extname(fileList[i]);
                                                        res.setHeader("content-type",`${ContentType[type]};charset=UTF-8`);
                                                        res.end(data);
                                                    }
                                                });
                                                return;
                                            }
                                        }
                                        if(!defFile){
                                            res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                            res.end('暂未指定默认资源!');
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
        }
    })
});

//绑定端口号，启动服务器
server.listen(3000,function(){
    console.log('服务器启动成功！');
})