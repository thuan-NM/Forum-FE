import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../layouts/MainLayout";

const HomePage = lazy(() => import("../pages/HomePage"))
const AuthPage = lazy(() => import("../pages/AuthPage"))

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        ]
    },
    {
        path: "auth",
        element: <AuthPage />,
    }
]

const router = createBrowserRouter(routes);

export default router;