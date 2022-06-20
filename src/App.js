import "./App.css";
import routes from "./router";
import { useRoutes } from "react-router-dom";

import React, { Suspense } from "react";
//页面显示前loading
import RouteLoading from "./componments/RouteLoading";

export default function App() {
  const routeElements = useRoutes(routes);

  return (
    <Suspense fallback={<RouteLoading />}>
      <div className="App">{routeElements}</div>
    </Suspense>
  );
}
