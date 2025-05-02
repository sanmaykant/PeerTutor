import React, { useState, useRef } from 'react';
import { VideoCallController } from "../utils/webRtcController";

const Meet = () => {
    const [callId, setCallId] = useState('');
    const localScreenRef = useRef(null);
    const remoteScreenRef = useRef(null);
    const localCameraRef = useRef(null);
    const remoteCameraRef = useRef(null);
    const [videoCallController, setVideoCallController] = useState();

    const startCall = async () => {
        const videoCallController = new VideoCallController(callId);
        videoCallController.addRemoteScreenShareListener((event) => {
            if (remoteScreenRef.current) {
                remoteScreenRef.current.srcObject = event.streams[0];
            }
        });
        videoCallController.addRemoteScreenShareMuteListener(_ => {
            if (remoteScreenRef.current) {
                remoteScreenRef.current.srcObject = null;
            }
        })
        videoCallController.addRemoteCameraShareListener((event) => {
            if (remoteCameraRef.current) {
                remoteCameraRef.current.srcObject = event.streams[0];
            }
        });
        videoCallController.addRemoteCameraShareMuteListener(_ => {
            if (remoteCameraRef.current) {
                remoteCameraRef.current.srcObject = null;
            }
        });
        videoCallController.addLocalScreenShareMuteListener(_ => {
            if (localScreenRef.current) {
                localScreenRef.current.srcObject = null;
            }
        })
        await videoCallController.init();
        setVideoCallController(videoCallController);
    }

    const shareScreen = async () => {
        const mediaStream = await videoCallController.shareScreen();
        if (localScreenRef.current) {
            localScreenRef.current.srcObject = mediaStream;
        }
    }

    const mute = () => { videoCallController.mute(); }
    const unmute = () => { videoCallController.unmute(); }

    const shareCamera = async () => {
        const mediaStream = await videoCallController.shareCamera();
        if (localCameraRef.current) {
            localCameraRef.current.srcObject = mediaStream;
        }
    }

    const stopCamera = async () => {
        videoCallController.stopCamera();
        if (localCameraRef.current) {
            localCameraRef.current.srcObject = null;
        }
    }

    return (
        <div>
            <h1>Meet</h1>
            <input
                type="text"
                value={callId}
                onChange={(e) => setCallId(e.target.value)}
                placeholder="Enter callId"
            />
            <div>
                <button onClick={startCall}>Call</button>
                <button onClick={shareScreen}>Share Screen</button>
                <button onClick={mute}>Mute Mic</button>
                <button onClick={unmute}>Unmute Mic</button>
                <button onClick={shareCamera}>Share Camera</button>
                <button onClick={stopCamera}>Stop Camera</button>
            </div>
            <div>
                <h2>Your Shared Screen</h2>
                <video ref={localScreenRef} autoPlay muted style={{ width: '400px', border: '1px solid #ffffff' }} />
            </div>
            <div>
                <h2>Remote Shared Screen</h2>
                <video ref={remoteScreenRef} autoPlay style={{ width: '400px', border: '1px solid #ffffff' }} />
            </div>
            <div>
                <h2>Your Shared Camera</h2>
                <video ref={localCameraRef} autoPlay style={{ width: '400px', border: '1px solid #ffffff' }} />
            </div>
            <div>
                <h2>Remote Shared Camera</h2>
                <video ref={remoteCameraRef} autoPlay style={{ width: '400px', border: '1px solid #ffffff' }} />
            </div>
        </div>
    );
};

export default Meet;
