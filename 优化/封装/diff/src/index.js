import h from './h';
import patch from './patch';


var myVnode = h('ul',{},[
    h('li',{key:1},'小明'),
    h('li',{key:2},'小强'),
]);
var myVnode2 = h('ul',{},[
    h('li',{key:1},'小明'),
    h('li',{key:3},'阿猫'),
    h('li',{key:2},'小强'),
    h('li',{key:4},'阿狗'),
]);
var myVnode5 = h('ul',{},[
    h('li',{key:1},'小明'),
    h('li',{key:2},'小强'),
    h('li',{key:3},'阿猫'),
    h('li',{key:4},'阿狗'),
]);

var myVnode6 = h('ul',{},[
    h('li',{key:7},'小明'),
    h('li',{key:2},'小强'),
]);



var myVnode7 = h('ul',{},[
    h('li',{key:1},'A'),
    h('li',{key:2},'B'),
    h('li',{key:3},'C'),
    h('li',{key:4},'D'),
]);

var myVnode8 = h('ul',{},[
    h('li',{key:4},'D'),
    h('li',{key:3},'C'),
    h('li',{key:2},'B'),
    h('li',{key:1},'A'),
]);

var myVnode9 = h('ul',{},[
    h('li',{key:'A'},'小明'),
    h('li',{key:'B'},'小强'),
    h('li',{key:'K'},'阿猫啊啊'),
    h('li',{key:'C'},'阿猫'),
    h('li',{key:'D'},'阿狗'),
]);

var myVnode10 = h('ul',{},[
    h('li',{key:'A'},'小明'),
    h('li',{key:'B'},'小强'),
    h('li',{key:'C'},'阿猫'),
    h('li',{key:'D'},'阿狗'),
]);







var myVnode1 = h('h1',{},'Hello Word!')
var myVnode3 = h('h1',{},'你好！')

var myVnode4 = h('h1',{},h('p',{},'你好'))




const container = document.getElementById('container'); 

patch(container,myVnode10);

const btn = document.getElementById('btn');

btn.onclick = function () {
    // patch(myVnode,myVnode2);
    patch(myVnode10,myVnode9);
}
