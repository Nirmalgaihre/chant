import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Info,
  MessageSquare,
  Share2,
  Globe,
  LogOut,
  Facebook,
  Instagram,
  Music, // using Music as fallback for TikTok vibe; or keep custom SVG
} from 'lucide-react';

const AboutView: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<
    'main' | 'privacy' | 'aboutApp' | 'reportProblem' | 'shareApp' | 'chant'
  >('main');
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [feedback, setFeedback] = useState('');

  // ================= HEADER =================
  const Header = () => (
    <div className="text-center pt-10 pb-8 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-lg ring-1 ring-zinc-700 mb-4">
        <img
          src="https://nirmalgaihre.com.np/images/nirmalgaihre.jpg"
          alt="Nirmal Gaihre - Developer"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-xl font-semibold text-white">Nirmal Gaihre</h2>
      <p className="text-sm text-zinc-400 mt-1">Developer</p>
      <h1 className="text-2xl font-bold mt-6 text-white">Naam Jap</h1>
      <p className="text-sm text-zinc-500 mt-1">Version 1.0.1</p>

      <a
        href="https://www.nirmalgaihre.com.np/images/naam-jap.apk"
        download="naam-jap.apk"
        className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-3.5 
                   rounded-lg font-medium shadow-md transition-colors
                   bg-orange-600/90 hover:bg-orange-600 text-white text-base
                   border border-orange-700/30 active:bg-orange-700"
      >
        Download APK
      </a>
      <p className="mt-2 text-xs text-zinc-600">
        Android • Enable unknown sources to install
      </p>
    </div>
  );

  // ================= PROFESSIONAL SOCIAL SECTION =================
  const SocialConnect = () => (
    <div className="px-6 py-10 border-t border-zinc-800">
      <h3 className="text-lg font-semibold text-center text-white mb-6">
        Connect with the Developer
      </h3>
      <div className="flex justify-center gap-10 sm:gap-16 flex-wrap">
        <a
          href="https://www.facebook.com/nirmalgaihre.com.np"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center transition-transform hover:-translate-y-1"
          aria-label="Follow on Facebook"
        >
          <div className="w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center mb-2 
                          group-hover:bg-blue-600/20 transition-colors">
            <Facebook size={28} className="text-blue-500" />
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-blue-400">
            Facebook
          </span>
        </a>

        <a
          href="https://instagram.com/gaihre_nirmal"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center transition-transform hover:-translate-y-1"
          aria-label="Follow on Instagram"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mb-2 
                          group-hover:from-pink-500 group-hover:to-purple-500 transition-all">
            <Instagram size={28} className="text-white" />
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-pink-400">
            Instagram
          </span>
        </a>

        <a
          href="https://www.tiktok.com/@nir_mal04"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center transition-transform hover:-translate-y-1"
          aria-label="Follow on TikTok"
        >
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-2 
                          group-hover:bg-zinc-900 transition-colors">
            <Music size={28} className="text-white" /> {/* fallback icon */}
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
            TikTok
          </span>
        </a>
      </div>
      <p className="text-center text-sm text-zinc-600 mt-8">
        Stay updated with development news & devotional content
      </p>
    </div>
  );

  // ================= MENU ITEMS =================
  const menuItems = [
    { label: 'About Application', icon: <Info size={20} />, screen: 'aboutApp' as const },
    { label: 'Privacy Policy', icon: <Shield size={20} />, screen: 'privacy' as const },
    { label: 'Report a Problem', icon: <MessageSquare size={20} />, screen: 'reportProblem' as const },
    { label: 'Share App', icon: <Share2 size={20} />, screen: 'shareApp' as const },
    { label: 'Chant Website', icon: <Globe size={20} />, screen: 'chant' as const },
    { label: 'Exit App', icon: <LogOut size={20} />, action: () => setShowExitPopup(true) },
  ];

  // ================= MENU LIST =================
  const MenuList = () => (
    <div className="px-5 pb-12 space-y-3 max-w-md mx-auto">
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            if ('screen' in item) setCurrentScreen(item.screen);
            else if (item.action) item.action();
          }}
          className="
            w-full flex items-center justify-between px-5 py-4 rounded-xl
            bg-zinc-900 border border-zinc-800 hover:border-zinc-700
            transition-colors duration-200 active:bg-zinc-800/70
          "
        >
          <div className="flex items-center gap-4">
            <div className="text-orange-500/90">{item.icon}</div>
            <span className="font-medium text-zinc-100">{item.label}</span>
          </div>
          <ChevronRight size={18} className="text-zinc-600" />
        </button>
      ))}
    </div>
  );

  // ================= EXIT POPUP =================
  const ExitPopup = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
        <h2 className="text-xl font-semibold text-center mb-4 text-white">Exit Application</h2>
        <p className="text-center mb-8 text-zinc-400">
          Are you sure you want to exit?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowExitPopup(false)}
            className="flex-1 py-3.5 rounded-xl font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => alert('Exit not supported in browser version')}
            className="flex-1 py-3.5 rounded-xl font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );

  // ================= BACK BUTTON =================
  const BackButton = () => (
    <button
      onClick={() => setCurrentScreen('main')}
      className="flex items-center gap-2 mb-8 text-orange-500 font-medium hover:text-orange-400 transition-colors"
    >
      <ArrowLeft size={18} /> Back
    </button>
  );

  // ================= SCREENS (kept mostly same, minor typography tweaks) =================
  const PrivacyPolicyScreen = () => (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-semibold mb-6 text-white">Privacy Policy</h1>
      <div className="space-y-4 text-base text-zinc-300 leading-relaxed">
        <p>• No personal data is collected.</p>
        <p>• All data (jap counts, streaks, settings) is stored locally only.</p>
        <p>• No tracking, analytics, or advertisements.</p>
        <p>• No information is transmitted to any server.</p>
      </div>
    </div>
  );

  const AboutAppScreen = () => (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-semibold mb-6 text-white">About Naam Jap</h1>
      <div className="space-y-5 text-zinc-300 leading-relaxed">
        <p>Naam Jap is a minimalist, focused tool for devotees practicing Radha-Krishna Naam chanting.</p>
        <p>It provides a clean digital japa mala, streak tracking, daily goals, and offline-first experience — free of distractions, ads, and trackers.</p>
        <p>Developed with care by Nirmal Gaihre.</p>
        <p className="text-sm text-zinc-500 mt-8">Version 1.0.1 • 2026</p>
      </div>
    </div>
  );

  const ReportProblemScreen = () => {
    const handleSendEmail = () => {
      if (!feedback.trim()) return;
      const subject = encodeURIComponent('Naam Jap – Feedback / Report');
      const body = encodeURIComponent(feedback);
      window.location.href = `mailto:gaihrenirmal2021@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-semibold mb-6 text-white">Report a Problem</h1>
        <textarea
          className="
            w-full rounded-xl p-4 min-h-[140px] text-base resize-none
            bg-zinc-900 text-zinc-100 border border-zinc-800
            placeholder-zinc-600 focus:outline-none focus:border-orange-600/50
            transition-all
          "
          placeholder="Describe the issue or share your suggestion..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          onClick={handleSendEmail}
          disabled={!feedback.trim()}
          className={`mt-6 w-full py-3.5 rounded-xl font-medium transition-colors ${
            feedback.trim()
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          Send Feedback
        </button>
      </div>
    );
  };

  const ShareAppScreen = () => {
    const shareText = `Naam Jap – Clean companion for Radha-Krishna Naam Jap\nhttps://www.nirmalgaihre.com.np`;

    const handleShare = () => {
      if (navigator.share) {
        navigator.share({ title: 'Naam Jap', text: shareText }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard');
      }
    };

    return (
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-semibold mb-6 text-white">Share Naam Jap</h1>
        <p className="mb-8 text-zinc-300">
          Support the chanting community by sharing the app with others.
        </p>
        <button
          onClick={handleShare}
          className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          Share App
        </button>
      </div>
    );
  };

  const ChantScreen = () => (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-semibold mb-6 text-white">Chant Website</h1>
      <p className="mb-8 text-zinc-300">
        Explore more devotional content and Naam inspiration on our website.
      </p>
      <button
        onClick={() => window.open('https://chant.nirmalgaihre.com.np', '_blank', 'noopener,noreferrer')}
        className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors shadow-sm"
      >
        Visit Chant Website
      </button>
    </div>
  );

  // ================= MAIN RENDER =================
  const renderScreen = () => {
    switch (currentScreen) {
      case 'privacy':     return <PrivacyPolicyScreen />;
      case 'aboutApp':    return <AboutAppScreen />;
      case 'reportProblem': return <ReportProblemScreen />;
      case 'shareApp':    return <ShareAppScreen />;
      case 'chant':       return <ChantScreen />;
      default:
        return (
          <>
            <Header />
            <MenuList />
            <SocialConnect />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {renderScreen()}
      {showExitPopup && <ExitPopup />}
    </div>
  );
};

export default AboutView;