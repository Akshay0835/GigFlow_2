import { create } from 'zustand';

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Check local storage or system preference initially
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: getInitialTheme(),
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDarkMode;
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    return { isDarkMode: newIsDark };
  }),
}));

export default useThemeStore;
