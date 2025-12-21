import { useState, useEffect } from 'react';

import { ConfigProvider, theme as antdTheme } from 'antd';

import { AppLayout } from './components/AppLayout';
import { PrivacyModal } from './components/PrivacyModal';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleThemeChange = (dark: boolean) => {
    setIsDark(dark);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <PrivacyModal />
      <AppLayout isDark={isDark} onThemeChange={handleThemeChange} />
    </ConfigProvider>
  );
}

export default App;
