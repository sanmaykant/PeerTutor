import { useParams } from "react-router";
import React, { useState, useRef, useContext, useEffect } from "react";

import GridView from "../components/GridView";
import UserTile from "../components/UserTile";
import ChatView from "../components/ChatView";
import ToggleButton from "../components/ToggleButton";
import BackButton from "../components/BackButton";

import { VideoCallController } from "../utils/webRtcController";
import { AuthContext } from "../providers/AuthProvider";
import { fetchChats, trackCallActivity } from "../utils/apiControllers";

import {
    Mic,
    MicOff,
    ScreenShare,
    Video,
    VideoOff,
    MessageSquare,
    MessageSquareOff,
} from "lucide-react";
import styles from "./styles/Meet.module.scss";

function RenderTile({ refProp, video, keyProp, gridRef, index }) {
    return <UserTile
                ref={refProp}
                video={video}
                key={keyProp}
                onClick={() => {
                    if (gridRef?.current?.getPin() === index)
                        gridRef?.current?.unpin();
                    else
                        gridRef?.current?.pin(index);
                }}
            />;
}

const Controls = ({
    onMuteToggle,
    onScreenShare,
    onCameraToggle,
    onChatToggle,
}) => {
    return (
        <div className={styles.controls}>
            <ToggleButton eventListener={onMuteToggle}>
                <MicOff size={24} />
                <Mic size={24} />
            </ToggleButton>
            <ToggleButton eventListener={onScreenShare}>
                <ScreenShare size={24} />
                <ScreenShare size={24} />
            </ToggleButton>
            <ToggleButton eventListener={onCameraToggle}>
                <Video size={24} />
                <VideoOff size={24} />
            </ToggleButton>
            <ToggleButton eventListener={onChatToggle}>
                <MessageSquare size={24} />
                <MessageSquareOff size={24} />
            </ToggleButton>
        </div>
    );
}

function useVideoCall(refs, roomId) {
    const [videoCallController, setVideoCallController] = useState(null);
    const [tiles, setTiles] = useState([
        { key: "localUser", ref: refs.userTileRef, video: null }
    ]);
    const [callStartTime, setCallStartTime] = useState(null);

    const updateTile = (key, data) => {
        setTiles(prev => prev.some(tile => tile.key === key)
            ? prev.map(tile => tile.key === key ? { ...tile, ...data } : tile)
            : [...prev, { key, ...data }]
        );
    };

    const removeTile = (key) => {
        setTiles(prev => prev.filter(tile => tile.key !== key));
    };

    const startCall = async (controller) => {
        // Track call start time
        setCallStartTime(Date.now());

        controller.addOnConnectListener(() => {
            updateTile("remoteUser", { ref: refs.remoteUserRef, video: null });
        });

        controller.addOnDisconnectListener(() => {
            removeTile("remoteUser");
            removeTile("remoteScreen");
            
            // Track call end and duration
            if (callStartTime) {
                const callDuration = Math.floor((Date.now() - callStartTime) / 1000 / 60); // Duration in minutes
                trackCallActivity(callDuration, 'video').catch(error => {
                    console.error('Error tracking call activity:', error);
                });
            }
        });

        controller.addRemoteScreenShareListener((event) => {
            updateTile("remoteScreen",
                { ref: refs.remoteScreenRef, video: event.streams[0] });
        });

        controller.addRemoteScreenShareMuteListener(() => {
            removeTile("remoteScreen");
        });

        controller.addRemoteCameraShareListener((event) => {
            const enableCamera = () => {
                if (refs.remoteUserRef.current) {
                    refs.remoteUserRef.current.enableVideo(event.streams[0]);
                } else {
                    setTimeout(enableCamera, 1000);
                }
            };
            enableCamera();
        });

        controller.addRemoteCameraShareMuteListener(() => {
            refs.remoteUserRef.current?.disableVideo();
        });

        controller.addLocalScreenShareMuteListener(() => {
            removeTile("localScreen");
        });

        await controller.init();
        setVideoCallController(controller);
    };

    const shareScreen = async () => {
        if (!videoCallController) return;
        const mediaStream = await videoCallController.shareScreen();
        updateTile("localScreen",
            { ref: refs.localScreenRef, video: mediaStream });
    };

    const mute = () => { videoCallController?.mute(); };
    const unmute = () => { videoCallController?.unmute(); };

    const shareCamera = async () => {
        if (!videoCallController) return;
        const mediaStream = await videoCallController.shareCamera();
        refs.userTileRef.current?.enableVideo(mediaStream);
    };

    const stopCamera = () => {
        videoCallController?.stopCamera();
        refs.userTileRef.current?.disableVideo();
    };

    useEffect(() => {
        const controller = new VideoCallController(roomId);
        startCall(controller);
        return () => {
            console.log("closing call...", controller);
            
            // Track call end when component unmounts
            if (callStartTime) {
                const callDuration = Math.floor((Date.now() - callStartTime) / 1000 / 60); // Duration in minutes
                trackCallActivity(callDuration, 'video').catch(error => {
                    console.error('Error tracking call activity:', error);
                });
            }
            
            controller.close();
        }
    }, []);

    return {
        tiles,
        shareScreen,
        mute,
        unmute,
        shareCamera,
        stopCamera
    };
}

export default function Meet() {
    const { peer } = useParams();
    const { user } = useContext(AuthContext);
    const [chatHistory, setChatHistory] = useState([]);
    const refs = {
        userTileRef: useRef(null),
        remoteUserRef: useRef(null),
        localScreenRef: useRef(null),
        remoteScreenRef: useRef(null),
        gridRef: useRef(null)
    };
    const [chatInView, setChatInView] = useState(false);

    const {
        tiles,
        shareScreen,
        mute,
        unmute,
        shareCamera,
        stopCamera
    } = useVideoCall(refs, [ user.username, peer ].sort().toString());

    const handleMuteToggle = (isMuted) => {
        isMuted ? unmute() : mute();
    };

    const handleCameraToggle = (isSharing) => {
        isSharing ? shareCamera() : stopCamera();
    };

    const handleChatToggle = (inView) => {
        setChatInView(inView);
    }

    useEffect(() => {
        (async () => {
            const chats = await fetchChats(peer);
            setChatHistory(chats);
        })();
    }, []);

    return (
        <div>
            <BackButton />
            <div className={styles.main}>
                <div className={styles.grid}>
                    <GridView ref={refs.gridRef} gap={10}>
                        {tiles.map((tile, index) => (
                            <RenderTile
                                key={tile.key}
                                refProp={tile.ref}
                                video={tile.video}
                                keyProp={tile.key}
                                gridRef={refs.gridRef}
                                index={index}
                            />
                        ))}
                    </GridView>
                </div>
                <div style={{
                    width: chatInView ? "25%" : "0%",
                    transform: chatInView ? "translateX(0%)" : "translateX(100%)",
                    transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
                    zIndex: 1,
                }}>
                    <ChatView key={chatHistory.length} peer={peer} chatHistory={chatHistory} />
                </div>
                <Controls
                    onMuteToggle={handleMuteToggle}
                    onScreenShare={shareScreen}
                    onCameraToggle={handleCameraToggle}
                    onChatToggle={handleChatToggle}
                />
            </div>
        </div>
    );
};
