import React, { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import styles from "./styles/ChatView.module.scss";
import { AuthContext } from "../providers/AuthProvider.jsx"
import { trackChatActivity } from "../utils/apiControllers.js";

const socket = io("http://localhost:5001");

const ChatView = ({ peer, chatHistory=[], onMessage=()=>{} }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState(chatHistory);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const containerRef = useRef();
    const [inView, setInView] = useState(false);

    useEffect(() => {
        socket.emit("join-chat", user.username, peer);
        socket.on("chat-message", (message) => {
            onMessage(message);
            if (message.user !== peer)
                return;
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
    });

    useEffect(() => {
        if (inView)
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, inView]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const message = {
            user: user?.username,
            text: input.trim(),
            timestamp: new Date().toISOString(),
        };

        socket.emit("chat-message",
            { ...message, sender: user?.username, reciever: peer });
        setMessages(prev => [...prev, message]);
        onMessage(message);
        setInput("");

        // Track chat activity for gamification
        try {
            await trackChatActivity(1);
        } catch (error) {
            console.error('Error tracking chat activity:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={styles.chatContainer} ref={containerRef} onClick={(e) => { e.stopPropagation(); }}>
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
                    onClick={(e) => { e.stopPropagation(); }}
                />
                <button className={styles.chatSend} onClick={e => {
                    e.stopPropagation();
                    sendMessage();
                }}>Send</button>
            </div>
        </div>
    );
};

export default ChatView;
