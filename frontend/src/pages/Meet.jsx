import React, { useState, useRef } from 'react';
import { VideoCallController } from "../utils/webRtcController";

const Meet = () => {
    const [callId, setCallId] = useState('');
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [videoCallController, setVideoCallController] = useState();

    const startCall = async () => {
        const videoCallController = new VideoCallController(callId);
        await videoCallController.init();
        videoCallController.setRemoteStreamListener((stream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
        })
        setVideoCallController(videoCallController);
    }

    const shareScreen = async () => {
        const mediaStream = await videoCallController.shareScreen();
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
        }
    }
    const mute = () => { videoCallController.mute(); }
    const unmute = () => { videoCallController.unmute(); }

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

            </div>
            <div>
                <h2>Your Shared Screen</h2>
                <video ref={localVideoRef} autoPlay muted style={{ width: '400px', border: '1px solid #ffffff' }} />
            </div>
            <div>
                <h2>Remote Shared Screen</h2>
                <video ref={remoteVideoRef} autoPlay style={{ width: '400px', border: '1px solid #ffffff' }} />
            </div>
        </div>
    );
};

export default Meet;
