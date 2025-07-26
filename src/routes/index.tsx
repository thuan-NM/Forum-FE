import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import AnswerPage from "../pages/AnswerPage";
import QuestionList from "../components/Question/QuestionList";
import AnswerRequestsList from "../components/Answer/AnswerRequests/AnswerRequestsList";
import PrivateRoute from "./PrivateRoute";
import VerifyEmail from "../components/Auth/VerifyEmail";
import ResendVerification from "../components/Auth/ResendVerification";
import ScrollWrapper from "../components/Common/ScrollToTop/ScrollToTop";
import LoadingState from "../components/Common/LoadingState";

const HomePage = lazy(() => import("../pages/HomePage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const TopicsPage = lazy(() => import("../pages/TopicsPage"));
const TopicDetailPage = lazy(() => import("../pages/TopicDetailPage"));
const QuestionDetailPage = lazy(() => import("../pages/QuestionDetailPage"));
const TagsPage = lazy(() => import("../pages/TagsPage"));
const UsersPage = lazy(() => import("../pages/UserListPage"));
const TagDetailPage = lazy(() => import("../pages/TagDetailPage"));

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
    children: [
      { index: true, element: withPrivateRoute(<TopicsPage />) },
      { path: ":id", element: withPrivateRoute(<TopicDetailPage />) },
    ],
  },
  {
    path: "tags",
    children: [
      {
        index: true,

        element: (
          <Suspense fallback={<LoadingState message="" />}>
            {withPrivateRoute(<TagsPage />)}
          </Suspense>
        ),
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={<LoadingState message="" />}>
            {withPrivateRoute(<TagDetailPage />)}
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "question",
    children: [
      {
        path: ":id",
        element: (
          <Suspense fallback={<LoadingState message="" />}>
            {withPrivateRoute(<QuestionDetailPage />)}
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "users",
    children: [
      { index: true, element: withPrivateRoute(<UsersPage />) },
      // { path: ":id", element: withPrivateRoute(<QuestionDetailPage />) }, // 👈 Route chi tiết
    ],
  },
  {
    path: "my-profile",
    children: [{ index: true, element: withPrivateRoute(<ProfilePage />) }],
  },
];
const publicRoutes = [
  {
    path: "auth",
    children: [
      { index: true, element: <AuthPage /> },
      // { path: "verify-email", element: <VerifyEmail /> },
      { path: "resend-verification", element: <ResendVerification /> },
    ],
  },
  {
    path: "api",
    children: [{ path: "verify-email", element: <VerifyEmail /> }],
  },
];
const routes = [
  {
    path: "/",
    element: <ScrollWrapper />, // 👈 Wrapper xử lý scroll
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: protectedRoutes,
      },
    ],
  },
  ...publicRoutes,
];

const router = createBrowserRouter(routes);

export default router;
