import { useState, useEffect, useRef, useCallback } from 'react';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const useWebRTC = (socket) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, waiting, connected
    const [error, setError] = useState(null);

    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteUserIdRef = useRef(null);

    // Initialize local media
    const initLocalMedia = useCallback(async () => {
        try {
            if (localStreamRef.current) return localStreamRef.current;

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
            localStreamRef.current = stream;
            return stream;
        } catch (err) {
            console.error('Error accessing media devices:', err);
            setError('Could not access camera/microphone. Please check permissions.');
            return null;
        }
    }, []);

    // Cleanup connection
    const cleanup = useCallback(() => {
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        setRemoteStream(null);
        remoteUserIdRef.current = null;
        setStatus('idle');
        if (socket) {
            socket.emit('leave');
        }
    }, [socket]);

    // Create Peer Connection
    const createPeerConnection = useCallback((peerId) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    to: peerId,
                });
            }
        };

        pc.ontrack = (event) => {
            console.log('Received remote track');
            setRemoteStream(event.streams[0]);
            setStatus('connected');
        };

        // Add local tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        pcRef.current = pc;
        return pc;
    }, [socket]);

    // Handle Offer
    const handleOffer = useCallback(async (data) => {
        const { from, offer } = data;
        remoteUserIdRef.current = from;

        const pc = createPeerConnection(from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('answer', {
            answer,
            to: from,
        });
    }, [socket, createPeerConnection]);

    // Handle Answer
    const handleAnswer = useCallback(async (data) => {
        const { answer } = data;
        if (pcRef.current) {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }, []);

    // Handle ICE Candidate
    const handleIceCandidate = useCallback(async (data) => {
        const { candidate } = data;
        if (pcRef.current) {
            try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    }, []);

    // Start Matching
    const startMatching = useCallback(async () => {
        cleanup();
        setStatus('waiting');

        const stream = await initLocalMedia();
        if (!stream) return;

        socket.emit('find-match');
    }, [cleanup, initLocalMedia, socket]);

    // Handle Match
    const handleMatch = useCallback(async (data) => {
        const { peerId, shouldCreateOffer } = data;
        remoteUserIdRef.current = peerId;

        if (shouldCreateOffer) {
            const pc = createPeerConnection(peerId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit('offer', {
                offer,
                to: peerId,
            });
        }
    }, [socket, createPeerConnection]);

    // Set up socket listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('match', handleMatch);
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('peer-disconnected', () => {
            console.log('Peer disconnected');
            startMatching(); // Automatically find next match
        });

        return () => {
            socket.off('match');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('peer-disconnected');
        };
    }, [socket, handleMatch, handleOffer, handleAnswer, handleIceCandidate, startMatching]);

    return {
        localStream,
        remoteStream,
        status,
        error,
        startMatching,
        stopChat: cleanup,
    };
};
