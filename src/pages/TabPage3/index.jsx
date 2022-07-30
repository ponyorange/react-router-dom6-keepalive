import React, { Component } from "react";
import "./index.scss";

function TabPage3() {
  const rows = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  return (
    <div className="tabpage3">
      TabPage3
      <input />
      {rows.map((row) => (
        <div style={{ height: "50px" }} key={row}>
          {row}
        </div>
      ))}
    </div>
  );
}

export default TabPage3;
