import React, {Component} from 'react';
import './index.scss'

import NavHeader from '../../componments/NavHeader'

class Page1 extends Component {

  state={
    page1Class:"page1"
  }

  backAmnimation =()=>{
    setTimeout(()=>{
      this.props.navigate(-1)
    },200)
    this.setState({
      page1Class:"page1 pageback"
    })
  }

  gotopage2=() =>{
    this.props.navigate('/page2')
  }


  render() {
    return (
      <div className={this.state.page1Class}>
        <NavHeader leftClick={this.backAmnimation}>page1</NavHeader>
        Page1
        <div onClick={this.gotopage2}>点我去page2</div>
      </div>
    );
  }
}

export default Page1;
