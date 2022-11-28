import { generatePath } from "react-router-dom";
import routers from "src/routers";

const useRouting = () => {
  const generate = (name: string, params = {}) => {
    const route = routers.find((r) => r.name === name);
    if (route) {
      return generatePath(`${route.path}`, params);
    }
    return "";
  };
  return { generate };
};

export default useRouting;
