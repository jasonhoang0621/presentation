import EditPresentation from "src/pages/EditPresentation";
import Group from "src/pages/Group";
import Presentation from "src/pages/Presentation";

const LayoutRouters = [
  {
    name: "group",
    path: "/group/:id",
    element: Group,
    layout: true,
  },
  {
    name: "presentation",
    path: "/group/:groupId/presentation/:presentationId",
    element: Presentation,
    layout: true,
  },
];

const NoLayoutRouters = [
  {
    name: "editPresentation",
    path: "/group/:groupId/presentation/:presentationId/edit",
    element: EditPresentation,
    layout: false,
  },
];

export { LayoutRouters, NoLayoutRouters };
