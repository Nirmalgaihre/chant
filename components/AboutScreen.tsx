
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Facebook, Instagram, Globe, Music2, Mail, Sparkles, Star } from 'lucide-react';
import { MAHARAJ_IMAGE_URL } from '../constants';

interface AboutScreenProps {
  likes: number;
  dislikes: number;
  onVote: (type: 'like' | 'dislike') => void;
  hasVoted: boolean;
  darkMode: boolean;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ likes, dislikes, onVote, hasVoted, darkMode }) => {
  const [feedback, setFeedback] = useState('');

  const handleSendEmail = () => {
    if (!feedback.trim()) return;
    const subject = encodeURIComponent("Naam Jap Counter - User Review");
    const body = encodeURIComponent(feedback);
    window.location.href = `mailto:gaihrenirmal2021@gmail.com?subject=${subject}&body=${body}`;
  };

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={18} />, url: 'https://facebook.com/nirmalgaihre.com.np', color: 'bg-[#1877F2]' },
    { name: 'Instagram', icon: <Instagram size={18} />, url: 'https://instagram.com/gaihre_nirmal', color: 'bg-[#E4405F]' },
    { name: 'TikTok', icon: <Music2 size={18} />, url: 'https://tiktok.com/@nir_mal04', color: 'bg-black' },
    { name: 'Website', icon: <Globe size={18} />, url: 'https://nirmalgaihre.com.np/', color: 'bg-orange-600' },
  ];

  return (
    <div className={`p-6 pt-10 space-y-6 animate-in slide-in-from-bottom duration-500 pb-24 overflow-y-auto h-full max-w-md mx-auto no-scrollbar`}>
      {/* App Identity with Maharaj Logo */}
      <header className="text-center">
        <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 shadow-xl overflow-hidden ring-4 ring-orange-100 transition-transform hover:scale-105 active:scale-95`}>
          <img 
            src={MAHARAJ_IMAGE_URL} 
            alt="Naam Jap Counter Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-[#000]'}`}>Naam Jap Counter</h1>
        <p className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Divine Companion</p>
      </header>

      {/* Inspiration Card */}
      <div className={`p-6 rounded-3xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 shadow-xl shadow-black/20' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-start space-x-4 mb-4">
           <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-200">
              <img src={MAHARAJ_IMAGE_URL} alt="Maharaj" className="w-full h-full object-cover" />
           </div>
           <div>
              <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                Our Inspiration
              </h2>
              <p className={`text-xs font-black ${darkMode ? 'text-slate-200' : 'text-[#000]'}`}>Pujya Shri Premanand Ji Maharaj</p>
           </div>
        </div>
        <p className={`leading-relaxed text-sm italic ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          "Inspired by his divine smile and simple path of Radha-Naam, this app is dedicated to all seekers who find peace in the Name."
        </p>
      </div>

      {/* Developer Card */}
      <div className={`p-6 rounded-3xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 shadow-xl shadow-black/20' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full border-2 border-orange-500 p-0.5 overflow-hidden shadow-md">
            <img 
              src="https://nirmalgaihre.com.np/images/nirmalgaihre.jpg" 
              alt="Nirmal Gaihre" 
              className="rounded-full w-full h-full bg-slate-100" 
            />
          </div>
          <div>
            <h3 className={`font-black text-lg ${darkMode ? 'text-white' : 'text-[#000]'}`}>Nirmal Gaihre</h3>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">Junior App Developer</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-5">
          {socialLinks.map((social) => (
            <a 
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center aspect-square rounded-xl transition-all active:scale-90 text-white ${social.color} shadow-sm`}
              title={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Interaction Row */}
      <div className={`p-6 rounded-3xl border flex items-center justify-around ${darkMode ? 'bg-slate-900 border-slate-800 shadow-xl shadow-black/20' : 'bg-white border-slate-100 shadow-sm'}`}>
        <button 
          onClick={() => !hasVoted && onVote('like')}
          disabled={hasVoted}
          className={`flex flex-col items-center gap-1 transition-all group ${hasVoted ? 'opacity-40 grayscale' : 'hover:scale-110 active:scale-125'}`}
        >
          <div className={`p-3 rounded-2xl ${darkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-500'}`}>
            <ThumbsUp size={20} />
          </div>
          <span className={`text-xs font-black ${darkMode ? 'text-slate-300' : 'text-[#000]'}`}>{likes}</span>
        </button>

        <div className={`h-8 w-px ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

        <button 
          onClick={() => !hasVoted && onVote('dislike')}
          disabled={hasVoted}
          className={`flex flex-col items-center gap-1 transition-all group ${hasVoted ? 'opacity-40 grayscale' : 'hover:scale-110 active:scale-125'}`}
        >
          <div className={`p-3 rounded-2xl ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
            <ThumbsDown size={20} />
          </div>
          <span className={`text-xs font-black ${darkMode ? 'text-slate-300' : 'text-[#000]'}`}>{dislikes}</span>
        </button>
      </div>

      {/* Review Section */}
      <div className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800 shadow-xl shadow-black/20' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Submit Feedback</h3>
        <div className="relative">
          <MessageSquare className="absolute top-4 left-4 text-orange-500/40" size={16} />
          <textarea 
            className={`w-full rounded-2xl p-4 pl-11 text-sm font-medium transition-all min-h-[80px] resize-none border-2 focus:outline-none ${darkMode ? 'bg-slate-950 text-white border-slate-800 focus:border-orange-500/50' : 'bg-slate-50 text-[#000] border-transparent focus:border-orange-200'}`}
            placeholder="Share your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <button 
          onClick={handleSendEmail}
          className="w-full py-4 bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Mail size={14} /> Send Message
        </button>
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-4 text-center space-y-4">
        <div className="flex justify-center items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-200"></div>
          <Star size={10} className="text-orange-400 fill-orange-400" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-200"></div>
        </div>
        <div className="space-y-1">
          <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-[#000]'}`}>
            Devotion First
          </p>
          <p className="text-orange-500 text-[9px] font-bold">App Version 1.0.0 • Radhe Radhe</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutScreen;
