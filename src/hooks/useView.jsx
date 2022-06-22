import { createContext, useContext } from "react";

const ViewContext = createContext({});
const Provider = ViewContext.Provider;
export const useView = () => {
  // const routeContext = React.useContext(RouteContext)
  return useContext(ViewContext);
};

export const ViewProvider = ({ value, children }) => (
  <Provider value={value}>{children}</Provider>
);
