import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";
import { User } from "lucide-react"
import styles from "./styles/UserTile.module.scss"

const UserTile = forwardRef((props, ref) => {
    const { video=null, onClick=null } = props;
    const videoRef = useRef();
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);

    useEffect(() => {
        if (video) {
            setIsVideoOn(true);
            setVideoSrc(video);
        }
    }, []);

    useEffect(() => {
        if (isVideoOn && videoRef.current)
            videoRef.current.srcObject = videoSrc;
    }, [isVideoOn]);

    useImperativeHandle(ref, () => ({
        enableVideo(videoSrc) {
            setIsVideoOn(true);
            setVideoSrc(videoSrc);
        },
        disableVideo() {
            setIsVideoOn(false);
            setVideoSrc(null);
        },
    }));

    return (
        <div onClick={() => { onClick?.(); }} className={styles.card}>
        {isVideoOn ?
            <video ref={videoRef} autoPlay muted className={styles.video}/>
            :
            <User />}
        </div>
    )
});

export default UserTile;
