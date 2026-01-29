# LuminoChat - Chatroulette-like Frontend

A modern, production-ready WebRTC video chat frontend built with React, Tailwind CSS, and Socket.IO.

## Features
- **Random 1-on-1 Matching**: Connects to a signaling server to find partners.
- **WebRTC Integration**: Low-latency video and audio communication.
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS and DaisyUI.
- **Micro-interactions**: Smooth animations with Framer Motion.
- **Control Bar**: Easily toggle camera/microphone and skip to next match.

## Tech Stack
- **React 19** (Functional components & hooks)
- **Vite** (Build tool)
- **Tailwind CSS 4**
- **DaisyUI 5** (UI Components)
- **Socket.IO Client** (Signaling)
- **Lucide React** (Icons)
- **Framer Motion** (Animations)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install client dependencies:
   ```bash
   npm install
   ```
2. Install signaling server dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

### Configuration
Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://your-backend-url.com
```
*Note: Defaults to `http://localhost:5000` if no env is provided.*

### Running the App
1. Start the signaling server:
   ```bash
   cd server
   npm run dev
   ```
2. In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` and the signaling server on
`http://localhost:5000`.

## Architecture
- `src/hooks/useWebRTC.js`: Core logic for peer connection management and signaling.
- `src/hooks/useSocket.js`: WebSocket connection management.
- `src/components/VideoBox.jsx`: Reusable component for local and remote streams.
- `src/App.jsx`: Main UI orchestration and layout.

## License
MIT
