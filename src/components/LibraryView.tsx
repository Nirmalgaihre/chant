import React from 'react';
import { Sparkles, Trophy, Star, Info } from 'lucide-react';
import { JAP_MILESTONES } from '../data/milestones';
import { motion } from 'motion/react';

const LibraryView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 pt-8 pb-4">
        <header className="mb-6">
          <h2 className="text-2xl font-serif text-amber-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            नाम जप महिमा
          </h2>
          <p className="text-zinc-500 text-sm">आध्यात्मिक माइलस्टोन र तिनका लाभहरू</p>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mb-8">
            <h3 className="text-amber-200 font-serif text-lg mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              महिमाको परिचय
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              दिव्य नामको शक्ति तपाईको अभ्यासमा अगाडि बढ्दै जाँदा बढ्दै जान्छ। 
              यहाँ महान गुरुहरूले वर्णन गर्नुभएका आध्यात्मिक माइलस्टोनहरू र तिनीहरूका गहिरो लाभहरू छन्।
            </p>
          </div>

          {JAP_MILESTONES.map((milestone, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-amber-100 font-bold">{milestone.crore}</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{milestone.chants} जप</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {milestone.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex gap-3">
                    <div className="mt-1.5 flex-shrink-0">
                      <Star className="w-3 h-3 text-amber-500/60 fill-amber-500/20" />
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mt-12 mb-8 text-center">
            <p className="text-amber-200 font-serif italic text-sm leading-relaxed">
              "नाम जपको अन्तिम फल भनेको कुनै पनि इच्छा बाँकी नरहनु हो। 
              भगवानमा भरोसा राख्नुहोस्, किनकि साँचो समर्पणले कल्पना भन्दा बाहिरको दिव्य हेरचाह ल्याउँछ।"
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LibraryView;
