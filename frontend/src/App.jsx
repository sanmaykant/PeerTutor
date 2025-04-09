import  AuthProvider, { ProtectedRoute } from "./providers/AuthProvider"
import { createBrowserRouter, RouterProvider } from "react-router";

import Dashboard from "./pages/Dashboard"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home"
import Meet from "./pages/Meet";

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
        path: "/meet",
        "element": <Meet />,
    }
])

function App() {
    return <AuthProvider>
        <RouterProvider router={router} />
        </AuthProvider>
}

export default App;
