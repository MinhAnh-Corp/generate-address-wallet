import { useState, useEffect } from 'react';

import { ConfigProvider, theme as antdTheme } from 'antd';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import { CosmosWalletGenerator } from './components/CosmosWalletGenerator';
import { EncryptWallet } from './components/EncryptWallet';
import { MnemonicGenerator } from './components/MnemonicGenerator';
import { PrivacyModal } from './components/PrivacyModal';
import { RPCTester } from './components/RPCTester';
import { UniversalWalletGenerator } from './components/UniversalWalletGenerator';
import { Welcome } from './components/Welcome';
import { WhoWeAre } from './components/WhoWeAre';
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
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            itemSelectedBg: isDark ? 'rgba(255, 255, 255, 0.08)' : undefined,
          },
        },
      }}
    >
      <BrowserRouter>
        <PrivacyModal />
        <AppLayout isDark={isDark} onThemeChange={handleThemeChange}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/mnemonic-generator" element={<MnemonicGenerator />} />
            <Route path="/universal" element={<UniversalWalletGenerator />} />
            <Route path="/cosmos-converter" element={<CosmosWalletGenerator />} />
            <Route path="/rpc-tester" element={<RPCTester />} />
            <Route path="/encrypt-wallet" element={<EncryptWallet />} />
            <Route path="/who-we-are" element={<WhoWeAre />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
