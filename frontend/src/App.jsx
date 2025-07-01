import  AuthProvider, { ProtectedRoute } from "./providers/AuthProvider";
import { createBrowserRouter, RouterProvider } from "react-router";

import Dashboard from "./pages/Dashboard"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home"
import Meet from "./pages/Meet";
import Profile from "./pages/Profile";
import WhoWereFor from "./pages/WhoWereFor";
import About from "./pages/About";
import Calendar from "./pages/Calendar";


const router = createBrowserRouter([
    {
        path: "/",
        "element": <Home />,
    },
    {
        path: "/dashboard",
        "element": <ProtectedRoute><Dashboard /></ProtectedRoute>,
    },
    {
        path: "/signup",
        "element": <Signup />,
    },
    {
        path: "/login",
        "element": <Login />,
    },
    {
        path: "/meet/:peer",
        "element": <ProtectedRoute><Meet /></ProtectedRoute>,
    },
    {
        path: "/profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
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
        <RouterProvider router={router} />
        </AuthProvider>
}

export default App;
