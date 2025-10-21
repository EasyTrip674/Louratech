'use client';

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <p className="mb-2">Installer l'application sur votre appareil</p>
      <button
        onClick={handleInstall}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Installer
      </button>
      <button
        onClick={() => setShowInstall(false)}
        className="ml-2 text-gray-500"
      >
        Plus tard
      </button>
    </div>
  );
}