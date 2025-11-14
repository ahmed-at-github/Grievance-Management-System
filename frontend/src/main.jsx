import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
// import Login from './pages/Login.jsx'
import Admin from "./pages/Admin.jsx";
import AdminHome from "./components/admin/AdminHome.jsx";
import AdminCreateAccount from "./components/admin/AdminCreateAccount.jsx";
import AdminShowAllAccount from "./components/admin/AdminShowAllAccount.jsx";
import AdminEditAccount from "./components/admin/AdminEditAccount.jsx";
import Login from "./pages/Login.jsx";
import UsersInfo from "./pages/UserInfo.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/users/:id",
    Component: UsersInfo,
  },
  
  {
    path: "/admin",
    Component: Admin,
    children: [
      { index: true, Component: AdminHome },
      { path: "admin-create-account", Component: AdminCreateAccount },
      { path: "admin-show-all-account", Component: AdminShowAllAccount },
      { path: "admin-edit-account/:id", Component: AdminEditAccount },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
