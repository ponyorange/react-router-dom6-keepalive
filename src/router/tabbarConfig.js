import { Badge } from "antd-mobile";
import React from "react";

const tabs = [
  {
    key: "/main/tabpage1",
    title: "首页",
    icon: <i className="iconfont icon-ind" />,
    badge: Badge.dot,
  },
  {
    key: "/main/tabpage2",
    title: "找房",
    icon: <i className="iconfont icon-findHouse" />,
    badge: "5",
  },
  {
    key: "/main/tabpage3",
    title: "资讯",
    icon: <i className="iconfont icon-infom" />,
    badge: "99+",
  },
  {
    key: "/main/tabpage4",
    title: "我的",
    icon: <i className="iconfont icon-my" />,
  },
];

export default tabs;
