import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Timer from "./pages/Timer";
import Shop from "./pages/Shop";
import Milestones from "./pages/Milestones";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "timer", element: <Timer /> },
      { path: "shop", element: <Shop /> },
      { path: "milestones", element: <Milestones /> },
      { path: "stats", element: <Stats /> },
      { path: "friends", element: <Friends /> },
      { path: "friends/:uid", element: <FriendProfile /> },
      { path: "settings", element: <Settings /> },
      { path: "admin", element: <Admin /> },
    ],
  },
];

export default routes;
