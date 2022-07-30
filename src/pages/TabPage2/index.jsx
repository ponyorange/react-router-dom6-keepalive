import React, { useEffect, useRef } from "react";
import "./index.scss";

const TabPage2 = function () {
  const rows = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  const containerDiv = useRef(null);
  useEffect(() => {}, []);
  return (
    <div className="tabpage2" ref={containerDiv}>
      TabPage2
      <input />
      {rows.map((row) => (
        <div style={{ height: "50px" }} key={row}>
          {row}
        </div>
      ))}
    </div>
  );
};

export default TabPage2;
