import { lazy } from "react";

import withRouter from "./withRouter"; //给组件包装路由
import withNavigator from "./withNavigator";
// import TabPage1 from "../pages/TabPage1";

//一级路由
const Login = lazy(() => import("../pages/Login"));
const NetFail = lazy(() => import("../pages/404"));
const RouterController = lazy(() => import("./RouterController"));
//二级路由
const Main = lazy(() => import("../pages/Main"));
const TabPage1 = withRouter(lazy(() => import("../pages/TabPage1")));
const TabPage2 = withRouter(lazy(() => import("../pages/TabPage2")));
const TabPage3 = withRouter(lazy(() => import("../pages/TabPage3")));
const TabPage4 = withRouter(lazy(() => import("../pages/TabPage4")));

const Page1 = withNavigator(
  lazy(() => import("../pages/Page1")),
  "Page1"
);
const Page2 = withNavigator(
  lazy(() => import("../pages/Page2")),
  "Page2"
);

export default (function () {
  return [
    //登录页面
    {
      path: "/login",
      component: Login,
      name: "login",
    },
    //404
    {
      path: "/404",
      component: NetFail,
      name: "404",
    },
    //首页
    {
      path: "/*",
      component: RouterController,
      name: "app",
      children: [
        {
          path: "main",
          component: Main,
          name: "main",
          children: [
            {
              path: "tabpage1",
              component: TabPage1,
              name: "tabpage1",
              children: [
                {
                  path: "page1",
                  component: Page1,
                  name: "page1",
                },
              ],
            },
            {
              path: "tabpage2",
              component: TabPage2,
              name: "tabpage2",
            },
            {
              path: "tabpage3",
              component: TabPage3,
              name: "tabpage3",
            },
            {
              path: "tabpage4",
              component: TabPage4,
              name: "tabpage4",
            },
          ],
        },
        {
          path: "page1",
          component: Page1,
          name: "page1",
        },
        {
          path: "page2",
          component: Page2,
          name: "page2",
        },
      ],
    },
  ];
})();
