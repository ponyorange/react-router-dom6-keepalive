import React from "react";
import { Outlet } from "react-router-dom";
import { Badge, TabBar } from "antd-mobile";

import "./index.scss";

const tabs = [
  {
    key: "/Main/TabPage1",
    title: "首页",
    icon: <i className="iconfont icon-ind" />,
    badge: Badge.dot,
  },
  {
    key: "/Main/TabPage2",
    title: "找房",
    icon: <i className="iconfont icon-findHouse" />,
    badge: "5",
  },
  {
    key: "/Main/TabPage3",
    title: "资讯",
    icon: <i className="iconfont icon-infom" />,
    badge: "99+",
  },
  {
    key: "/Main/TabPage4",
    title: "我的",
    icon: <i className="iconfont icon-my" />,
  },
];
export default class Main extends React.Component {
  state = {
    selectedTab: this.props.pathname,
  };

  setRouteActive = (value) => {
    this.setState({
      selectedTab: value,
    });
    this.props.navigate(value);
  };

  componentDidMount() {
    // console.log(this.props)
  }

  render() {
    return (
      <div className="main">
        <Outlet />
        <div className="tabbar">
          <TabBar
            safeArea
            activeKey={this.state.selectedTab}
            onChange={(value) => this.setRouteActive(value)}
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
}
