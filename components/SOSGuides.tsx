
import React from 'react';
import { ArrowLeftIcon } from '../constants';

interface SOSGuidesProps {
  onBack: () => void;
}

const SOSGuides: React.FC<SOSGuidesProps> = ({ onBack }) => {
  const guides = [
    { 
      title: "Using Shake-to-Alert", 
      description: "1. Go to 'Emergency Mode' from the dashboard.\n2. Tap 'Start Monitoring' to activate the service.\n3. If you're in danger, shake your phone vigorously.\n4. A 5-second countdown will begin before an SOS is sent to ALL your emergency contacts.\n5. You can tap 'Cancel' during the countdown to stop a false alarm." 
    },
    { 
      title: "Sending a Targeted SOS", 
      description: "Need to alert a specific person? \n1. Go to the 'Contacts' screen.\n2. Find the contact you wish to alert.\n3. Tap the message icon next to their name.\n4. This will immediately prepare an SOS message with your location for that single contact." 
    },
    { 
      title: "Managing Your Contacts", 
      description: "Your contacts are your lifeline.\n• Add at least 2-3 trusted people who are likely to be responsive.\n• Double-check that their phone numbers are correct.\n• Let them know they are your emergency contact so they understand the importance of an alert from you." 
    },
    { 
      title: "SOS vs. Helpline: What's the Difference?", 
      description: "• The SOS Feature (Shake-to-Alert or from Contacts) sends your custom text message and location to your personal, pre-saved contacts.\n• The Helpline provides one-tap buttons to directly CALL official emergency services (e.g., Police, Ambulance). Helpline calls do not send your custom SOS message." 
    },
  ];
  
  return (
    <div className="space-y-6">
      <header className="flex items-center">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-surface transition-colors mr-4">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-2xl font-bold">SOS Guides</h2>
      </header>
      
      <div className="space-y-4">
        {guides.map((item, index) => (
          <div key={index} className="bg-brand-surface p-5 rounded-lg">
            <h3 className="font-bold text-lg text-brand-text-primary mb-1">{item.title}</h3>
            <p className="text-brand-text-secondary whitespace-pre-line">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOSGuides;
