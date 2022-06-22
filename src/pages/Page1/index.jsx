import React, { Component } from "react";
import "./index.scss";

class Page1 extends Component {
  state = {
    page1Class: "page1",
  };

  backAmnimation = () => {
    setTimeout(() => {
      this.props.navigate(-1);
    }, 200);
    this.setState({
      page1Class: "page1 pageback",
    });
  };

  gotopage2 = () => {
    this.props.navigate("/page2");
  };

  render() {
    return (
      <div>
        Page1
        <input />
        <div onClick={this.gotopage2}>点我去page2</div>
      </div>
    );
  }
}

export default Page1;
