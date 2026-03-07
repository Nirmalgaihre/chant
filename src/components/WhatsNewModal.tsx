import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APP_VERSION } from '../constants';

const WHATS_NEW_DATA = {
  version: APP_VERSION,
  features: [
    {
      title: 'नयाँ मन्त्र सूची',
      description: 'तपाईको आध्यात्मिक अभ्यासको लागि १० वटा नयाँ र शक्तिशाली मन्त्रहरू थपिएका छन्।',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />
    },
    {
      title: 'जप तथ्याङ्क चार्ट',
      description: 'अब तपाईले ७ दिन, १५ दिन वा ३० दिनको जप तथ्याङ्क चार्टमा हेर्न सक्नुहुन्छ।',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'विकासकर्ता प्रोफाइल',
      description: 'एपको बारेमा सेक्सनमा विकासकर्ताको जानकारी र सामाजिक सञ्जाल लिङ्कहरू थपिएका छन्।',
      icon: <ArrowRight className="w-5 h-5 text-blue-400" />
    }
  ]
};

const WhatsNewModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem('whats_new_seen_version');
    if (lastSeenVersion !== APP_VERSION) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('whats_new_seen_version', APP_VERSION);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-amber-100 mb-1">नयाँ के छ?</h2>
                  <p className="text-zinc-500 text-sm font-mono">संस्करण {APP_VERSION}</p>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 mb-8">
                {WHATS_NEW_DATA.features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-amber-200 font-medium mb-1">{feature.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleClose}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-900/20"
              >
                सुरु गरौं
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsNewModal;
