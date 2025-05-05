import React, { useState, useRef } from "react";
import { VideoCallController } from "../utils/webRtcController";
import GridView from "../components/GridView";
import UserTile from "../components/UserTile";
import ToggleButton from "../components/ToggleButton";
import {
    Mic,
    MicOff,
    Phone,
    ScreenShare,
    Video,
    VideoOff
} from "lucide-react";
import styles from "./styles/Meet.module.scss";

function RenderTile({ refProp, video, keyProp }) {
    return <UserTile ref={refProp} video={video} key={keyProp} />;
}

const Controls = ({
    onStartCall,
    onMuteToggle,
    onScreenShare,
    onCameraToggle
}) => {
    return (
        <div className={styles.controls}>
            <ToggleButton eventListener={onStartCall}>
                <Phone size={24} />
                <Phone size={24} />
            </ToggleButton>
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
        </div>
    );
}

function useVideoCall(refs) {
    const [videoCallController, setVideoCallController] = useState(null);
    const [tiles, setTiles] = useState([
        { key: "localUser", ref: refs.userTileRef, video: null }
    ]);

    const updateTile = (key, data) => {
        setTiles(prev => prev.some(tile => tile.key === key)
            ? prev.map(tile => tile.key === key ? { ...tile, ...data } : tile)
            : [...prev, { key, ...data }]
        );
    };

    const removeTile = (key) => {
        setTiles(prev => prev.filter(tile => tile.key !== key));
    };

    const startCall = async () => {
        const videoCallController = new VideoCallController(3);

        videoCallController.addOnConnectListener(() => {
            updateTile("remoteUser", { ref: refs.remoteUserRef, video: null });
        });

        videoCallController.addOnDisconnectListener(() => {
            removeTile("remoteUser");
            removeTile("remoteScreen");
        });

        videoCallController.addRemoteScreenShareListener((event) => {
            updateTile("remoteScreen",
                { ref: refs.remoteScreenRef, video: event.streams[0] });
        });

        videoCallController.addRemoteScreenShareMuteListener(() => {
            removeTile("remoteScreen");
        });

        videoCallController.addRemoteCameraShareListener((event) => {
            const enableCamera = () => {
                if (refs.remoteUserRef.current) {
                    refs.remoteUserRef.current.enableVideo(event.streams[0]);
                } else {
                    setTimeout(enableCamera, 1000);
                }
            };
            enableCamera();
        });

        videoCallController.addRemoteCameraShareMuteListener(() => {
            refs.remoteUserRef.current?.disableVideo();
        });

        videoCallController.addLocalScreenShareMuteListener(() => {
            removeTile("localScreen");
        });

        await videoCallController.init();
        setVideoCallController(videoCallController);
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

    return {
        tiles,
        startCall,
        shareScreen,
        mute,
        unmute,
        shareCamera,
        stopCamera
    };
}

export default function Meet() {
    const refs = {
        userTileRef: useRef(null),
        remoteUserRef: useRef(null),
        localScreenRef: useRef(null),
        remoteScreenRef: useRef(null),
        gridRef: useRef(null)
    };

    const {
        tiles,
        startCall,
        shareScreen,
        mute,
        unmute,
        shareCamera,
        stopCamera
    } = useVideoCall(refs);

    const handleMuteToggle = (isMuted) => {
        isMuted ? mute() : unmute();
    };

    const handleCameraToggle = (isSharing) => {
        isSharing ? stopCamera() : shareCamera();
    };

    return (
        <div>
            <div className={styles.main}>
                <div className={styles.grid}>
                    <GridView ref={refs.gridRef} gap={10}>
                        {tiles.map(tile => (
                            <RenderTile
                                key={tile.key}
                                refProp={tile.ref}
                                video={tile.video}
                                keyProp={tile.key}
                            />
                        ))}
                    </GridView>
                </div>
                <Controls
                    onStartCall={startCall}
                    onMuteToggle={handleMuteToggle}
                    onScreenShare={shareScreen}
                    onCameraToggle={handleCameraToggle}
                />
            </div>
        </div>
    );
}
