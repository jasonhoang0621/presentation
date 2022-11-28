import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "src/components/Layout";
import { LayoutRouters, NoLayoutRouters } from "./index";

const Authenticated = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout sider />}>
        {LayoutRouters.map((item, idx) => (
          <Route key={idx} path={item.path} element={<item.element />} />
        ))}
      </Route>
      <Route path="/" element={<Layout />}>
        {NoLayoutRouters.map((item, idx) => (
          <Route key={idx} path={item.path} element={<item.element />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={"not-found"} />} />
    </Routes>
  );
};

export default Authenticated;
