import React, { useState, useEffect } from 'react';
import { Volume2, Square, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Farmer Voice Assistant / Text-to-Speech component
 * Runs 100% in-browser via Web Speech API with zero external dependencies.
 * Speaks in Hindi or English depending on selected language.
 */
const VoiceSpeaker = ({ 
  text, 
  title = "सलाह सुनें (Listen)", 
  className = "",
  size = "md"
}) => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (language === 'hi') {
      selectedVoice = voices.find(v => v.lang.startsWith('hi')) || 
                      voices.find(v => v.lang.includes('IN'));
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9; // Slightly slower for clarity
    } else if (language === 'pa') {
      selectedVoice = voices.find(v => v.lang.startsWith('pa')) || 
                      voices.find(v => v.lang.startsWith('hi')) || 
                      voices.find(v => v.lang.includes('IN'));
      utterance.lang = 'pa-IN';
      utterance.rate = 0.9;
    } else {
      selectedVoice = voices.find(v => v.lang === 'en-IN') || 
                      voices.find(v => v.lang.startsWith('en'));
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs gap-1.5' 
    : size === 'lg'
      ? 'px-4 py-2.5 text-sm gap-2.5 font-bold'
      : 'px-3.5 py-2 text-xs sm:text-sm gap-2 font-semibold';

  return (
    <button
      onClick={handleSpeak}
      type="button"
      className={`inline-flex items-center justify-center rounded-2xl transition-all duration-200 shadow-xs border ${
        isSpeaking
          ? 'bg-amber-600 text-white border-amber-700 animate-pulse ring-2 ring-amber-300'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 hover:shadow-md'
      } ${sizeClasses} ${className}`}
      title={isSpeaking ? "आवाज़ बंद करें (Stop Audio)" : "बोलकर सुनाएं (Read aloud)"}
      aria-label={isSpeaking ? "Stop Voice Reading" : "Read aloud"}
    >
      {isSpeaking ? (
        <>
          <Square size={size === 'sm' ? 14 : 16} className="fill-current" />
          <span>रोकें (Stop)</span>
          <span className="flex gap-0.5 items-center ml-1">
            <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-2 bg-white rounded-full animate-bounce"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 size={size === 'sm' ? 15 : 18} />
          <span>{title}</span>
        </>
      )}
    </button>
  );
};

export default VoiceSpeaker;
