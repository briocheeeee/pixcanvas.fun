import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useSettingsStore } from '../store/useStore';

interface TemplateFormProps {
  onClose: () => void;
}

export function TemplateForm({ onClose }: TemplateFormProps) {
  const { t } = useTranslation();
  const settings = useSettingsStore();
  const [template, setTemplate] = useState({
    name: '',
    map: 'earth' as const,
    position: { x: 0, y: 0 },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    settings.addTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${settings.theme.isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('template.create')}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('template.name')}
            </label>
            <input
              type="text"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('template.map')}
            </label>
            <select
              value={template.map}
              onChange={(e) => setTemplate({ ...template, map: e.target.value as 'earth' | 'minimap' | '2c2' })}
              className="w-full px-3 py-2 rounded-lg border"
            >
              <option value="earth">Earth</option>
              <option value="minimap">Minimap</option>
              <option value="2c2">2C2</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">X</label>
              <input
                type="number"
                value={template.position.x}
                onChange={(e) => setTemplate({
                  ...template,
                  position: { ...template.position, x: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 rounded-lg border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y</label>
              <input
                type="number"
                value={template.position.y}
                onChange={(e) => setTemplate({
                  ...template,
                  position: { ...template.position, y: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 rounded-lg border"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                settings.theme.isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}