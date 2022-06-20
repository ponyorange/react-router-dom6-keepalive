import { Navigate } from "react-router-dom";
import { lazy } from "react";

import withRouter from "./withRouter"; //给组件包装路由

//一级路由
const RouterController = withRouter(lazy(() => import("./RouterController")));
//二级路由
const Main = withRouter(lazy(() => import("../pages/Main")));
const TabPage1 = withRouter(lazy(() => import("../pages/TabPage1")));
const TabPage2 = withRouter(lazy(() => import("../pages/TabPage2")));
const TabPage3 = withRouter(lazy(() => import("../pages/TabPage3")));
const TabPage4 = withRouter(lazy(() => import("../pages/TabPage4")));

const Page1 = withRouter(lazy(() => import("../pages/Page1")));
const Page2 = withRouter(lazy(() => import("../pages/Page2")));

export default (function () {
  return [
    //重定向
    {
      path: "/",
      element: <Navigate to="/main/tabpage1" />,
    },
    {
      path: "/main",
      element: <Navigate to="/main/tabpage1" />,
    },
    {
      path:'/',
      element: <RouterController />,
      children: [
        {
          path: "main",
          element: <Main />,
          children: [
            {
              path: "tabpage1",
              element: <TabPage1 />,
            },
            {
              path: "tabpage2",
              element: <TabPage2 />,
            },
            {
              path: "tabpage3",
              element: <TabPage3 />,
            },
            {
              path: "tabpage4",
              element: <TabPage4 />,
            },
          ],
        },
        {
          path: "page1",
          element: <Page1 />,
        },
        {
          path: "page2",
          element: <Page2 />,
        }
      ]
    }
  ];
})();
