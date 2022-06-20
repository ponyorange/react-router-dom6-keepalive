import React, { Component } from "react";
import { DotLoading } from "antd-mobile";
import "./index.scss";

class RouteLoading extends Component {
  render() {
    return (
      <div className="route-loading">
        <DotLoading />
      </div>
    );
  }
}

export default RouteLoading;
