import React, { useState, useEffect } from 'react';
import { SirenIcon } from '../constants';

interface SOSCountdownProps {
  onCancel: () => void;
  onConfirm: () => void;
  message: string;
}

const SOS_COUNTDOWN_SECONDS = 5;

const SOSCountdown: React.FC<SOSCountdownProps> = ({ onCancel, onConfirm, message }) => {
    const [countdown, setCountdown] = useState(SOS_COUNTDOWN_SECONDS);

    useEffect(() => {
        // Prevent scrolling of the background page
        document.body.style.overflow = 'hidden';
        
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onConfirm();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
            clearInterval(timer);
        };
    }, [onConfirm]);

    return (
        <div className="fixed inset-0 bg-brand-bg/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 text-center animate-fade-in text-brand-text-primary">
            <div className="text-brand-accent animate-pulse">
                <SirenIcon />
            </div>
            <h1 className="text-3xl font-bold text-brand-accent mt-4">EMERGENCY DETECTED</h1>
            <p className="text-brand-text-secondary mt-2">Sending SOS to your emergency contacts in...</p>

            <div className="text-9xl font-bold my-8 text-white">{countdown}</div>

            <div className="bg-brand-surface p-4 rounded-lg w-full max-w-sm mb-8">
                <p className="text-sm text-brand-text-secondary mb-2">Message to be sent:</p>
                <p className="text-sm italic">"{message}"</p>
            </div>
            
            <button 
                onClick={onCancel}
                className="w-full max-w-sm bg-brand-primary hover:bg-brand-surface text-white font-bold py-4 px-4 rounded-lg transition-colors text-lg"
            >
                Cancel
            </button>
        </div>
    );
};

export default SOSCountdown;
