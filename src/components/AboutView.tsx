import React from 'react';
import { Info, Heart } from 'lucide-react';
import { APP_VERSION } from '../constants';

const AboutView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32">
      <header className="mb-8">
        <h2 className="text-2xl font-serif text-amber-100 flex items-center gap-2">
          <Info className="w-6 h-6 text-amber-400" />
          एपको बारेमा
        </h2>
        <p className="text-zinc-500 text-sm">तपाईको दैनिक अभ्यासको लागि आध्यात्मिक साथी</p>
      </header>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-amber-200 font-medium mb-3">हाम्रो मिशन</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            नाम जप काउन्टर तपाईको मन्त्र जप अभ्यासलाई निरन्तरता दिन मद्दत गर्न डिजाइन गरिएको हो। 
            परम्परागत आध्यात्मिक मूल्यहरूलाई आधुनिक प्रविधिसँग जोडेर, हामी तपाईको आध्यात्मिक यात्रालाई 
            अझ व्यवस्थित र फलदायी बनाउने लक्ष्य राख्छौं।
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-amber-200 font-medium mb-3">विशेषताहरू</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
              <span>सटीक माला गणना (१०८, ५४, २७)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
              <span>विस्तृत अभ्यास तथ्याङ्क र इतिहास</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
              <span>अनुकूल मन्त्र समर्थन</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
              <span>प्रगति ट्र्याकिङ र माइलस्टोनहरू</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between text-zinc-500 text-xs uppercase tracking-widest">
            <span>संस्करण</span>
            <span>{APP_VERSION}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-500 text-xs uppercase tracking-widest">
            <span>विकासकर्ता</span>
            <span className="text-amber-400/80">Nirmal Gaihre</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-amber-200 font-medium mb-4 flex items-center gap-2">
            विकासकर्ता प्रोफाइल
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <a href="https://facebook.com/nirmalgaihre.com.np" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs text-zinc-400 hover:bg-white/10 transition-colors">Facebook</a>
              <a href="https://instagram.com/gaihre_nirmal" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs text-zinc-400 hover:bg-white/10 transition-colors">Instagram</a>
              <a href="https://tiktok.com/@nir_mal04" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs text-zinc-400 hover:bg-white/10 transition-colors">TikTok</a>
              <a href="https://github.com/nirmalgaihre" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs text-zinc-400 hover:bg-white/10 transition-colors">GitHub</a>
            </div>

            <div className="pt-4">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">प्राविधिक सीपहरू</p>
              <div className="flex flex-wrap gap-2">
                {['Git', 'GitHub', 'Docker', 'AWS', 'Linux', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Postman', 'REST API', 'GraphQL', 'WebSockets', 'IoT', 'Arduino', 'Raspberry Pi'].map(skill => (
                  <span key={skill} className="px-2 py-1 bg-amber-500/10 text-amber-400/80 rounded text-[10px] font-medium border border-amber-500/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-600 text-sm">
            <span>समुदायको लागि</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>का साथ बनाइएको</span>
          </div>
          <div className="text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-medium mt-2">
            © Nirmal Gaihre 2082
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
