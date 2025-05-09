import React, { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import styles from "./styles/ChatView.module.scss";
import { AuthContext } from "../providers/AuthProvider.jsx"

const socket = io("http://localhost:5001");

const ChatView = ({ peer }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const containerRef = useRef();
    const [inView, setInView] = useState(false);

    useEffect(() => {
        socket.emit("join-chat", user.username, peer);
        socket.on("chat-message", (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off("chat-message");
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
        }, { rootMargin: "-10px" });
        if (containerRef.current)
            observer.observe(containerRef.current);

        return () => {
            if (containerRef.current)
                observer.unobserve(containerRef.current);
        }
    })

    useEffect(() => {
        if (inView)
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, inView]);

    const sendMessage = () => {
        if (input.trim() === "") return;

        const message = {
            user: user?.username,
            text: input.trim(),
            timestamp: new Date().toISOString(),
        };

        socket.emit("chat-message",
            { ...message, sender: user?.username, reciever: peer });
        setMessages(prev => [...prev, message]);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={styles.chatContainer} ref={containerRef}>
            <div className={styles.chatMessages}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.chatMessage}>
                        <strong className={styles.chatUser}>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className={styles.chatInputArea}>
                <textarea
                    className={styles.chatInput}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />
                <button className={styles.chatSend} onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatView;
