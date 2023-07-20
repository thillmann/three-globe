import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { AppLayout } from "./AppLayout.tsx";
import "./index.css";

console.log(
  `Created using Vite, React.js and Three.js in Brisbane, Australia. Interested? Reach out to timo@relayforms.com`,
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
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
