import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useSettingsStore } from '../store/useStore';

interface MapSelectorProps {
  currentMap: 'basic' | 'minimap' | '2c2';
  onSelect: (map: 'basic' | 'minimap' | '2c2') => void;
  onClose: () => void;
}

export function MapSelector({ currentMap, onSelect, onClose }: MapSelectorProps) {
  const { t } = useTranslation();
  const settings = useSettingsStore();

  const maps = [
    { id: 'basic', name: 'Basic', prefix: 'e' },
    { id: 'minimap', name: 'Minimap', prefix: 's' },
    { id: '2c2', name: '2C2', prefix: 'f' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('maps.title')}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {maps.map((map) => (
            <button
              key={map.id}
              onClick={() => {
                onSelect(map.id);
                onClose();
              }}
              className={`p-4 rounded-lg border ${
                currentMap === map.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              } ${settings.theme.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              <h3 className="font-semibold">{map.name}</h3>
              <p className="text-sm text-gray-500">/{map.prefix}@x&y</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}