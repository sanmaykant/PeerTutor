import { useNavigate } from "react-router"
import styles from "./styles/Home.module.scss";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div id={styles.container}>
                <nav>
                    <span id={styles.logo}>PeerTutor</span>
                    <div id={styles.quickLinks}>
                        <ul>
                            <li><a href="">Home</a></li>
                            <li><a href="/features">Features</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                        <div id={styles.logo}></div>
                    </div>
                </nav>
                <div id={styles.content}>
                    <div id={styles.quote}>
                        <span>Connect</span>
                        <span>Learn</span>
                        <span>Grow</span>
                    </div>
                    <div id={styles.cta}>
                        <div>
                        <button onClick={() => { navigate("/login"); }}>Get Started</button>
                        <button onClick={() => { navigate("/signup"); }}>Become a Member</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
