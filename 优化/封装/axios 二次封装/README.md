# axios 二次封装说明

### 自定义axios实例

> 利用`axios.create()`创建新的`axios` 实例，传入参数实现个性化配置。

- `myAxios()` 具备`axios`全部能力的基础上，接受一个参数自定义配置选项（`customOptions`）参数，目前仅引用该参数，方便后续功能扩展

- 重复请求移除、错误拦截等均以实现，可以根据业务需要进行修改


### 请求方法二次封装

> 所有请求均返回`Promise`对象

封装后的方法，通过简要参数就可以明确 **请求参数**、**请求参数类型**、**返回值类型** 

- **请求参数** 只能做为第二个参数，第一个参数是请求地址！其它参数顺序不做要求

- **请求参数** 的类型需配合注释查看

```js
import { post } from './axios'
let url= 'http://rap2api.taobao.org/app/mock/286373/put'

let obj = {}

// 以下写法无区别
post(url,obj,'blob','query').then(res =>{}) 
post(url,obj,'query','blob').then(res =>{})

// form-data
post(url,obj,'data').then(res =>{})  // 不需要特意转换obj 为form-data，回自动转为form-data

// 上传文件，将文件对象直接放在数组、对象或者直接作为参数传递即可，会自动识别文件，进行上传

```

### 待开发功能

1. 上传回调：实时获取上传进度

2. 切片上传

3. 手动取消

4. 返回值类型：目前仅支持`blob`，用于下载

5. ……

