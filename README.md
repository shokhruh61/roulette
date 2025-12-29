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
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://your-backend-url.com
```
*Note: Defaults to `http://localhost:5000` if no env is provided.*

### Running the App
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Architecture
- `src/hooks/useWebRTC.js`: Core logic for peer connection management and signaling.
- `src/hooks/useSocket.js`: WebSocket connection management.
- `src/components/VideoBox.jsx`: Reusable component for local and remote streams.
- `src/App.jsx`: Main UI orchestration and layout.

## License
MIT
