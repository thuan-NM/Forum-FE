import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import AnswerPage from "../pages/AnswerPage";
import QuestionList from "../components/PostManage/Question/QuestionList";
import AnswerRequestsList from "../components/PostManage/Question/Answer/AnswerRequests/AnswerRequestsList";

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
            {
                path: "answer",
                element: <AnswerPage />,
                children: [
                    {
                        index: true,
                        element: <QuestionList />,
                    },
                    {
                        path: "requests",
                        element: <AnswerRequestsList />,
                    },
                ],
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