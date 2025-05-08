import { useState } from "react";

const ToggleButton = ({ children, eventListener = (_) => { } }) => {
    const [toggle, setToggle] = useState(false);

    const toggleMute = () => {
        setToggle(!toggle);
        eventListener(!toggle);
    };

    return (
        <button onClick={toggleMute} style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            backgroundColor: toggle ? "black" : "grey",
        }}>
            <span>
                {toggle ? children[1] : children[0]}
            </span>
        </button>
    );
};

export default ToggleButton;
