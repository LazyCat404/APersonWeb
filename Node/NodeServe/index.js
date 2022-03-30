const http = require('http');   //引入http模块
const fs = require('fs');
const path=require('path');
let server = http.createServer();

server.on('request',function(req,res){ 
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.setHeader("Access-Control-Allow-Origin","*");
    var url = decodeURI(req.url);
    console.log('收到客户端请求，请求地址：', url);
    fs.readdir('./www',function(err){
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
                        fs.readdir('./www',(err,dir) => {
                            if(dir.length === 0){
                                res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                res.end('暂未指定默认资源！');
                            }else{
                                let defaultFile = false // 是否有index 文件
                                for(let i = 0;i<dir.length;i++){
                                    if(path.basename(`/${dir[i]}`,path.extname(dir[i])) === 'index'){
                                        defaultFile = true;
                                        fs.readFile(`./www/${dir[i]}`,function(err,data){
                                            if(err){
                                                res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                                res.end(`文件读取失败!`);
                                            }else{
                                                let type = path.extname(dir[i]);
                                                res.setHeader("content-type",`${ContentType[type]};charset=UTF-8`);
                                                res.end(data);
                                            }
                                        });
                                        return;
                                    }
                                }
                                if(!defaultFile){
                                    res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                    res.end('暂未指定默认资源!');
                                }
                            }
                        })
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
                            // 没有扩展名，
                            fs.readdir(`./www${url}`,(err,fileList) =>{
                                if(err){
                                    // 查看上一级目录有没有同名文件 
                                    let a = path.resolve(`./www${url}`, '..')
                                    fs.readdir(a,(er,file)=>{
                                        if(er){
                                            res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                            res.end('未找到资源文件夹!');
                                        }else{
                                            let sameName = false // 是否有同名文件
                                            for(let i=0;i<file.length;i++){
                                                if(path.basename(`/${file[i]}`,path.extname(file[i])) === path.basename(`${url}`,path.extname(file[i]))){
                                                    sameName = true
                                                    fs.readFile(`./www/${url}${path.extname(file[i])}`,function(e,data){
                                                        if(e){
                                                            res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                                            res.end('文件读取失败!');
                                                        }else{
                                                            let type = path.extname(file[i]);
                                                            res.setHeader("content-type",`${ContentType[type]};charset=UTF-8`);
                                                            res.end(data);
                                                        }
                                                    });
                                                    return
                                                }
                                            }
                                            if(!sameName){
                                                res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                                res.end('未找到资源文件夹!');
                                            }
                                        }  
                                    })
                                }else{
                                    if(fileList.length === 0){
                                        res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                        res.end('该路径下暂无资源');
                                    }else{
                                        let defaultFile = false // 是否有index 文件
                                        for(let i = 0;i<fileList.length;i++){
                                            if(path.basename(`/${fileList[i]}`,path.extname(fileList[i])) === 'index'){
                                                defaultFile = true;
                                                fs.readFile(`./www/${url}/${fileList[i]}`,function(err,data){
                                                    if(err){
                                                        res.setHeader("content-type",`${ContentType['.html']};charset=UTF-8`);
                                                        res.end(`文件读取失败!`);
                                                    }else{
                                                        let type = path.extname(fileList[i]);
                                                        res.setHeader("content-type",`${ContentType[type]};charset=UTF-8`);
                                                        res.end(data);
                                                    }
                                                });
                                                return;
                                            }
                                        }
                                        if(!defaultFile){
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