import io from 'socket.io-client';

export class PeerConnection {
    constructor(roomId, purpose) {
        this.roomId = roomId;
        this.streams = [];
        this._purpose = purpose;
        this.socket = io("http://localhost:5001");
        this.pc = this._createPeerConnection();
        this._connect();
    }

    addStream(stream) {
        this.streams.push(stream);
        stream.getTracks().forEach((track) => {
            this.pc.addTrack(track, stream);
        });
        this._handshake();
    }

    addOntrackListener(listener) {
        this.pc.ontrack = (event) => {
            listener(event);
        };
    }

    _connect() {
        this._registerSocketEvents();
        this.socket.emit(
            "join", { roomId: this.roomId, purpose: this._purpose });
    }

    _createPeerConnection() {
        let pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && this.roomId) {
                this.socket.emit(
                    "ice-candidate",
                    {
                        candidate: event.candidate,
                        roomId: this.roomId,
                        purpose: this._purpose
                    }
                );
            }};

        return pc;
    }

    async _handshake() {
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        this.socket.emit(
            "offer", { roomId: this.roomId, purpose: this._purpose, offer });
    }

    _registerSocketEvents() {
        this.socket.off("join");
        this.socket.on("join", async (data) => {
            console.log(data);
            if (data.roomId !== this.roomId || data.purpose !== this._purpose)
                return;
            this._handshake();
        });

        this.socket.off("offer");
        this.socket.on("offer", async (data) => {
            console.log("I was offered");
            if (data.roomId !== this.roomId || data.purpose !== this._purpose)
                return;
            console.log(this._purpose, data.purpose);
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.offer));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            this.socket.emit("answer", {
                roomId: this.roomId, purpose: this._purpose, answer });
        });

        this.socket.off("answer");
        this.socket.on("answer", async (data) => {
            console.log("I was answered");
            if (data.roomId !== this.roomId || this._purpose !== data.purpose || !this.pc)
                return;
            console.log(this._purpose, data.purpose);
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.answer));
        });

        this.socket.off("ice-candidate");
        this.socket.on("ice-candidate", async (data) => {
            if (data.roomId !== this.roomId || this._purpose !== data.purpose || !this.pc) return;
            try {
                await this.pc.addIceCandidate(
                    new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });
    }
}

export class VideoCallController {
    constructor(roomId) {
        this.roomId = roomId;
        this.onRemoteScreenShare = null;
        this.onRemoteCameraShare = null;
        this._remoteUserAudio = new Audio();
    }

    addRemoteScreenShareListener(listener) {
        this.onRemoteScreenShare = listener; }
    addRemoteCameraShareListener(listener) {
        this.onRemoteCameraShare = listener; }

    async shareScreen() {
        this.localScreenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });

        this.displayConnection.addStream(this.localScreenStream);
        return this.localScreenStream;
    }

    async shareCamera() {
        this.localCameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });

        this.userConnection.addStream(this.localCameraStream);
        return this.localCameraStream;
    }

    async stopCamera() {
        if (!this.localCameraStream)
            return;
        this.localCameraStream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    _createUserConnection() {
        const userConnection = new PeerConnection(this.roomId, "user");

        userConnection.addOntrackListener((event) => {
            const track = event.track;
            const stream = event.streams[0];

            if (track.kind === "audio") {
                this._remoteUserAudio.srcObject = stream;
                this._remoteUserAudio.autoplay = true;
                this._remoteUserAudio.muted = false;
            } else if (track.kind === "video") {
                if (this.onRemoteCameraShare) {
                    this.onRemoteCameraShare(event);
                }
            }
        })

        return userConnection;
    }

    _createDisplayConnection() {
        const displayConnection = new PeerConnection(this.roomId, "display");

        displayConnection.addOntrackListener((event) => {
            if (this.onRemoteScreenShare) {
                this.onRemoteScreenShare(event);
            }
        });

        return displayConnection;
    }

    async init() {
        this.localScreenStream = null;
        this.remoteMediaStream = null;

        this.userConnection = this._createUserConnection();
        this.displayConnection = this._createDisplayConnection();

        this.userConnection.addStream(
            await navigator.mediaDevices.getUserMedia({ audio: true }));
    }

    mute() { console.log("muting..."); this._remoteUserAudio.muted = true; }
    unmute() { console.log("unmuting..."); this._remoteUserAudio.muted = false; }
}
