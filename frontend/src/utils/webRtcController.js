import io from 'socket.io-client';

export class PeerConnection {
    constructor(roomId, purpose) {
        this.roomId = roomId;
        this.streams = [];
        this._purpose = purpose;
        this.socket = io("http://localhost:5001");
        this.pc = this._createPeerConnection();
        this._connected = false;
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

    addOnConnectListener(listener) { this.onConnectListener = listener; }
    addOnDisconnectListener(listener) { this.onDisconnectListener = listener; }

    emitCustomEvent(eventName, data) {
        this.socket.emit(
            "event", {
                ...data,
                eventName,
                roomId: this.roomId,
                purpose: this._purpose,
            }
        );
    }
    addCustomEventListener(listener) { this.customEventListener = listener; }

    _connect() {
        this._registerSocketEvents();
        window.addEventListener("beforeunload", () => {
            this.socket.emit("peer-disconnect", { roomId: this.roomId, purpose: this._purpose });
            alert("pause");
        });
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
            if (data.roomId !== this.roomId || data.purpose !== this._purpose)
                return;
            this._handshake();
        });

        this.socket.off("offer");
        this.socket.on("offer", async (data) => {
            if (data.roomId !== this.roomId || data.purpose !== this._purpose)
                return;
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.offer));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            this.socket.emit("answer", {
                roomId: this.roomId, purpose: this._purpose, answer });
        });

        this.socket.off("answer");
        this.socket.on("answer", async (data) => {
            if (data.roomId !== this.roomId || this._purpose !== data.purpose || !this.pc)
                return;
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.answer));
            this.socket.emit("peer-connect", { roomId: this.roomId, purpose: this._purpose });
            if (this.onConnectListener)
                this.onConnectListener(data);
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

        this.socket.off("peer-connect");
        this.socket.on("peer-connect", async (data) => {
            if (data.roomId !== this.roomId || this._purpose !== data.purpose || !this.pc) return;
            if (this.onConnectListener)
                this.onConnectListener(data);
        });

        this.socket.off("peer-disconnect");
        this.socket.on("peer-disconnect", async (data) => {
            if (data.roomId !== this.roomId || this._purpose !== data.purpose || !this.pc) return;
            if (this.onDisconnectListener)
                this.onDisconnectListener(data);
        });

        this.socket.off("event");
        this.socket.on("event", async (data) => {
            if (data.roomId !== this.roomId || this._purpose !== data.purpose || !this.pc) return;
            if (this.customEventListener)
                this.customEventListener(data);
        })
    }
}

export class VideoCallController {
    constructor(roomId) {
        this.roomId = roomId;
        this.onRemoteScreenShare = null;
        this.onRemoteCameraShare = null;
        this._remoteUserAudio = new Audio();
    }

    async init() {
        this.localScreenStream = null;
        this.remoteMediaStream = null;

        this.userConnection = this._createUserConnection();
        this.displayConnection = this._createDisplayConnection();
    }

    mute() {
        console.log("muting...");
        if (!this.localAudioStream)
            return;
        this.localAudioStream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    async unmute() {
        console.log("unmuting...");
        this.localAudioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        this.userConnection.addStream(this.localAudioStream);
        return this.localAudioStream;
    }

    async shareScreen() {
        this.localScreenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });

        if (this.onLocalScreenShareMuteListener) {
            this.localScreenStream.getVideoTracks()[0].onended = () => {
                this.onLocalScreenShareMuteListener();
                this.displayConnection.emitCustomEvent("remote-screen-stopped");
            }
        }

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

    stopCamera() {
        if (!this.localCameraStream)
            return;
        this.localCameraStream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    addOnConnectListener(listener) {
        this.onConnectListener = listener; }
    addOnDisconnectListener(listener) {
        this.onDisconnectListener = listener; }
    addRemoteScreenShareListener(listener) {
        this.onRemoteScreenShare = listener; }
    addRemoteCameraShareListener(listener) {
        this.onRemoteCameraShare = listener; }
    addRemoteScreenShareMuteListener(listener) {
        this.onRemoteScreenShareMute = listener; }
    addRemoteCameraShareMuteListener(listener) {
        this.onRemoteCameraShareMute = listener; }
    addLocalScreenShareMuteListener(listener) {
        this.onLocalScreenShareMuteListener = listener; }

    _createUserConnection() {
        const userConnection = new PeerConnection(this.roomId, "user");

        if (this.onConnectListener)
            userConnection.addOnConnectListener(this.onConnectListener);
        if (this.onDisconnectListener)
            userConnection.addOnDisconnectListener(this.onDisconnectListener);

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

                if (this.onRemoteCameraShareMute) {
                    track.onmute = this.onRemoteCameraShareMute;
                }
            }
        });

        return userConnection;
    }

    _createDisplayConnection() {
        const displayConnection = new PeerConnection(this.roomId, "display");

        displayConnection.addOntrackListener((event) => {
            const track = event.track;

            if (this.onRemoteScreenShare) {
                this.onRemoteScreenShare(event);
            }
        });

        displayConnection.addCustomEventListener((data) => {
            if (data.eventName === "remote-screen-stopped") {
                if (this.onRemoteScreenShareMute)
                    this.onRemoteScreenShareMute();
            }
        });

        return displayConnection;
    }
}
