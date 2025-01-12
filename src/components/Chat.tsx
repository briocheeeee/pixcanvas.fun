import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GB, FR, ES, DE } from 'country-flag-icons/react/3x2';
import { useAuth0 } from '@auth0/auth0-react';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  country: string;
}

const FlagComponent = ({ country }: { country: string }) => {
  switch (country.toLowerCase()) {
    case 'gb':
      return <GB className="w-4 h-4" />;
    case 'fr':
      return <FR className="w-4 h-4" />;
    case 'es':
      return <ES className="w-4 h-4" />;
    case 'de':
      return <DE className="w-4 h-4" />;
    default:
      return <GB className="w-4 h-4" />;
  }
};

export function Chat() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth0();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (!isAuthenticated || !newMessage.trim()) return;

    try {
      // Get user's location only when sending a message
      const response = await fetch('https://ipapi.co/json/');
      const locationData = await response.json();
      const country = locationData.country || 'GB';

      const message: Message = {
        id: crypto.randomUUID(),
        user: user?.name || 'Anonymous',
        content: newMessage,
        timestamp: new Date(),
        country,
      };

      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to get location:', error);
      // Fall back to default country if location fetch fails
      const message: Message = {
        id: crypto.randomUUID(),
        user: user?.name || 'Anonymous',
        content: newMessage,
        timestamp: new Date(),
        country: 'GB',
      };

      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-24 right-4 w-80 bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h3 className="font-bold">{t('chat.title')}</h3>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2">
            <FlagComponent country={message.country} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{message.user}</span>
                <span className="text-xs text-gray-500">
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated ? (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 p-2 rounded-lg border"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t text-center text-sm text-gray-500">
          {t('chat.loginRequired')}
        </div>
      )}
    </div>
  );
}