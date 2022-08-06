# 基于react- router-dom6的路由缓存
## 安装
### `npm i react-router-dom6-keepalive`
## 导入
```js
import KeepAlive from "react-router-dom6-keepalive"
```
## 使用方法
### h5形式
```js
import KeepAlive from "react-router-dom6-keepalive"
//路由配置
const routeElements = useRoutes(routes);
//配置tabBar页面，tabBar页面会一直缓存，pop它也不会销毁。其它页面pop后就会销毁。达到类似微信小程序的路由效果。
const alwaysCacheRouts = useMemo(
  () => [
    "/main/tabpage4",
    "/main/tabpage3",
    "/main/tabpage2",
    "/main/tabpage1",
  ],
  []
);
<Router>
  <div className="App">
    <KeepAlive isPopDelete={true}
               alwaysCacheRouts={alwaysCacheRouts}
               isNeedSuspense
               SuspenseLoading={<RouteLoading />}>
      {routeElements}
    </KeepAlive>
  </div>
</Router>
```
#### 效果：
![image](https://github.com/ponyorange/react-router-dom6-keepalive/blob/master/demoGif/h5.GIF?raw=true)
### 管理端Admin形式
```js
import KeepAlive from "react-router-dom6-keepalive"
//路由配置
const routeElements = useRoutes(routes);

<Router>
  <div className="App">
    <KeepAlive maxLen={10} 
               isNeedSuspense 
               SuspenseLoading={<RouteLoading />}
               exclude={['/path1','/path2']}>
      {routeElements}
    </KeepAlive>
  </div>
</Router>
```
```
参数说明： 
maxLen -- 最大缓存上线，超过就会删除第一个缓存
exclude -- 黑名单路由。配置哪些页面不需要缓存，除此之外所以页面都缓存。
include -- 白名单路由。配置哪些页面需要缓存，除此之外所以页面都不缓存。

###！！注意！！###
1、不配置黑白名单默认所有路由都缓存。
2、黑白名单只能配置其中一个，两个都配置了默认使用白名单。
```
#### 效果：
![image](https://github.com/ponyorange/react-router-dom6-keepalive/blob/master/demoGif/admin.GIF?raw=true)

### 生命周期使用
#### 导入
```js
//在需要使用生命周期的页面导入，如监听某个缓存页面的显示和隐藏。
import { onPageHiden, onPageShow } from "react-router-dom6-keepalive";
```
#### 使用
```js
//当前页面的路由
const pathName = useLocation().pathname;;
useEffect(() => {
  onPageShow(pathName, () => {
    console.log(pathName, "显示了");
  });
  onPageHiden(pathName, () => {
    console.log(pathName, "隐藏了");
  });
}, []);
```
#### 移除钩子
```js
import { removeKeeAliveHook } from "react-router-dom6-keepalive";
removeKeeAliveHook(pathname,type);
//参数说明：
//pathname -- 哪个页面的生命周期，如'/path1'，
//type -- 那种类型的钩子，可选："show"、"hiden"。默认："show"
```
### KeepAlive 参数说明：
```
  exclude -- 路由黑名单，isPopDelete = false生效。
  include -- 路由白名单，isPopDelete = false生效。
  activeName -- 当前展示的是哪个路由。默认使用当前页面路由，大多数情况下不用传。
  isPopDelete -- 返回上一页时是否删除当前页面缓存。默认false
  alwaysCacheRouts -- 配置总是缓存的页面。isPopDelete = true生效。
  maxLen -- 最大缓存上限。
  isNeedSuspense -- 是否需要处理路由懒加载，默认false。
  SuspenseLoading -- 处理路由懒加载时对应的loading，默认<div>loading</div>。
```
## 注意事项：

* #### 1、不要传入内部带有重定向逻辑判断的组件，这样会导致无限重定向。

比如你想做路由鉴权，可能你会写一个鉴权的高阶组件，如下：RequireAuth.jsx

```js
//路由鉴权
import { isAuth } from "../../utils/auth";
import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  if (!isAuth()) {
    return (
      <Navigate to="/main/user/login" replace />
    );
  }

  return children; // 验证通过，显示页面
}
```
然后鉴权路由这样配置：route.js
```js
const routes=[
  ...,
  {
    path:  "/main/user/rent",
    element: (
      <RequireAuth>
        <Rent />
      </RequireAuth>
    )
  },
  ...
]
exports default routes
```
RequireAuth组件可能会返回一个重定向组件，这样配置路由，路由缓存时会导致无限重定向。

可以把路由鉴权逻辑放到route.js，保证传给路由缓存组件内部没有重定向可能。如：
```js
import { isAuth } from "../../utils/auth";

const routes=[
    ...,
  {
    path: "/main/user/rent",
    //在外面做鉴权，这样缓存组件可以处理重定向。
    element: isAuth() ? <Rent /> : <Navigate to="/main/user/login" replace />
  },
   ...
]
exports default routes
```
* #### 2、如果你使用了路由懒加载，外部不需要嵌套Suspense组件了，给keepAlive组件传入isNeedSuspense={true}即可，keepAlive组件会处理路由懒加载。如：
```js
//正确示例 😊
<KeepAlive
          alwaysCacheRouts={alwaysCacheRouts}
          isPopDelete={true}
          isNeedSuspense
          SuspenseLoading={<RouteLoading />}
        >
          {RouteEle}
</KeepAlive>
```

```js
//错误示例 ❌
<Suspense fallback={<RouteLoading />}>
  <KeepAlive
    alwaysCacheRouts={alwaysCacheRouts}
    isPopDelete={true}
    isNeedSuspense
    SuspenseLoading={<RouteLoading />}
  >
    {RouteEle}
  </KeepAlive>
</Suspense>
```
