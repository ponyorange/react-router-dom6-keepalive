import React from "react";
import { NavBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
// 导入 props 校验的包
import PropTypes from "prop-types";

import styles from "./index.module.css";

function NavHeader({ children, leftClick, className }) {
  const navigate = useNavigate();
  const deafaultLeftClick = () => navigate(-1);
  return (
    <NavBar
      className={[styles.myNavHeader, className || ""]}
      onBack={leftClick || deafaultLeftClick}
    >
      {children}
    </NavBar>
  );
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  leftClick: PropTypes.func,
};

export default NavHeader;
