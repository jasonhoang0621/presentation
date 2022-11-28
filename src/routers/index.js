import { UserOutlined } from "@ant-design/icons";
import Group from "src/pages/Group";

const routers = [
  {
    name: "group/",
    path: "/group/:id",
    element: Group,
    icon: <UserOutlined />,
  },
];

export default routers;
