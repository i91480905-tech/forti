
import React, { useState, useEffect } from 'react';
import { HelplineContact } from '../types';
import { ArrowLeftIcon, EditIcon, PhoneIcon, AmbulanceIcon, FlameIcon, ShieldIcon, TriangleAlertIcon, SaveIcon, InfoIcon } from '../constants';

const DEFAULT_HELPLINES: HelplineContact[] = [
  { id: '1', name: 'Ambulance', number: '108', icon: 'ambulance' },
  { id: '2', name: 'Gas leak', number: '1906', icon: 'alert' },
  { id: '3', name: 'Disaster Management', number: '104', icon: 'alert' },
  { id: '4', name: 'Police', number: '100', icon: 'shield' },
  { id: '5', name: 'Fire Management', number: '101', icon: 'flame' },
];

const iconMap: { [key: string]: React.ReactNode } = {
  ambulance: <AmbulanceIcon />,
  flame: <FlameIcon />,
  shield: <ShieldIcon />,
  alert: <TriangleAlertIcon />,
};

interface HelplineProps {
  onBack: () => void;
  onCall: (number: string) => void;
}

const Helpline: React.FC<HelplineProps> = ({ onBack, onCall }) => {
  const [helplines, setHelplines] = useState<HelplineContact[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      const storedHelplines = localStorage.getItem('emergency-helplines');
      if (storedHelplines) {
        setHelplines(JSON.parse(storedHelplines));
      } else {
        setHelplines(DEFAULT_HELPLINES);
      }
    } catch (error) {
      console.error("Failed to load helplines from localStorage", error);
      setHelplines(DEFAULT_HELPLINES);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('emergency-helplines', JSON.stringify(helplines));
      setIsEditing(false);
      alert("Helpline numbers saved!");
    } catch (error) {
      console.error("Failed to save helplines to localStorage", error);
      alert("Failed to save helpline numbers.");
    }
  };
  
  const handleNumberChange = (id: string, value: string) => {
    setHelplines(current => current.map(h => h.id === id ? { ...h, number: value.replace(/[^0-9]/g, '') } : h));
  };
  
  const handleNameChange = (id: string, value: string) => {
    setHelplines(current => current.map(h => h.id === id ? { ...h, name: value } : h));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-surface transition-colors">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-2xl font-bold text-center flex-grow">Emergency Helpline</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-full hover:bg-brand-surface transition-colors w-14 h-10 flex items-center justify-center">
          {isEditing ? <span className="text-sm font-semibold">Cancel</span> : <EditIcon />}
        </button>
      </header>

      <div className="bg-brand-surface p-5 rounded-xl space-y-4">
        {helplines.map((item) => (
          <div key={item.id} className="bg-brand-primary p-4 rounded-lg flex items-center justify-between transition-all duration-300 min-h-[72px]">
            <div className="flex items-center gap-4 flex-grow">
              <div className="bg-brand-secondary/50 p-3 rounded-full flex-shrink-0">
                {iconMap[item.icon] || <PhoneIcon />}
              </div>
              {isEditing ? (
                  <div className="flex-grow grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleNameChange(item.id, e.target.value)}
                      className="w-full bg-brand-primary/50 text-brand-text-primary placeholder-brand-text-secondary p-2 rounded-md border border-brand-primary focus:ring-2 focus:ring-brand-action focus:outline-none"
                      placeholder="Service Name"
                    />
                    <input
                      type="tel"
                      value={item.number}
                      onChange={(e) => handleNumberChange(item.id, e.target.value)}
                      className="w-full bg-brand-primary/50 text-brand-text-primary placeholder-brand-text-secondary p-2 rounded-md border border-brand-primary focus:ring-2 focus:ring-brand-action focus:outline-none"
                      placeholder="Number"
                    />
                  </div>
              ) : (
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-brand-text-primary">{item.name}</h3>
                  <p className="text-md text-brand-text-secondary">{item.number}</p>
                </div>
              )}
            </div>
            {!isEditing && (
              <button 
                onClick={() => onCall(item.number)} 
                className="flex items-center gap-2 bg-brand-action text-brand-bg font-bold py-2 px-4 rounded-full hover:opacity-90 transition-opacity shadow-lg transform hover:scale-105 ml-4"
              >
                <PhoneIcon width={16} height={16} />
                <span>Call</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <button onClick={handleSave} className="w-full flex items-center justify-center gap-3 bg-brand-action text-brand-bg font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg">
          <SaveIcon />
          Save Changes
        </button>
      )}

      <div className="bg-brand-surface p-5 rounded-xl flex items-start gap-3 text-sm text-brand-text-secondary">
        <InfoIcon className="w-8 h-8 flex-shrink-0 mt-1" />
        <p><strong>Note:</strong> Please verify and edit these numbers according to your local emergency services. The pre-filled numbers are for general reference and may not be accurate for your region.</p>
      </div>
    </div>
  );
};

export default Helpline;
