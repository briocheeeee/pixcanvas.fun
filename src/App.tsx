import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, HelpCircle, User, Map, MessageSquare } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { Settings } from './components/Settings';
import { Chat } from './components/Chat';
import { Help } from './components/Help';
import { UserProfile } from './components/UserProfile';
import { MapSelector } from './components/MapSelector';
import { useSettingsStore } from './store/useStore';
import './i18n';

// Constants remain the same
const CANVAS_SIZE = 100;
const PIXEL_SIZE = 10;
const COOLDOWN_TIME = 60000;
const COLORS = [/* ... colors remain the same ... */];

interface Position {
  x: number;
  y: number;
}

interface PixelPlacementState {
  showConfirmation: boolean;
  position: Position | null;
}

interface AuthState {
  showSettings: boolean;
  showProfile: boolean;
  showHelp: boolean;
  showMap: boolean;
}

function App() {
  // Existing refs and state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixels, setPixels] = useState<string[]>(Array(CANVAS_SIZE * CANVAS_SIZE).fill('#FFFFFF'));
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [lastPlaced, setLastPlaced] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [hoveredPixel, setHoveredPixel] = useState<Position | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [currentMap, setCurrentMap] = useState<'basic' | 'minimap' | '2c2'>('basic');
  const [pixelPlacement, setPixelPlacement] = useState<PixelPlacementState>({
    showConfirmation: false,
    position: null,
  });
  const [authState, setAuthState] = useState<AuthState>({
    showSettings: false,
    showProfile: false,
    showHelp: false,
    showMap: false,
  });

  const { t } = useTranslation();
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const settings = useSettingsStore();

  // Update URL based on position and map
  useEffect(() => {
    if (hoveredPixel) {
      const prefix = currentMap === 'basic' ? 'e' : currentMap === 'minimap' ? 's' : 'f';
      window.history.replaceState(
        null,
        '',
        `/${prefix}@${hoveredPixel.x}&${hoveredPixel.y}`
      );
    }
  }, [hoveredPixel, currentMap]);

  // Existing effects and handlers remain the same...

  return (
    <div className={`h-screen w-screen relative overflow-hidden ${
      settings.theme.isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE * PIXEL_SIZE}
        height={CANVAS_SIZE * PIXEL_SIZE}
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
          <Map className="w-6 h-6" />
        </button>
        
        {isAuthenticated ? (
          <button
            onClick={() => setAuthState(prev => ({ ...prev, showProfile: true }))}
            className={`w-10 h-10 ${settings.theme.isRound ? 'rounded-full' : 'rounded-lg'}
              ${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center justify-center overflow-hidden`}
          >
            <img src={user?.picture} alt={user?.name} className="w-6 h-6 rounded-full" />
          </button>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className={`w-10 h-10 ${settings.theme.isRound ? 'rounded-full' : 'rounded-lg'}
              ${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-center justify-center`}
          >
            <User className="w-6 h-6" />
          </button>
        )}

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

      {/* Modals */}
      {authState.showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
            <Settings />
            <button
              onClick={() => setAuthState(prev => ({ ...prev, showSettings: false }))}
              className={`mt-4 w-full px-4 py-2 ${settings.theme.isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg`}
            >
              {t('common.close')}
            </button>
          </div>
        </div>
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

      {/* Rest of the components remain the same... */}
    </div>
  );
}

export default App;