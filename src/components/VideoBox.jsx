import { useEffect, useRef } from 'react';
import { CameraOff, Loader2 } from 'lucide-react';

const VideoBox = ({ stream, isLocal, status, className = "" }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const isWaiting = !isLocal && (status === 'waiting' || status === 'idle');
    const isConnecting = !isLocal && status === 'connected' && !stream;

    return (
        <div className={`video-container ${className}`}>
            {stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className="video-feed"
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-white/50 space-y-4">
                    {isWaiting ? (
                        <>
                            <Loader2 className="w-12 h-12 animate-spin" />
                            <p className="text-lg font-medium animate-pulse">Finding a partner...</p>
                        </>
                    ) : isConnecting ? (
                        <>
                            <Loader2 className="w-12 h-12 animate-spin" />
                            <p className="text-lg font-medium">Connecting...</p>
                        </>
                    ) : (
                        <>
                            <CameraOff className="w-12 h-12" />
                            <p className="text-lg font-medium">Camera is off</p>
                        </>
                    )}
                </div>
            )}

            {/* Label */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider text-white">
                {isLocal ? 'You' : 'Partner'}
            </div>
        </div>
    );
};

export default VideoBox;
