import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { App } from "./App.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/qantas" /> },
      { path: "/:program", lazy: () => import("./pages/Home.tsx") },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
