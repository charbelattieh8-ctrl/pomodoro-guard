import { useLocation, useRoutes } from "react-router-dom";
import SeoManager from "./components/SeoManager";
import routes from "./routes";

export default function App() {
  const element = useRoutes(routes);
  const location = useLocation();
  return (
    <>
      <SeoManager />
      <div data-route={location.pathname}>{element}</div>
    </>
  );
}
