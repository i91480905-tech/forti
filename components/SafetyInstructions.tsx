
import React from 'react';
import { ArrowLeftIcon } from '../constants';

interface SafetyInstructionsProps {
  onBack: () => void;
}

const SafetyInstructions: React.FC<SafetyInstructionsProps> = ({ onBack }) => {
  const instructions = [
    { title: "Be Aware of Your Surroundings", description: "Pay attention to who is around you in public. Avoid distractions like your phone or headphones when walking alone, especially at night." },
    { title: "Trust Your Instincts", description: "If a situation or person feels unsafe, it probably is. Remove yourself from the situation immediately. Don't worry about being polite." },
    { title: "Share Your Plans", description: "Let a friend or family member know where you are going and when you expect to be back. Share your location with trusted contacts." },
    { title: "Secure Your Home", description: "Always lock doors and windows, even when you are home. Consider a home security system or a video doorbell." },
    { title: "Emergency Kit", description: "Keep a basic emergency kit with water, non-perishable food, a flashlight, batteries, a first-aid kit, and any necessary medications." },
    { title: "Online Safety", description: "Be cautious about sharing personal information online. Use strong, unique passwords for different accounts and enable two-factor authentication." }
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-surface transition-colors mr-4">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-2xl font-bold">Safety Instructions</h2>
      </header>
      
      <div className="space-y-4">
        {instructions.map((item, index) => (
          <div key={index} className="bg-brand-surface p-5 rounded-lg">
            <h3 className="font-bold text-lg text-brand-text-primary mb-1">{item.title}</h3>
            <p className="text-brand-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyInstructions;
