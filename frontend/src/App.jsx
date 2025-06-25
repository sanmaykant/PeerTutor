import AuthProvider, { ProtectedRoute } from "./providers/AuthProvider";
import AchievementProvider from "./providers/AchievementProvider";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Meet = lazy(() => import("./pages/Meet"));
const Profile = lazy(() => import("./pages/Profile"));
const MentorProfile = lazy(() => import("./pages/MentorProfile"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
import WhoWereFor from "./pages/WhoWereFor";
import About from "./pages/About";
import Calendar from "./pages/Calendar";


// Loader component
const Loader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    background: 'rgba(255,255,255,0.7)',
    zIndex: 9999,
    position: 'fixed',
    top: 0,
    left: 0
  }}>
    <div className="loader"></div>
  </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        "element": (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
    },
    {
        path: "/dashboard",
        "element": (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
    },
    {
        path: "/signup",
        "element": (
          <Suspense fallback={<Loader />}>
            <Signup />
          </Suspense>
        ),
    },
    {
        path: "/login",
        "element": (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
    },
    {
        path: "/meet/:peer",
        "element": (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Meet />
            </Suspense>
          </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
    },
    {
        path: "/profile/:username",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <MentorProfile />
            </Suspense>
          </ProtectedRoute>
        ),
    },
    {
        path: "/leaderboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Leaderboard />
            </Suspense>
          </ProtectedRoute>
        ),
    },
    {
        path: "/ourusers",
        element: <WhoWereFor />
    },
    {
        path: "/about",
        element: <About />
    },
    {
        path: "/calendar",
        element: <Calendar />
    },
])

function App() {
    return <AuthProvider>
        <AchievementProvider>
            <RouterProvider router={router} />
        </AchievementProvider>
        </AuthProvider>
}

export default App;
