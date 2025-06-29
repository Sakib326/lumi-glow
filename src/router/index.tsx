import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../modules/home";
import PublicLayout from "../modules/@common/@layout/public";

const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="grid place-content-center h-screen w-screen">
          <div role="status" className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            <div
              className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
