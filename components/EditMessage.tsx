import React, { useState } from 'react';
import { ArrowLeftIcon, MessageSquareTextIcon, EyeIcon, RotateCwIcon, SaveIcon, LightbulbIcon } from '../constants';

interface EditMessageProps {
  currentMessage: string;
  defaultMessage: string;
  onSave: (message: string) => void;
  onBack: () => void;
}

const MAX_MESSAGE_LENGTH = 160;

const EditMessage: React.FC<EditMessageProps> = ({ currentMessage, defaultMessage, onSave, onBack }) => {
  const [message, setMessage] = useState(currentMessage);

  const handleSave = () => {
    if (message.trim()) {
      onSave(message);
    } else {
        alert("SOS message cannot be empty.");
    }
  };
  
  const handleReset = () => {
    setMessage(defaultMessage);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center p-4 bg-slate-700 rounded-lg -mx-4 -mt-4 mb-0 shadow-lg">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-xl font-bold text-center flex-grow">Edit Emergency Message</h2>
        <div className="w-10" /> {/* Spacer */}
      </header>
      
      <div className="bg-slate-700/80 p-4 rounded-lg flex items-start space-x-3">
        <MessageSquareTextIcon />
        <p className="text-sm text-brand-text-secondary flex-1">
          This message will be sent to your emergency contacts along with your location during an SOS alert.
        </p>
      </div>

      <div className="bg-brand-surface p-5 rounded-xl space-y-3">
        <h3 className="font-bold text-lg text-brand-text-primary">Emergency Message</h3>
        <p className="text-sm text-brand-text-secondary -mt-2">Enter your emergency message</p>
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={MAX_MESSAGE_LENGTH}
            className="w-full bg-brand-primary p-3 rounded-md border border-transparent focus:ring-2 focus:ring-brand-action focus:outline-none resize-none"
            placeholder="I am in DANGER, i need help. Please urgently reach me out."
          />
          <div className="flex justify-between items-center text-xs text-brand-text-secondary mt-1 px-1">
            <span>Keep it clear and concise for quick understanding</span>
            <span>{message.length}/{MAX_MESSAGE_LENGTH}</span>
          </div>
        </div>
      </div>

      <div className="bg-brand-surface p-5 rounded-xl space-y-3">
        <div className="flex items-center gap-3">
            <EyeIcon />
            <h3 className="font-bold text-lg text-brand-text-primary">Message Preview</h3>
        </div>
        <div className="bg-slate-600 p-4 rounded-md text-sm text-brand-text-secondary italic">
          {message.trim() ? (
            <>
              <p>{message}</p>
              <p className="mt-2 text-sky-300/80 not-italic font-medium">[Your current location will be automatically added here]</p>
            </>
          ) : (
            <p>Your message will appear here as your contacts will see it, including location coordinates.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-brand-primary text-brand-text-primary font-bold py-3 px-4 rounded-lg hover:bg-brand-primary/80 transition-colors"
        >
            <RotateCwIcon />
            Reset to Default
        </button>
        <button 
            onClick={handleSave} 
            className="flex items-center justify-center gap-2 bg-brand-action text-brand-bg font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          <SaveIcon />
          Save Message
        </button>
      </div>

      <div className="bg-brand-secondary/70 p-5 rounded-xl space-y-3 border border-brand-secondary">
        <div className="flex items-center gap-3 text-violet-300">
            <LightbulbIcon />
            <h3 className="font-bold text-lg">Quick Tips</h3>
        </div>
        <ul className="list-disc list-inside text-sm text-brand-text-primary/90 space-y-1 pl-1">
          <li>Keep your message brief but informative</li>
          <li>Include your name for easy identification</li>
          <li>Mention any specific medical conditions if relevant</li>
          <li>Your location will be automatically added</li>
        </ul>
      </div>
    </div>
  );
};

export default EditMessage;