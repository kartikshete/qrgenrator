import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Download,
  Share2,
  Sun,
  Moon,
  Link as LinkIcon,
  RefreshCw,
  Settings,
  CheckCircle2,
  Layout,
  Palette,
  QrCode,
  Copy,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';

const App = () => {
  const [url, setUrl] = useState('');
  const [qrColor, setQrColor] = useState('#533427');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('qr-gen-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showCopied, setShowCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('url');

  const qrRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('qr-gen-theme', isDarkMode ? 'dark' : 'light');

    // Update bg color for dark mode if it's default white
    if (isDarkMode && bgColor === '#ffffff') {
      setBgColor('#0c0a09');
    } else if (!isDarkMode && bgColor === '#0c0a09') {
      setBgColor('#ffffff');
    }
  }, [isDarkMode]);

  const downloadQR = (format = 'png') => {
    const svg = document.getElementById('qr-main-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size + (includeMargin ? 40 : 0);
      canvas.height = size + (includeMargin ? 40 : 0);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (format === 'png') {
        canvas.toBlob((blob) => {
          saveAs(blob, `qr-studio-${Date.now()}.png`);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#533427', '#8b5740', '#ffffff']
          });
        });
      } else {
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        saveAs(svgBlob, `qr-studio-${Date.now()}.svg`);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyLink = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const resetGenerator = () => {
    setUrl('');
    setQrColor('#533427');
    setBgColor(isDarkMode ? '#0c0a09' : '#ffffff');
    confetti({
      particleCount: 40,
      velocity: 15,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="min-h-screen smooth-transition flex flex-col p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">

        {/* Navbar */}
        <header className="flex justify-between items-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30">
              <QrCode className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">QR Studio</h1>
              <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest">Premium Generator</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 sm:p-4 glass rounded-2xl shadow-lg border-2 border-stone-100 dark:border-stone-800"
          >
            {isDarkMode ? <Sun className="text-amber-400" /> : <Moon className="text-primary-800" />}
          </motion.button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 flex-1 items-start">

          {/* Left Column: Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Main Input Card */}
            <div className="glass rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden relative border-2 border-white/50 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold">Generate from URL</h2>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary-500 transition-colors">
                  <LinkIcon className="w-5 h-5 opacity-40" />
                </div>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-stone-100/50 dark:bg-stone-800/50 border-2 border-transparent focus:border-primary-500/50 focus:bg-white dark:focus:bg-stone-800 outline-none rounded-2xl py-4 pl-12 pr-4 font-medium smooth-transition shadow-inner"
                />
              </div>

              {url && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-primary-500 transition-colors px-2 py-1"
                  >
                    {showCopied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    {showCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={resetGenerator}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors px-2 py-1 ml-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Customization Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Style Card */}
              <div className="glass rounded-3xl p-6 border-2 border-white/50 dark:border-stone-800">
                <div className="flex items-center gap-2 mb-5">
                  <Palette className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-sm">Theme Colors</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-60">Foreground</span>
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-60">Background</span>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Layout Card */}
              <div className="glass rounded-3xl p-6 border-2 border-white/50 dark:border-stone-800">
                <div className="flex items-center gap-2 mb-5">
                  <Settings className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-sm">QR Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-60">Size ({size}px)</span>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="32"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-24 accent-primary-500"
                    />
                  </div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold opacity-60">Quiet Zone</span>
                    <input
                      type="checkbox"
                      checked={includeMargin}
                      onChange={(e) => setIncludeMargin(e.target.checked)}
                      className="w-4 h-4 rounded accent-primary-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center justify-center p-8 glass rounded-[3rem] border-2 border-primary-500/10 dark:border-primary-500/5 shadow-2xl min-h-[400px]"
          >
            <AnimatePresence mode="wait">
              {url ? (
                <motion.div
                  key="qr-active"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative p-6 sm:p-10 bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl group transition-all duration-700"
                  style={{ backgroundColor: bgColor }}
                >
                  <QRCodeSVG
                    id="qr-main-svg"
                    value={url}
                    size={size}
                    fgColor={qrColor}
                    bgColor={bgColor}
                    includeMargin={includeMargin}
                    level="H"
                    className="smooth-transition"
                  />

                  {/* Floating Action Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 w-max"
                  >
                    <button
                      onClick={() => downloadQR('png')}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all active:scale-95 group/btn overflow-hidden"
                    >
                      <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                      <span>Download PNG</span>
                    </button>
                    <button
                      onClick={() => downloadQR('svg')}
                      className="bg-stone-900 dark:bg-white dark:text-stone-900 text-white font-bold p-3 rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="qr-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-30 animate-pulse">
                    <QrCode className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold opacity-40">Ready to Create</h3>
                  <p className="max-w-[200px] text-sm font-medium opacity-30 leading-relaxed">
                    Paste a link on the left to generate your unique designer QR code instantly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-400 font-medium border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span className="text-sm">Powered by <span className="text-primary-600 dark:text-primary-400 font-bold">Raj Technologies</span></span>
          </div>
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-bold">
            <span className="hover:text-primary-500 cursor-pointer flex items-center gap-1 group">
              Kartik Shete <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

// Component refinement 3
// Component refinement 5
// Component refinement 7
// Component refinement 10