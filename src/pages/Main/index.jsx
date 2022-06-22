import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TabBar } from "antd-mobile";
import tabs from "../../router/tabbarConfig";

import "./index.scss";

export default function Main() {
  // state = {
  //   selectedTab: this.props.pathname,
  // };
  const location = useLocation();
  const navigate = useNavigate();
  const setRouteActive = (value) => {
    navigate(value);
  };

  return (
    <div className="main">
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
