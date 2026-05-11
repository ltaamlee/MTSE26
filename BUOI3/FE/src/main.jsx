import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'antd/dist/reset.css';
import './styles/global.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import UserPage from "./pages/user";

import {AuthWrapper} from "./components/context/auth.context.jsx";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "user",
          element: <UserPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
      ],
    },
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);  
