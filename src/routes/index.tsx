import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import AnswerPage from "../pages/AnswerPage";
import QuestionList from "../components/PostManage/Question/QuestionList";
import AnswerRequestsList from "../components/PostManage/Question/Answer/AnswerRequests/AnswerRequestsList";
import PrivateRoute from "./PrivateRoute";
import VerifyEmail from "../components/Auth/VerifyEmail";
import ResendVerification from "../components/Auth/ResendVerification";

const HomePage = lazy(() => import("../pages/HomePage"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const TopicsPage = lazy(() => import("../pages/TopicsPage"));

const withPrivateRoute = (element: JSX.Element) => (
  <PrivateRoute>{element}</PrivateRoute>
);

const protectedRoutes = [
  { index: true, element: withPrivateRoute(<HomePage />) },
  {
    path: "answer",
    element: withPrivateRoute(<AnswerPage />),
    children: [
      { index: true, element: withPrivateRoute(<QuestionList />) },
      { path: "requests", element: withPrivateRoute(<AnswerRequestsList />) },
    ],
  },
  {
    path: "topics",
    element: withPrivateRoute(<TopicsPage />),
    // children: [
    //     { index: true, element: withPrivateRoute(<QuestionList />) },
    //     { path: "requests", element: withPrivateRoute(<AnswerRequestsList />) },
    // ],
  },
];
const publicRoutes = [
  {
    path: "auth",
    children: [
      { index: true, element: <AuthPage /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "resend-verification", element: <ResendVerification /> },
    ],
  },
  // {
  //   path: "topics",
  //   element: withPrivateRoute(<TopicsPage />),
  //   // children: [
  //   //     { index: true, element: withPrivateRoute(<QuestionList />) },
  //   //     { path: "requests", element: withPrivateRoute(<AnswerRequestsList />) },
  //   // ],
  // },
];
const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: protectedRoutes,
  },
  ...publicRoutes,
];

const router = createBrowserRouter(routes);

export default router;
