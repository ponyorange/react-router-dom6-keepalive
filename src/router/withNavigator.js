import { useLocation, useNavigate } from "react-router-dom";
import NavHeader from "../componments/NavHeader";
import React, { useState, useEffect } from "react";
import "./withNavigator.scss";
//高阶组件
export default function withNavigator(Element, title = "") {
  function WithNavigator() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;

    const [aniClass, setAniclass] = useState("pageIn");

    useEffect(() => {
      //动画执行完后，移除进场动画
      setTimeout(() => {
        setAniclass("");
      }, 500);
    }, []);

    const backClick = () => {
      setAniclass("pageOut");
      setTimeout(() => {
        navigate(-1);
      }, 200);
    };
    return (
      <div className={aniClass}>
        <NavHeader leftClick={backClick}>{title}</NavHeader>
        <Element navigate={navigate} pathname={pathname} />
      </div>
    );
  }
  return WithNavigator;
}
