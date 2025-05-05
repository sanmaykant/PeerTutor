import { useState } from "react";

const ToggleButton = ({ children, eventListener = (_) => { } }) => {
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        eventListener(!isMuted);
    };

    return (
        <button onClick={toggleMute} style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            backgroundColor: isMuted ? "grey" : "black",
        }}>
            <span>
                {isMuted ? children[0] : children[1]}
            </span>
        </button>
    );
};

export default ToggleButton;
