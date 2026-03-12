import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import SeoManager from "./components/SeoManager";
import routes from "./routes";

export default function App() {
  const element = useRoutes(routes);
  const location = useLocation();
  return (
    <>
      <SeoManager />
      <AnimatePresence mode="wait">
        <Suspense
          fallback={<div className="min-h-screen bg-slate-950/90" />}
        >
          <div key={location.pathname}>{element}</div>
        </Suspense>
      </AnimatePresence>
    </>
  );
}
