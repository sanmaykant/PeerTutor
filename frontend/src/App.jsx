import { createBrowserRouter, RouterProvider } from "react-router";
import  AuthProvider, { ProtectedRoute } from "./providers/AuthProvider"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Meet from "./pages/Meet";

const router = createBrowserRouter([
    {
        path: "/",
        "element": <div>Home</div>,
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
        "element": <ProtectedRoute><Meet /></ProtectedRoute>,
    }
])

function App() {
    return <AuthProvider>
        <RouterProvider router={router} />
        </AuthProvider>
}

export default App;
