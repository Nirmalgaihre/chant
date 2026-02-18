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
} from 'lucide-react';

interface AboutViewProps {
  darkMode?: boolean; // kept for compatibility, but ignored
}

const AboutView: React.FC<AboutViewProps> = () => {
  const darkMode = true; // forced dark mode

  const [currentScreen, setCurrentScreen] = useState<
    'main' | 'privacy' | 'aboutApp' | 'reportProblem' | 'shareApp' | 'chant'
  >('main');
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [feedback, setFeedback] = useState('');

  // ================= HEADER =================
  const Header = () => (
    <div className="text-center py-12 px-6">
      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-xl ring-2 ring-orange-800/50 mb-5">
        <img
          src="https://nirmalgaihre.com.np/images/nirmalgaihre.jpg"
          alt="Nirmal Gaihre - Developer"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-2xl font-bold text-white">
        Nirmal Gaihre
      </h2>

      <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mt-1">
        Developer
      </p>

      <h1 className="text-3xl font-extrabold mt-4 text-white">
        Naam Jap
      </h1>

      <p className="text-sm mt-2 text-zinc-400">
        Version 1.0.1
      </p>

      <a
        href="https://www.nirmalgaihre.com.np/images/naam-jap.apk"
        download="naam-jap.apk"
        className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium shadow-lg transition-all duration-200 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-base"
      >
        Download App (APK)
      </a>

      <p className="mt-3 text-xs text-zinc-500">
        Android APK • Tap to download • Enable "Install unknown apps" in settings to install
      </p>
    </div>
  );

  // ================= MENU ITEMS =================
  const menuItems = [
    { label: 'About Application', icon: <Info size={22} />, screen: 'aboutApp' as const },
    { label: 'Privacy Policy', icon: <Shield size={22} />, screen: 'privacy' as const },
    { label: 'Report a Problem', icon: <MessageSquare size={22} />, screen: 'reportProblem' as const },
    { label: 'Share App', icon: <Share2 size={22} />, screen: 'shareApp' as const },
    { label: 'Chant Website', icon: <Globe size={22} />, screen: 'chant' as const },
    { label: 'Exit App', icon: <LogOut size={22} />, action: () => setShowExitPopup(true) },
  ];

  // ================= MENU LIST =================
  const MenuList = () => (
    <div className="px-5 pb-12 space-y-4 max-w-md mx-auto">
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            if ('screen' in item) setCurrentScreen(item.screen);
            else if (item.action) item.action();
          }}
          className="
            w-full flex items-center justify-between p-5 rounded-2xl
            transition-all duration-200 active:scale-[0.98]
            bg-zinc-800 border border-zinc-700 hover:border-orange-700/50
          "
        >
          <div className="flex items-center gap-4">
            <div className="text-orange-400">
              {item.icon}
            </div>
            <span className="font-medium text-zinc-100">
              {item.label}
            </span>
          </div>
          <ChevronRight size={20} className="text-zinc-500" />
        </button>
      ))}
    </div>
  );

  // ================= EXIT POPUP =================
  const ExitPopup = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="w-full max-w-sm p-8 rounded-3xl shadow-2xl bg-zinc-900 border border-zinc-700">
        <h2 className="text-xl font-bold text-center mb-4 text-white">
          Exit App
        </h2>
        <p className="text-center mb-6 leading-relaxed text-zinc-300">
          Are you sure you want to exit the application?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowExitPopup(false)}
            className="flex-1 py-3.5 rounded-xl font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => window.close()}
            className="flex-1 py-3.5 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );

  // ================= SUB-SCREENS =================
  const BackButton = () => (
    <button
      onClick={() => setCurrentScreen('main')}
      className="flex items-center gap-2 mb-8 text-orange-500 font-medium hover:opacity-90 transition-opacity"
    >
      <ArrowLeft size={20} /> Back
    </button>
  );

  const PrivacyPolicyScreen = () => (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6 text-white">
        Privacy Policy
      </h1>
      <div className="space-y-5 text-base leading-relaxed text-zinc-300">
        <p>• No personal data is collected.</p>
        <p>• All jap counts, streaks and settings are stored only locally on your device.</p>
        <p>• No tracking, no analytics, no advertisements.</p>
        <p>• No data is ever sent to any server.</p>
      </div>
    </div>
  );

  const AboutAppScreen = () => (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6 text-white">
        About Naam Jap
      </h1>
      <div className="space-y-5 text-base leading-relaxed text-zinc-300">
        <p>
          Naam Jap is a simple, distraction-free companion for devotees who practice Radha-Krishna Naam chanting.
        </p>
        <p>
          It offers a digital japa mala, progress tracking, daily goals, and a clean interface — completely free from ads and trackers.
        </p>
        <p>
          Built with devotion and care by Nirmal Gaihre.
        </p>
        <p className="text-sm mt-8 text-zinc-500">
          Version 1.0.1 • 2026
        </p>
      </div>
    </div>
  );

  const ReportProblemScreen = () => {
    const handleSendEmail = () => {
      if (!feedback.trim()) return;
      const subject = encodeURIComponent('Naam Jap App - Feedback / Issue');
      const body = encodeURIComponent(feedback);
      window.location.href = `mailto:gaihrenirmal2021@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6 text-white">
          Report a Problem
        </h1>
        <textarea
          className="
            w-full rounded-2xl p-5 min-h-[160px] text-base resize-none
            bg-zinc-900 text-zinc-100 border border-zinc-700
            placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50
            transition-all
          "
          placeholder="Describe your issue or suggestion..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          onClick={handleSendEmail}
          disabled={!feedback.trim()}
          className={`mt-6 w-full py-4 rounded-2xl font-semibold transition-all ${
            feedback.trim()
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Send Feedback
        </button>
      </div>
    );
  };

  const ShareAppScreen = () => {
    const shareText = `Naam Jap – Simple companion for Radha-Krishna Naam Jap\nhttps://www.nirmalgaihre.com.np`;

    const handleShare = () => {
      if (navigator.share) {
        navigator.share({ title: 'Naam Jap', text: shareText }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard!');
      }
    };

    return (
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6 text-white">
          Share Naam Jap
        </h1>
        <p className="mb-8 text-base leading-relaxed text-zinc-300">
          Help spread the practice of Naam Jap by sharing the app with friends and family.
        </p>
        <button
          onClick={handleShare}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-2xl transition-all shadow-md"
        >
          Share Now
        </button>
      </div>
    );
  };

  const ChantScreen = () => (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6 text-white">
        Chant Website
      </h1>
      <p className="mb-8 text-base leading-relaxed text-zinc-300">
        Visit our devotional chant website for more inspiration and Naam remembrance.
      </p>
      <button
        onClick={() => window.open('https://chant.nirmalgaihre.com.np', '_blank')}
        className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-2xl transition-all shadow-md"
      >
        Open Chant Website
      </button>
    </div>
  );

  // ================= MAIN RENDER =================
  const renderScreen = () => {
    switch (currentScreen) {
      case 'privacy':
        return <PrivacyPolicyScreen />;
      case 'aboutApp':
        return <AboutAppScreen />;
      case 'reportProblem':
        return <ReportProblemScreen />;
      case 'shareApp':
        return <ShareAppScreen />;
      case 'chant':
        return <ChantScreen />;
      default:
        return (
          <>
            <Header />
            <MenuList />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 transition-colors duration-300">
      {renderScreen()}
      {showExitPopup && <ExitPopup />}
    </div>
  );
};

export default AboutView;