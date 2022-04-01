import { post } from './axios'

// let url = '/api/v1/auth/login';
// let par = {
//     username: 'ywj',
//     password: 'a123456',
//     clientType: 'WEB',
// }

// post(url,par,).then(res =>{
//     console.log('请求结果：',res)
// })

let url = '/api/v1/system/userExcel/template';
let dom = document.getElementById('input')
dom.onchange = function(par){
    let fileList = dom.files[0]
    console.log(dom.files[0])
    post(url,fileList).then(res =>{
        console.log('请求结果：',res)
    })
}

// let str = 'frome-data'

// try{
//     str.toLowerCase()
//     console.log(str)
// }catch{
//     console.log('xxx')
// }
