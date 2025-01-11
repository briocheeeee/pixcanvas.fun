import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useSettingsStore } from '../store/useStore';

interface HelpProps {
  onClose: () => void;
}

export function Help({ onClose }: HelpProps) {
  const { t } = useTranslation();
  const settings = useSettingsStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('help.title')}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="font-semibold mb-2">{t('help.controls')}</h3>
            <ul className="space-y-2">
              <li>Z - Move up</li>
              <li>S - Move down</li>
              <li>Q - Move left</li>
              <li>D - Move right</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">{t('help.links')}</h3>
            <div className="space-y-2">
              <a
                href="https://discord.gg/your-server"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block"
              >
                Discord Server
              </a>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block"
              >
                GitHub Repository
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}