import "./App.css";
import { Suspense, lazy } from "react";

const CatlogDashboard = lazy(() => import("./components/CatlogDashboard"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      }
    >
      <CatlogDashboard />
    </Suspense>
  );
}

export default App;
