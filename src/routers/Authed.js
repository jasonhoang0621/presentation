import { Route, Routes, Navigate } from "react-router-dom";
import router from "./index";
import useRouting from "src/hooks/UseRouting";
import Layout from "src/components/Layout";

const Authenticated = () => {
  const { generate } = useRouting();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {router.map((item, idx) => (
          <Route key={idx} path={item.path} element={<item.element />} />
        ))}
        <Route path="*" element={<Navigate to={generate("not-found")} />} />
      </Route>
    </Routes>
  );
};

export default Authenticated;
