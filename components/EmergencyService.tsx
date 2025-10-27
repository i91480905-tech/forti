import React from 'react';
import { ArrowLeftIcon, ShieldIcon, ShieldOffIcon, PlayIcon, StopCircleIcon, MessageSquareTextIcon } from '../constants';

interface EmergencyServiceProps {
  onBack: () => void;
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
}

const EmergencyService: React.FC<EmergencyServiceProps> = ({ onBack, isMonitoring, onToggleMonitoring }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center p-4 bg-service-header rounded-lg -mx-4 -mt-4 mb-0 shadow-lg">
        <button onClick={onBack} className="p-2 rounded-full text-white hover:bg-white/20 transition-colors">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-xl font-bold text-center flex-grow text-white">Emergency Service</h2>
        <div className="w-10" /> {/* Spacer */}
      </header>
      
      <section className="text-center flex flex-col items-center justify-center pt-4">
        <div className={`
          w-48 h-48 rounded-full flex flex-col items-center justify-center 
          transition-all duration-500
          ${isMonitoring 
            ? 'bg-green-500/20 animate-pulse' 
            : 'bg-service-inactive'
          }`}
        >
          <div className={`
            transition-colors duration-500 
            ${isMonitoring ? 'text-green-400' : 'text-white/80'}`
          }>
            {isMonitoring ? <ShieldIcon width={80} height={80} /> : <ShieldOffIcon width={80} height={80} />}
          </div>
          <p className={`
            font-semibold mt-2 transition-colors duration-500
            ${isMonitoring ? 'text-green-400' : 'text-white/90'}`
          }>
            Service {isMonitoring ? 'Active' : 'Inactive'}
          </p>
        </div>
      </section>

      <section className="text-center px-2">
        <h3 className="text-2xl font-bold">Emergency Monitoring</h3>
        <p className="text-brand-text-secondary mt-2 max-w-md mx-auto">
          Activate background monitoring to enable instant emergency response and location tracking for your safety.
        </p>
      </section>

      <section className="space-y-4 px-2">
        <button
          onClick={onToggleMonitoring}
          className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-4 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
            isMonitoring 
            ? 'bg-brand-accent text-white' 
            : 'bg-service-action text-white'
          }`}
        >
          {isMonitoring ? <StopCircleIcon /> : <PlayIcon />}
          <span>{isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}</span>
        </button>
        <div
          className="w-full flex items-center justify-center gap-2 font-semibold py-4 px-4 rounded-full bg-service-inactive text-white/80"
        >
          <StopCircleIcon />
          <span>Monitoring {isMonitoring ? 'Active' : 'Deactive'}</span>
        </div>
      </section>

      <section className="px-2">
        <div className="bg-service-header/80 p-5 rounded-xl flex items-start gap-4 text-sm text-white">
          <div className="text-white mt-1">
            <MessageSquareTextIcon />
          </div>
          <div>
            <h4 className="font-bold mb-1">Safety Tip</h4>
            <p className="text-white/80">
              Keep the service active when traveling alone or in unfamiliar areas for enhanced safety.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyService;