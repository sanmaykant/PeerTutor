import React, { useState, useEffect, useRef } from 'react';
import { VideoCallController } from "../utils/webRtcController";
import GridView from "../components/GridView";
import UserTile from "../components/UserTile";

import {
    Mic,
    MicOff,
    Phone,
    ScreenShare,
    Video,
    VideoOff
} from 'lucide-react';
import styles from "./styles/Meet.module.scss"

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

export default function Meet() {
    const userTileRef = useRef(null);
    const remoteUserRef = useRef(null);
    const localScreenRef = useRef(null);
    const remoteScreenRef = useRef(null);
    const gridRef = useRef(null);
    const [gridViewChildren, setGridViewChildren] = useState({});
    const [videoCallController, setVideoCallController] = useState();

    const startCall = async (callId) => {
        const videoCallController = new VideoCallController(callId);
        videoCallController.addOnConnectListener(() => {
            setGridViewChildren(prevState => ({
                ...prevState,
                remoteUserTile: <UserTile ref={remoteUserRef} key="remoteUser" />
            }));
        });
        videoCallController.addOnDisconnectListener(() => {
            setGridViewChildren(({ remoteUserTile, remoteScreenTile, ...rest }) => rest);
        })
        videoCallController.addRemoteScreenShareListener((event) => {
            setGridViewChildren(prevState => ({
                ...prevState,
                remoteScreenTile: <UserTile ref={remoteScreenRef} video={event.streams[0]} key="remoteScreen" />
            }));
        });
        videoCallController.addRemoteScreenShareMuteListener(_ => {
            setGridViewChildren(({ remoteScreenTile, ...rest }) => rest);
        });
        videoCallController.addRemoteCameraShareListener((event) => {
            const enableCamera = () => {
                if (remoteUserRef.current) {
                    remoteUserRef.current.enableVideo(event.streams[0]);
                } else {
                    setTimeout(enableCamera, 1000);
                }
            }
            enableCamera();
        });
        videoCallController.addRemoteCameraShareMuteListener(() => {
            if (remoteUserRef.current) {
                remoteUserRef.current.disableVideo();
            }
        });
        videoCallController.addLocalScreenShareMuteListener(() => {
            setGridViewChildren(({ localScreenTile, ...rest }) => rest);
        });
        await videoCallController.init();
        setVideoCallController(videoCallController);
    }

    const shareScreen = async () => {
        const mediaStream = await videoCallController.shareScreen();
        setGridViewChildren(prevState => ({
            ...prevState,
            localScreenTile: <UserTile ref={localScreenRef} video={mediaStream} key="localScreen" />
        }));
    }

    const mute = () => { videoCallController.mute(); }
    const unmute = () => { videoCallController.unmute(); }

    const shareCamera = async () => {
        const mediaStream = await videoCallController.shareCamera();
        if (userTileRef.current)
            userTileRef.current.enableVideo(mediaStream);
    }

    const stopCamera = async () => {
        videoCallController.stopCamera();
        if (userTileRef.current)
            userTileRef.current.disableVideo();
    }

    return (
        <div>
            <div className={styles.main}>
                <div className={styles.grid}>
                    <GridView C={gridViewChildren} ref={gridRef} gap={10}>
                        <UserTile ref={userTileRef} key="localUser" />
                        {...Object.values(gridViewChildren)}
                    </GridView>
                </div>
                <div className={styles.controls}>
                    <ToggleButton eventListener={() => startCall(3)}>
                        <Phone size={24} />
                        <Phone size={24} />
                    </ToggleButton>
                    <ToggleButton eventListener={(isMuted) => isMuted ? mute() : unmute()}>
                        <MicOff size={24} />
                        <Mic size={24} />
                    </ToggleButton>
                    <ToggleButton eventListener={_ => shareScreen()}>
                        <ScreenShare size={24} />
                        <ScreenShare size={24} />
                    </ToggleButton>
                    <ToggleButton eventListener={(isSharing) => isSharing ? stopCamera() : shareCamera()}>
                        <Video size={24} />
                        <VideoOff size={24} />
                    </ToggleButton>
                </div>
            </div>
        </div>
    );
};
