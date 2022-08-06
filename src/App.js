import "./App.css";
import routes from "./router";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import React, { useEffect } from "react";
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
  );
}
