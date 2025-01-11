import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/useStore';

const themes = [
  { name: 'dark-round', isDark: true, isRound: true },
  { name: 'dark', isDark: true, isRound: false },
  { name: 'light', isDark: false, isRound: false },
  { name: 'light-round', isDark: false, isRound: true },
] as const;

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

export function Settings() {
  const { t, i18n } = useTranslation();
  const settings = useSettingsStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('settings.title')}</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>{t('settings.showGrid')}</span>
          <input
            type="checkbox"
            checked={settings.showGrid}
            onChange={(e) => settings.setShowGrid(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>{t('settings.showPixelActivity')}</span>
          <input
            type="checkbox"
            checked={settings.showPixelActivity}
            onChange={(e) => settings.setShowPixelActivity(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>{t('settings.enablePixelPosition')}</span>
          <input
            type="checkbox"
            checked={settings.enablePixelPosition}
            onChange={(e) => settings.setEnablePixelPosition(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">{t('settings.theme')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => settings.setTheme(theme)}
                className={`p-2 rounded-lg border ${
                  settings.theme.name === theme.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                {t(`settings.themes.${theme.name}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">{t('settings.language')}</h3>
          <select
            value={settings.language}
            onChange={(e) => {
              settings.setLanguage(e.target.value);
              i18n.changeLanguage(e.target.value);
            }}
            className="w-full p-2 rounded-lg border border-gray-200"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}