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

    async addStream(stream) {
        this.streams.push(stream);
        stream.getTracks().forEach((track) => {
            this.pc.addTrack(track, stream);
        });
        await this._handshake();
    }

    close() { 
        this.pc.close();
        this._unregisterSocketEvent("join");
        this._unregisterSocketEvent("offer");
        this._unregisterSocketEvent("answer");
        this._unregisterSocketEvent("ice-candidate");
        this._unregisterSocketEvent("peer-connect");
        this._unregisterSocketEvent("peer-disconnect");
        this._unregisterSocketEvent("event");
        this.pc.ontrack = null;
        this.pc.onicecandidate = null;
    }

    addOntrackListener(listener) {
        this.onTrackListener = listener;
        this.pc.ontrack = (event) => { listener(event); };
    }

    addOnConnectListener(listener) { this.onConnectListener = listener; }
    addOnDisconnectListener(listener) { this.onDisconnectListener = listener; }

    emitCustomEvent(eventName, data) {
        this._emitEvent("event", { eventName, ...data });
    }
    addCustomEventListener(listener) { this.customEventListener = listener; }

    _connect() {
        this._registerSocketEvents();
        window.addEventListener("beforeunload", () => {
            this._emitEvent("peer-disconnect");
        });
        this._emitEvent("join");
    }

    _createPeerConnection() {
        let pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && this.roomId)
                this._emitEvent(
                    "ice-candidate", { candidate: event.candidate });
        };

        return pc;
    }

    async _handshake() {
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        this._emitEvent("offer", { offer });
    }

    _emitEvent(event, data) {
        this.socket.emit(
            event, {
                roomId: this.roomId,
                purpose: this._purpose,
                ...data
            }
        );
    }

    _authenticateEvent(data) {
        return data.roomId !== this.roomId || data.purpose !== this._purpose;
    }

    _registerSocketEvent(eventName, callback) {
        this.socket.off(eventName);
        this.socket.on(eventName, async (data) => {
            if (this._authenticateEvent(data))
                return;
            await callback(data);
        });
    }

    _unregisterSocketEvent(eventName) { this.socket.off(eventName); }

    _registerSocketEvents() {
        this._registerSocketEvent("join", async _ => await this._handshake());

        this._registerSocketEvent("offer", async (data) => {
            console.log("I was offered");
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.offer));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            this._emitEvent("answer", { answer });
        });

        this._registerSocketEvent("answer", async (data) => {
            console.log("I was answered");
            await this.pc.setRemoteDescription(
                new RTCSessionDescription(data.answer));
            this._emitEvent("peer-connect");
            if (this.onConnectListener)
                this.onConnectListener(data);
        });

        this._registerSocketEvent("ice-candidate", async (data) => {
            try {
                await this.pc.addIceCandidate(
                    new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        this._registerSocketEvent("peer-connect", async (data) => {
            if (this.onConnectListener)
                this.onConnectListener(data);
        });

        this._registerSocketEvent("peer-disconnect", async (data) => {
            if (this.onDisconnectListener)
                this.onDisconnectListener(data);

            const senders = this.pc.getSenders();
            senders.forEach(sender => {
                sender.replaceTrack(null);
                this.pc.removeTrack(sender)
            });
            this.pc.close();
            delete this.pc;

            this.pc = this._createPeerConnection();
            if (this.onTrackListener)
                this.pc.ontrack = (event) => { this.onTrackListener(event); };

            const oldStreams = [...this.streams];
            this.streams = [];
            oldStreams.forEach(async stream => {
                await this.addStream(stream);
            });
        });

        this._registerSocketEvent("event", async (data) => {
            if (this.customEventListener)
                this.customEventListener(data);
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

                this.displayConnection.close();
                delete this.displayConnection;
                this.displayConnection = this._createDisplayConnection();
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
                console.log("here");
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
