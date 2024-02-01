import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/Global-Styles.scss"
import styles from "./css/Global.module.scss"
import Layout from "./components/layout";
import CreateAccount from "./routes/create-account";
import Home from "./routes/home";
import Login from "./routes/login";
import Profile from "./routes/profile";
import { Reset } from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import ResetPassword from "./components/reset-password";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  }
]);

function App() {
  const [isLoading, SetLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    // setTimeout(() => SetLoading(false), 2000);
    SetLoading(false)
  };
  useEffect(() => {
    init();
  }, [])
  return (
    <div className={styles.wrapper}>
      <Reset />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </div>
  );
}

export default App;
