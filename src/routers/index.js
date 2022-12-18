import EditPresentation from "src/pages/EditPresentation";
import Group from "src/pages/Group";
import Join from "src/pages/Join";
import Present from "src/pages/Present";
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
  {
    name: "presentPublic",
    path: "/group/:groupId/presentation/:presentationId/present/public",
    element: Present,
    layout: false,
  },
  {
    name: "presentPrivate",
    path: "/group/:groupId/presentation/:presentationId/present/private",
    element: Present,
    layout: false,
  },
  {
    name: "userJoin",
    path: "/group/:groupId/presentation/:presentationId/join",
    element: Join,
    layout: false,
  },
];

export { LayoutRouters, NoLayoutRouters };
