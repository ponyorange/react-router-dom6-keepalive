import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TabBar } from "antd-mobile";
import tabs from "../../router/tabbarConfig";

import "./index.scss";
import { onPageHiden, onPageShow } from "../../componments/KeepAlive";

export default function Main() {
  // state = {
  //   selectedTab: this.props.pathname,
  // };
  const location = useLocation();
  const navigate = useNavigate();
  const setRouteActive = (value) => {
    // console.log("setRouteActive===", value);
    navigate(value);
  };
  const containerDiv = useRef(null);
  // useEffect(() => {
  //   const pathName = "/main/tabpage2";
  //   onPageShow(pathName, () => {
  //     console.log(pathName, "显示了");
  //     if (containerDiv.current) {
  //       setTimeout(() => {
  //         containerDiv.current.scrollBy(0, 300);
  //       }, 0);
  //     }
  //   });
  //   onPageHiden(pathName, () => {
  //     console.log(pathName, "隐藏了");
  //     if (containerDiv.current) {
  //       console.log(containerDiv.current.scrollTop);
  //     }
  //   });
  // }, []);

  return (
    <div className="main" ref={containerDiv}>
      <Outlet />
      <div className="tabbar">
        <TabBar
          safeArea
          activeKey={location.pathname}
          onChange={(value) => setRouteActive(value)}
        >
          {tabs.map((item) => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              className="item"
            />
          ))}
        </TabBar>
      </div>
    </div>
  );
}
