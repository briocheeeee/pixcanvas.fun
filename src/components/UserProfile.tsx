import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../store/useStore';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth0();
  const settings = useSettingsStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {user && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={user.picture}
                alt={user.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className={`w-full px-4 py-2 rounded-lg ${
                settings.theme.isDark
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white`}
            >
              {t('profile.logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}