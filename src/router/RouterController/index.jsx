import React, { useMemo } from "react";
import RouteLoading from "../../componments/RouteLoading";
import KeepAlive from "../../componments/KeepAlive";
import { useRoutes, Navigate } from "react-router-dom";
import NetFail from "../../pages/404";

//生成路由对象数组
function makeRouteObject(routes, dispatch) {
  if (routes) {
    return routes.map((route) => {
      if (route.path === "tabpage4") {
        return {
          path: route.path,
          name: route.name,
          meta: route.meta,
          element: <Navigate to="/main/tabpage1" />,
          children: route.children
            ? makeRouteObject(route.children, dispatch)
            : undefined,
        };
      } else {
        return {
          path: route.path,
          name: route.name,
          meta: route.meta,
          key: route.path,
          // element: <Navigate to="/" />,
          element: (
            // <ViewProvider value={{ name: route.name }}>
            <route.component name={route.name} dispatch={dispatch} />
            // {/*</ViewProvider>*/}
          ),
          children: route.children
            ? makeRouteObject(route.children, dispatch)
            : undefined,
        };
      }
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
  // console.log(routeObject);
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

  const alwaysCacheRouts = useMemo(
    () => [
      "/main/tabpage4",
      "/main/tabpage3",
      "/main/tabpage2",
      "/main/tabpage1",
    ],
    []
  );
  // console.log("outer==", ele);
  return (
    <>
      {/*<ORSuspense fallback={<RouteLoading />}>*/}
      {/*  <div>{Date.now()}</div>*/}
      {matchRouteObj ? (
        <KeepAlive
          alwaysCacheRouts={alwaysCacheRouts}
          isPopDelete={true}
          isNeedSuspense
          SuspenseLoading={<RouteLoading />}
        >
          {ele}
        </KeepAlive>
      ) : (
        //路由匹配不到，去404页面
        <NetFail />
      )}
      {/*</ORSuspense>*/}
    </>
  );
}

export default RouterController;
