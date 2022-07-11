import React, { useEffect } from "react";
import "./index.scss";

import { onPageHiden, onPageShow } from "../../componments/KeepAlive";
import { useLocation } from "react-router-dom";

const TabPage2 = function () {
  const location = useLocation();
  const pathName = location.pathname;
  useEffect(() => {
    onPageShow(pathName, () => {
      console.log(pathName, "显示了");
    });
    onPageHiden(pathName, () => {
      console.log(pathName, "隐藏了");
    });
  }, []);
  return (
    <div className="tabpage2">
      TabPage2
      <input />
    </div>
  );
};

export default TabPage2;
