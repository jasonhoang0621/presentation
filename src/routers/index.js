import EditPresentation from "src/pages/EditPresentation";
import Presentation from "src/pages/Presentation";

const LayoutRouters = [
  {
    name: "presentation",
    path: "/presentation/:id",
    element: Presentation,
    layout: true,
  },
];

const NoLayoutRouters = [
  {
    name: "editPresentation",
    path: "/presentation/:id/edit",
    element: EditPresentation,
    layout: false,
  },
];

export { LayoutRouters, NoLayoutRouters };
