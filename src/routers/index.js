import Slide from "src/pages/Presentation";

const routers = [
  {
    name: "presentation/",
    path: "/presentation/:id",
    element: Slide,
  },
];

export default routers;
