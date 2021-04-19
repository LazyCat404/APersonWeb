import observe from './observe';
import Watcher from './Watcher';    

let obj = {
    a:{
        m:{
            n:5
        }
    },
    b:10,
    c:[1,2,3]
};
// 循环检测
observe(obj);
// obj.c.push(4);
// obj.c.splice(2,1,[88,99]);

// watcher 测试
new Watcher(obj,'a.m.n',(val) => {
    console.log('正在监听，属性已修改：',val)
})
obj.a.m.n = 6;
