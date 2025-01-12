import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../store/useStore';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth0();
  const settings = useSettingsStore();
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  });
  const [showRegister, setShowRegister] = useState(false);

  if (isAuthenticated && user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
            <button onClick={onClose}><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-4">
            <div>
              <p>Today Placed Pixels: N/A</p>
              <p>Daily Rank: N/A</p>
              <p>Placed Pixels: N/A</p>
              <p>Total Rank: N/A</p>
              <p>Your name is: {user.name}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => logout({ returnTo: window.location.origin })}
                className="px-3 py-1 bg-red-500 text-white rounded">
                Logout
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                Change Username
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                Change Mail
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                Change Password
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Register</h2>
            <button onClick={onClose}><X className="w-6 h-6" /></button>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Captcha</label>
              <div className="bg-gray-100 h-16 mb-2 rounded flex items-center justify-center">
                Captcha Image
              </div>
              <input
                type="text"
                value={registerForm.captcha}
                onChange={(e) => setRegisterForm({ ...registerForm, captcha: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Login</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name or Email</label>
            <input
              type="text"
              value={loginForm.identifier}
              onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg">
            Login
          </button>

          <a href="#" className="block text-sm text-blue-500 hover:underline">
            I forgot my Password
          </a>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Or login with:</p>
            <div className="flex justify-center space-x-4">
              <button className="p-2 border rounded-lg">
                Discord
              </button>
              <button className="p-2 border rounded-lg">
                Google
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">or register here:</p>
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}