import { useLocation, useNavigate } from "react-router-dom";
//高阶组件
export default function withRouter(Element) {
  function WithRouter(resProps) {
    const navigate = useNavigate();
    const location = useLocation();
    // console.log(location);
    const { pathname } = location;

    return (
      <>
        <Element navigate={navigate} pathname={pathname} {...resProps} />
      </>
    );
  }

  return WithRouter;
}
