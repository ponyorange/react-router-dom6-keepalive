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
    <Suspense fallback={<RouteLoading />}>
      <div className="App">
        <KeepAlive isPopDelete={true}
                   alwaysCacheRouts={alwaysCacheRouts}>
          {routeElements}
        </KeepAlive>
      </div>
    </Suspense>
</Router>
```
#### 效果：
![image](https://github.com/ponyorange/react-router-dom6-keepalive/blob/master/demoGif/h5.GIF?raw=true)
## 管理端Admin形式
```js
import KeepAlive from "react-router-dom6-keepalive"
//路由配置
const routeElements = useRoutes(routes);

<Router>
    <Suspense fallback={<RouteLoading />}>
      <div className="App">
        <KeepAlive maxLen={10}>
          {routeElements}
        </KeepAlive>
      </div>
    </Suspense>
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
import { onPageHiden, onPageShow } from "../../componments/KeepAlive";
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
### 参数说明：
```
  exclude -- 路由黑名单，isPopDelete = false生效。
  include -- 路由白名单，isPopDelete = false生效。
  activeName -- 当前展示的是哪个路由。默认使用当前页面路由，大多数情况下不用传。
  isPopDelete -- 返回上一页时是否删除当前页面缓存。默认false
  alwaysCacheRouts -- 配置总是缓存的页面。isPopDelete = true生效。
  maxLen -- 最大缓存上限。
```
