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

var myVnode1 = h('h1',{},'Hello Word!')
var myVnode3 = h('h1',{},'你好！')

var myVnode4 = h('h1',{},h('p',{},'你好'))




const container = document.getElementById('container'); 

patch(container,myVnode);

const btn = document.getElementById('btn');

btn.onclick = function () {
    // patch(myVnode,myVnode2);
    patch(myVnode,myVnode2);
}
