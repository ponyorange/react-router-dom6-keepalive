import React, { Suspense, useMemo } from "react";
import RouteLoading from "../../componments/RouteLoading";
import KeepAlive from "../../componments/KeepAlive";
import { ViewProvider } from "../../hooks/useView";
import { useRoutes } from "react-router-dom";
import NetFail from "../../pages/404";

//生成路由对象数组
function makeRouteObject(routes, dispatch) {
  if (routes) {
    return routes.map((route) => {
      return {
        path: route.path,
        name: route.name,
        meta: route.meta,
        element: (
          <ViewProvider value={{ name: route.name }}>
            <route.component name={route.name} dispatch={dispatch} />
          </ViewProvider>
        ),
        children: route.children
          ? makeRouteObject(route.children, dispatch)
          : undefined,
      };
    });
  }
}
// function mergePtah(path, paterPath = "") {
//   // let pat = getGoto(path)
//   path = path.startsWith("/") ? path : "/" + path;
//   return paterPath + path;
// }
function getLatchRouteByEle(ele) {
  const data = ele?.props.value;
  return !data.outlet ? data.matches : getLatchRouteByEle(data.outlet);
}

function RouterController(props) {
  const { route } = props;
  // 生成子路由,递归
  const routeObject = useMemo(() => {
    if (route.children) {
      return makeRouteObject(route.children, null);
    }
    return [];
  }, [route?.children]);
  // 匹配 当前路径要渲染的路由
  const ele = useRoutes(routeObject);
  // 计算 匹配的路由name
  const matchRouteObj = useMemo(() => {
    if (!ele) {
      return null;
    }
    const matchRoute = getLatchRouteByEle(ele);
    if (!matchRoute) {
      return null;
    }
    const selectedKeys = matchRoute.map((res) => {
      return res.route.name;
    });
    const laseMatchRoute = matchRoute[matchRoute.length - 1];
    const data = laseMatchRoute.route;
    return {
      key: laseMatchRoute.pathname ?? "",
      title: data?.meta?.title ?? "",
      name: data?.name ?? "",
      selectedKeys,
    };
  }, [ele]);
  return (
    <>
      <Suspense fallback={<RouteLoading />}>
        {matchRouteObj ? (
          <KeepAlive activeName={matchRouteObj?.key} isAsyncInclude>
            {ele}
          </KeepAlive>
        ) : (
          //路由匹配不到，去404页面
          <NetFail />
        )}
      </Suspense>
    </>
  );
}

export default RouterController;
