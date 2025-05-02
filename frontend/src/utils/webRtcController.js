import io from 'socket.io-client';

export class VideoCallController {
    constructor(callId) {
        this.callId = callId;
        this.remoteStreamListener = null;
    }

    setRemoteStreamListener(listener) { this.remoteStreamListener = listener ;}

    async init() {
        this.socket = io("http://localhost:5001");

        this.userAudioStream = await navigator.mediaDevices.getUserMedia(
            { audio: true });
        this.audioElement = new Audio();

        this.localMediaStream = null;
        this.remoteMediaStream = null;

        this.pc = this._createPeerConnection();
        this.pc.ontrack = (event) => {
            const track = event.track;
            const stream = event.streams[0];

            console.log('Track kind:', track.kind);
            console.log('Stream ID:', stream.id);

            if (track.kind === "audio") {
                this.audioElement.srcObject = stream;
                this.audioElement.autoplay = true;
                this.audioElement.muted = false;
            } else if (track.kind === "video") {
                this.remoteMediaStream = stream;
                track.onmute = () => {
                    console.log("remote video stopped");
                }
                track.onunmute = () => {
                    if (this.remoteStreamListener) {
                        this.remoteStreamListener(stream);
                    }
                }
            }
        };

        this._registerSocketEvents();
        return this;
    }

    mute() { console.log("muting..."); this.audioElement.muted = true; }
    unmute() { console.log("unmuting..."); this.audioElement.muted = false; }

    async shareScreen() {
        this.localMediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
        });

        this.localMediaStream.getTracks().forEach((track) => {
            this.pc.addTrack(track, this.localMediaStream);
        });

        this._handshake();
        return this.localMediaStream;
    }

    _createPeerConnection() {
        let pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        this.userAudioStream.getTracks().forEach((track) => {
            pc.addTrack(track, this.userAudioStream);
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && this.callId) {
                this.socket.emit(
                    "ice-candidate",
                    { candidate: event.candidate, callId: this.callId }
                );
            }};

        return pc;
    }

    async _handshake(args) {
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        this.socket.emit("offer", { callId: this.callId, offer, args });
    }

    _registerSocketEvents() {
        this.socket.emit("join", this.callId);

        this.socket.on("join", async (data) => {
            console.log("here");
            this._handshake();
        });

        this.socket.on("offer", async (data) => {
            console.log("I was offered");
            if (data.callId !== this.callId)
                return;
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.offer));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            this.socket.emit("answer", { callId: this.callId, answer });
        });

        this.socket.on("answer", async (data) => {
            console.log("I was answered");
            if (data.callId !== this.callId || !this.pc)
                return;
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.answer));
        });

        this.socket.on("ice-candidate", async (data) => {
            if (data.callId !== this.callId || !this.pc) return;
            try {
                await this.pc.addIceCandidate(
                    new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        })
    }
}
