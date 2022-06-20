import React, {Component} from 'react';
import './index.scss'

class TabPage1 extends Component {
  constructor(props) {
    super(props);
    this.state={
      inputVal:''
    }
  }
  gotopage1 = ()=>{
    this.props.navigate('/page1')
  }
  inputChange = e =>{
    this.setState({
      inputVal:e.target.value
    })
  }

  render() {
    return (
      <div className="tabpage1">
        TabPage1
        <div onClick={this.gotopage1}>点我去page1</div>
        <input value={this.state.inputVal} onChange={this.inputChange}/>
      </div>
    );
  }
}

export default TabPage1;
