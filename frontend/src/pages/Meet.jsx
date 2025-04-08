import React, { useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const Meet = () => {
    const [callId, setCallId] = useState('');
    const [pc, setPc] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const createPeerConnection = () => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { candidate: event.candidate, callId });
            }
        };

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        return peerConnection;
    };

    const shareScreen = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error('Error sharing screen:', error);
            return null;
        }
    };

    const startCall = async () => {
        if (!callId) return alert('Please enter a callId.');
        socket.emit('join', callId);
        const stream = await shareScreen();
        if (!stream) return;

        const peerConnection = createPeerConnection();
        setPc(peerConnection);
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', { callId, offer });
    };

    socket.on('offer', async (data) => {
        if (data.callId !== callId) return;
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { callId, answer });
    });

    socket.on('answer', async (data) => {
        if (data.callId !== callId || !pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('ice-candidate', async (data) => {
        if (data.callId !== callId || !pc) return;
        try {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    });

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
