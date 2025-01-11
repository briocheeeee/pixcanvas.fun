import { create } from 'zustand';

interface ThemeType {
  name: 'dark-round' | 'dark' | 'light' | 'light-round';
  isDark: boolean;
  isRound: boolean;
}

interface OverlayTemplate {
  name: string;
  map: 'earth' | 'minimap' | '2c2';
  position: { x: number; y: number };
}

interface SettingsState {
  showGrid: boolean;
  showPixelActivity: boolean;
  enablePixelPosition: boolean;
  theme: ThemeType;
  language: string;
  overlay: {
    enabled: boolean;
    autoColor: boolean;
    templates: OverlayTemplate[];
  };
  setShowGrid: (show: boolean) => void;
  setShowPixelActivity: (show: boolean) => void;
  setEnablePixelPosition: (enable: boolean) => void;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: string) => void;
  setOverlayEnabled: (enabled: boolean) => void;
  setAutoColor: (enabled: boolean) => void;
  addTemplate: (template: OverlayTemplate) => void;
  removeTemplate: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  showGrid: false,
  showPixelActivity: true,
  enablePixelPosition: true,
  theme: {
    name: 'light',
    isDark: false,
    isRound: false,
  },
  language: 'en',
  overlay: {
    enabled: false,
    autoColor: false,
    templates: [],
  },
  setShowGrid: (show) => set({ showGrid: show }),
  setShowPixelActivity: (show) => set({ showPixelActivity: show }),
  setEnablePixelPosition: (enable) => set({ enablePixelPosition: enable }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (lang) => set({ language: lang }),
  setOverlayEnabled: (enabled) => 
    set((state) => ({ 
      overlay: { ...state.overlay, enabled } 
    })),
  setAutoColor: (autoColor) => 
    set((state) => ({ 
      overlay: { ...state.overlay, autoColor } 
    })),
  addTemplate: (template) =>
    set((state) => ({
      overlay: {
        ...state.overlay,
        templates: [...state.overlay.templates, template],
      },
    })),
  removeTemplate: (name) =>
    set((state) => ({
      overlay: {
        ...state.overlay,
        templates: state.overlay.templates.filter((t) => t.name !== name),
      },
    })),
}));