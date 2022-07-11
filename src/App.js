import "./App.css";
import routes from "./router";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import React, { Suspense, useEffect } from "react";
//页面显示前loading
import RouteLoading from "./componments/RouteLoading";
import { onPageShow } from "./componments/KeepAlive";

export default function App() {
  // const routeElements = useRoutes(routes);
  // const route = routes[0];
  const location = useLocation();
  useEffect(() => {
    onPageShow("*", () => {
      console.log(location.pathname);
    });
  }, []);
  return (
    // <div className="App">
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/*重定向路由，根据是否登录重定向到登录页面或者首页*/}
        <Route path="/" element={<Navigate to="/main/tabpage1" />} />
        {routes.map((route) => (
          <Route
            path={route.path}
            key={route.path}
            element={<route.component route={route} />}
          />
        ))}
      </Routes>
      {/*<div className="App">{routeElements}</div>*/}
    </Suspense>
    // {/*</div>*/}
  );
}
