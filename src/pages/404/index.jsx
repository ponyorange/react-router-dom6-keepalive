import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
export default function NetFail() {
  const navigate = useNavigate();
  return (
    <div className="netFail">
      <div>404</div>
      <div>页面飞走了</div>
      <button onClick={() => navigate(-1)}>返回上一页</button>
    </div>
  );
}
