import { useState, useEffect } from 'react';

const AppDownloadPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    // Check if user dismissed recently (e.g. within 24 hours)
    const dismissedTime = localStorage.getItem('naai_app_prompt_dismissed');
    if (!dismissedTime || (Date.now() - parseInt(dismissedTime, 10)) > 24 * 60 * 60 * 1000) {
      // Delay prompt slightly for better initial page load perception
      const timer = setTimeout(() => setShowPrompt(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDownload = () => {
    // Trigger APK download
    const link = document.createElement('a');
    link.href = '/SalonNaai.apk';
    link.setAttribute('download', 'SalonNaai.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => {
      setShowPrompt(false);
    }, 2500);
  };

  const handleDismiss = () => {
    localStorage.setItem('naai_app_prompt_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-primary/40 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {downloaded ? (
          <div className="py-2 text-center space-y-2">
            <div className="text-4xl">🎉</div>
            <h3 className="text-lg font-bold text-green-400">Downloading Salon Naai APK...</h3>
            <p className="text-xs text-gray-300">Check your browser downloads to install the app on your mobile device!</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center text-2xl shadow-inner">
                📲
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif tracking-wide">Download Salon Naai App</h3>
                <p className="text-xs text-primary font-medium">Get the Android APK for mobile booking</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              Would you like to download our Android App for a faster appointment booking experience on your phone?
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group"
              >
                <span>Yes, Download APK</span>
                <span className="group-hover:translate-y-0.5 transition-transform">⬇️</span>
              </button>
              <button
                onClick={handleDismiss}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 px-4 rounded-xl text-sm transition-colors border border-gray-700"
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDownloadPrompt;
