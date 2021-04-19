import observe from './observe';

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
obj.c.splice(2,1,[88,99]);
console.log(obj.c)