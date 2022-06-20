import { useLocation, useNavigate } from "react-router-dom";
//高阶组件
export default function withRouter(Element) {
  function WithRouter() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;

    return <Element navigate={navigate} pathname={pathname} />
  }

  return WithRouter;
}
