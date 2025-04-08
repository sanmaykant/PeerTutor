import { AuthContext } from "../providers/AuthProvider";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router"
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();
    const { authStatus } = useContext(AuthContext);

    useEffect(() => {
        if (authStatus === "authenticated") {
            navigate("/dashboard");
        }
    }, [authStatus]);

    return (
        <>
            <div id="container">
                <nav>
                    <span id="logo">PeerTutor</span>
                    <div id="quick-links">
                        <ul>
                            <li>Home</li>
                            <li>Features</li>
                            <li>Contact</li>
                        </ul>
                        <div id="logo"></div>
                    </div>
                </nav>
                <div id="content">
                    <div id="quote">
                        <span>Connect</span>
                        <span>Learn</span>
                        <span>Grow</span>
                    </div>
                    <div id="cta">
                        <button>Get Started</button>
                        <button>Become a Member</button>
                    </div>
                </div>
            </div>
        </>
    )
}
