import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Timer from "./pages/Timer";
import Shop from "./pages/Shop";
import Milestones from "./pages/Milestones";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import Rooms from "./pages/Rooms";
import Challenges from "./pages/Challenges";

const Admin = import.meta.env.DEV ? lazy(() => import("./pages/Admin")) : null;

const children = [
  { index: true, element: <Dashboard /> },
  { path: "timer", element: <Timer /> },
  { path: "shop", element: <Shop /> },
  { path: "milestones", element: <Milestones /> },
  { path: "stats", element: <Stats /> },
  { path: "friends", element: <Friends /> },
  { path: "friends/:uid", element: <FriendProfile /> },
  { path: "rooms", element: <Rooms /> },
  { path: "challenges", element: <Challenges /> },
  { path: "settings", element: <Settings /> },
  { path: "*", element: <NotFound /> },
];

if (Admin) {
  children.push({
    path: "admin",
    element: (
      <Suspense fallback={<div className="p-8 text-center text-slate-300">Loading...</div>}>
        <Admin />
      </Suspense>
    ),
  });
}

const routes = [
  {
    path: "/",
    element: <Layout />,
    children,
  },
];

export default routes;
