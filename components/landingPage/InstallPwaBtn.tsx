'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Simple design: Only show if possible to install & not already installed
  // if (isInstalled || !isInstallable) {
  //   return null;
  // }

  return (
    <div className="w-full flex justify-center mt-6">
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 bg-white border border-gray-300 hover:border-blue-500 text-gray-800 hover:text-blue-600 font-medium px-5 py-2 rounded-md shadow transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label="Installer l'application sur votre bureau"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 16v-8m0 0l-4 4m4-4l4 4M4 20h16"
          />
        </svg>
        <span>Installer sur le bureau</span>
      </button>
    </div>
  );
}