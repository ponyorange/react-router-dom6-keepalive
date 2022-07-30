import React, { Component } from "react";
import "./index.scss";
import { Outlet } from "react-router-dom";

class TabPage1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: "",
    };
  }
  gotopage1 = () => {
    console.log("gotopage1");
    this.props.navigate("/page1");
  };
  inputChange = (e) => {
    this.setState({
      inputVal: e.target.value,
    });
  };

  gototabpage2 = () => {
    this.props.navigate("/main/tabpage1/page1");
  };
  componentDidMount() {
    console.log("componentDidMount===/main/tabpage1");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount===/main/tabpage1");
  }

  render() {
    return (
      <>
        <Outlet />
        <div className="tabpage1">
          TabPage1
          <div onClick={this.gotopage1}>点我去page1</div>
          <input value={this.state.inputVal} onChange={this.inputChange} />
          <div onClick={this.gototabpage2}>点我去/main/tbapage1/page2</div>
        </div>
      </>
    );
  }
}

export default TabPage1;
