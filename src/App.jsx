import { useState, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import { useWebRTC } from './hooks/useWebRTC';
import VideoBox from './components/VideoBox';
import { Power, SkipForward, Mic, MicOff, Camera, CameraOff, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { socket, isConnected } = useSocket();
  const {
    localStream,
    remoteStream,
    status,
    error,
    startMatching,
    stopChat
  } = useWebRTC(socket);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const toggleMic = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMicOn(prev => !prev);
    }
  }, [localStream]);

  const toggleCam = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsCamOn(prev => !prev);
    }
  }, [localStream]);

  const handleNext = () => {
    startMatching();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-primary-content">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-white/10 glass sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <Power className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Lumino<span className="text-primary">Chat</span></h1>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`}></span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-none">
                {isConnected ? 'Signaling Online' : 'Signaling Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Connection Status</span>
            <span className={`text-sm font-semibold capitalize ${status === 'connected' ? 'text-success' : 'text-primary'}`}>
              {status}
            </span>
          </div>
          <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Github className="w-5 h-5 text-white/70" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Remote Video (Main) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <VideoBox
              stream={remoteStream}
              isLocal={false}
              status={status}
              className="h-[400px] lg:h-[500px]"
            />
          </motion.div>

          {/* Local Video & Stats */}
          <div className="flex flex-col space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <VideoBox
                stream={localStream}
                isLocal={true}
                status={status}
                className="h-[300px] lg:h-[350px]"
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-error/20 border border-error/50 text-error text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Placeholder for future features */}
            <div className="flex-1 glass p-6 rounded-2xl hidden md:flex flex-col justify-center">
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Tips</h3>
              <ul className="text-white/60 text-sm space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="bg-primary/20 text-primary-content text-[10px] px-1.5 py-0.5 rounded">NEW</span>
                  <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-white">Space</kbd> to skip to the next person!</span>
                </li>
                <li>Be respectful and have fun!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <motion.div
          layout
          className="glass p-4 rounded-3xl flex items-center space-x-4 md:space-x-8 shadow-2xl border border-white/5"
        >
          {/* Start/Status Toggle */}
          {status === 'idle' ? (
            <button
              onClick={startMatching}
              className="btn btn-primary btn-lg rounded-2xl px-8 shadow-lg shadow-primary/30"
            >
              Start Chatting
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={status === 'idle'}
              className="btn btn-primary btn-lg rounded-2xl px-12 group shadow-lg shadow-primary/30 disabled:bg-neutral disabled:text-neutral-content/30"
            >
              <span className="hidden md:inline">Next Person</span>
              <SkipForward className="w-5 h-5 md:ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <div className="w-px h-10 bg-white/10 mx-2 hidden md:block"></div>

          {/* Media Toggles */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMic}
              disabled={!localStream}
              className={`btn btn-circle btn-ghost glass ${!isMicOn ? 'text-error' : 'text-white/80'}`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleCam}
              disabled={!localStream}
              className={`btn btn-circle btn-ghost glass ${!isCamOn ? 'text-error' : 'text-white/80'}`}
            >
              {isCamOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="w-px h-10 bg-white/10 mx-2 hidden md:block"></div>

          {/* Stop Button */}
          <button
            onClick={stopChat}
            disabled={status === 'idle'}
            className="btn btn-circle btn-error btn-outline hover:btn-error glass"
          >
            <Power className="w-5 h-5" />
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
        Built with Google Antigravity &bull; WebRTC Signaling Protocol v1.0
      </footer>
    </div>
  );
}

export default App;
