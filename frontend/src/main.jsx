import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";

// Performance optimization: Use strict mode for better development experience
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
)
