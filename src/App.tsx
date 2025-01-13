import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings as SettingsIcon, HelpCircle, User, Map as MapIcon, MessageSquare } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { Settings } from './components/Settings';
import { Chat } from './components/Chat';
import { Help } from './components/Help';
import { UserProfile } from './components/UserProfile';
import { MapSelector } from './components/MapSelector';
import { useSettingsStore } from './store/useStore';
import admins from './config/admins.json';

const CANVAS_SIZE = 1000;
const CHUNK_SIZE = 150;
const PIXEL_SIZE = 10;
const COOLDOWN_TIME = 60000;
const CACHE_TIME = 10000; // 10 seconds cache
const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

interface Position {
  x: number;
  y: number;
}

interface Chunk {
  id: string;
  pixels: string[];
  lastUpdate: number;
}

interface PixelUpdate {
  x: number;
  y: number;
  color: string;
  timestamp: number;
  userId: string;
}

type ChunkMap = Record<string, Chunk>;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixels, setPixels] = useState<string[]>(Array(CANVAS_SIZE * CANVAS_SIZE).fill('#FFFFFF'));
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [lastPlaced, setLastPlaced] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [hoveredPixel, setHoveredPixel] = useState<Position | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [currentMap, setCurrentMap] = useState<'basic' | 'minimap' | '2c2'>('basic');
  const [chunks, setChunks] = useState<ChunkMap>({});
  const [pixelUpdates, setPixelUpdates] = useState<PixelUpdate[]>([]);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [authState, setAuthState] = useState({
    showSettings: false,
    showProfile: false,
    showHelp: false,
    showMap: false,
  });

  const { t } = useTranslation();
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const settings = useSettingsStore();

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isAuthenticated) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (CANVAS_SIZE / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (CANVAS_SIZE / rect.height));

    if (Date.now() - lastPlaced < COOLDOWN_TIME) return;

    const index = y * CANVAS_SIZE + x;
    const newPixels = [...pixels];
    newPixels[index] = selectedColor;
    setPixels(newPixels);
    setLastPlaced(Date.now());

    // Update chunk cache
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunkId = `${chunkX}-${chunkY}`;
    
    const update: PixelUpdate = {
      x,
      y,
      color: selectedColor,
      timestamp: Date.now(),
      userId: user?.sub || '',
    };

    setPixelUpdates(prev => [...prev, update]);
  }, [pixels, selectedColor, lastPlaced, isAuthenticated, user]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (CANVAS_SIZE / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (CANVAS_SIZE / rect.height));

    setHoveredPixel({ x, y });
  }, []);

  const handleCanvasMouseLeave = useCallback(() => {
    setHoveredPixel(null);
  }, []);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateScreenSize);
    updateScreenSize();

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on screen size
    const size = Math.min(screenSize.width, screenSize.height) * 0.9;
    canvas.width = size;
    canvas.height = size;

    // Draw pixels
    const pixelSize = size / CANVAS_SIZE;
    pixels.forEach((color, i) => {
      const x = (i % CANVAS_SIZE) * pixelSize;
      const y = Math.floor(i / CANVAS_SIZE) * pixelSize;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    });

    // Draw hover preview
    if (hoveredPixel) {
      ctx.fillStyle = selectedColor;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(
        hoveredPixel.x * pixelSize,
        hoveredPixel.y * pixelSize,
        pixelSize,
        pixelSize
      );
      ctx.globalAlpha = 1;
    }
  }, [pixels, hoveredPixel, selectedColor, screenSize]);

  useEffect(() => {
    if (lastPlaced) {
      const interval = setInterval(() => {
        const remaining = COOLDOWN_TIME - (Date.now() - lastPlaced);
        setCooldownRemaining(remaining > 0 ? remaining : 0);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [lastPlaced]);

  return (
    <div className={`h-screen w-screen relative overflow-hidden ${
      settings.theme.isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        className="w-full h-full"
      />

      {/* Pixel Position Display */}
      {settings.enablePixelPosition && hoveredPixel && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
          x: {hoveredPixel.x}, y: {hoveredPixel.y}
        </div>
      )}

      {/* Top left icons */}
      <div className="absolute top-4 left-4 space-y-4">
        <button
          onClick={() => setAuthState(prev => ({ ...prev, showSettings: true }))}
          className={`w-10 h-10 ${settings.theme.isRound ? 'rounded-full' : 'rounded-lg'} 
            ${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center justify-center`}
        >
          <SettingsIcon className="w-6 h-6" />
        </button>

        <button
          onClick={() => setAuthState(prev => ({ ...prev, showMap: true }))}
          className={`w-10 h-10 ${settings.theme.isRound ? 'rounded-full' : 'rounded-lg'}
            ${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center justify-center`}
        >
          <MapIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => isAuthenticated 
            ? setAuthState(prev => ({ ...prev, showProfile: true }))
            : loginWithRedirect()
          }
          className={`w-10 h-10 ${settings.theme.isRound ? 'rounded-full' : 'rounded-lg'}
            ${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center justify-center`}
        >
          {isAuthenticated && user?.picture ? (
            <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => setAuthState(prev => ({ ...prev, showHelp: true }))}
          className={`w-10 h-10 ${settings.theme.isRound ? 'rounded-full' : 'rounded-lg'}
            ${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center justify-center`}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`fixed bottom-4 right-4 w-10 h-10 ${settings.theme.isRound ? 'rounded-full' : 'rounded-lg'}
          ${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center justify-center`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Color Picker */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg flex space-x-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-lg ${
              color === selectedColor ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Modals */}
      {authState.showSettings && (
        <Settings onClose={() => setAuthState(prev => ({ ...prev, showSettings: false }))} />
      )}

      {authState.showHelp && (
        <Help onClose={() => setAuthState(prev => ({ ...prev, showHelp: false }))} />
      )}

      {authState.showProfile && (
        <UserProfile onClose={() => setAuthState(prev => ({ ...prev, showProfile: false }))} />
      )}

      {authState.showMap && (
        <MapSelector
          currentMap={currentMap}
          onSelect={setCurrentMap}
          onClose={() => setAuthState(prev => ({ ...prev, showMap: false }))}
        />
      )}

      {/* Chat */}
      {showChat && <Chat />}

      {/* Cooldown Timer */}
      {cooldownRemaining > 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
          {t('pixel.cooldown', { time: Math.ceil(cooldownRemaining / 1000) })}
        </div>
      )}
    </div>
  );
}

export default App;