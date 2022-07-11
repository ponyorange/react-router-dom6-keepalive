import React, { Component } from "react";
import "./index.scss";

class TabPage3 extends Component {
  componentDidMount() {
    console.log("componentDidMount===/main/tabpage3");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount===/main/tabpage3");
  }
  render() {
    return (
      <div className="tabpage3">
        TabPage3
        <input />
      </div>
    );
  }
}

export default TabPage3;
