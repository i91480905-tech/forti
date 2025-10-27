import React from 'react';
import { View } from '../types';
import { PlusIcon, UsersIcon, PhoneIcon, EditIcon, InfoIcon, BookOpenIcon, ChevronRightIcon, PowerIcon, UserCircleIcon, CrownIcon } from '../constants';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {

  const handleEmergencyClick = () => {
    onNavigate('emergencyService');
  };
    
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-brand-text-primary">FortiGuard</h1>
          <p className="text-lg text-brand-text-secondary">Help is just one tap away</p>
        </div>
        <button onClick={() => onNavigate('profile')} className="p-2 rounded-full hover:bg-brand-surface transition-colors">
            <UserCircleIcon />
        </button>
      </header>
      
      <section>
        <button 
            onClick={handleEmergencyClick}
            className="w-full bg-brand-accent text-white p-6 rounded-2xl flex items-center justify-between shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50">
          <div>
            <h2 className="text-2xl font-bold">Emergency Mode</h2>
            <p className="text-sm opacity-90">Activate shake-to-alert service</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <PowerIcon />
          </div>
        </button>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionButton icon={<PlusIcon />} label="Add Contact" color="bg-brand-secondary" onClick={() => onNavigate('addContact')} />
          <QuickActionButton icon={<UsersIcon />} label="Contacts" color="bg-brand-primary" onClick={() => onNavigate('contacts')} />
          <QuickActionButton icon={<PhoneIcon />} label="Helpline" color="bg-brand-primary" onClick={() => onNavigate('helpline')} />
          <QuickActionButton icon={<EditIcon />} label="Edit Message" color="bg-brand-primary" onClick={() => onNavigate('editMessage')} />
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-4">Safety Resources</h3>
        <div className="space-y-3">
          <ResourceItem icon={<InfoIcon />} title="Safety Instructions" subtitle="Learn essential safety tips" onClick={() => onNavigate('safetyInstructions')} />
          <ResourceItem icon={<BookOpenIcon />} title="SOS Guides" subtitle="Emergency response procedures" onClick={() => onNavigate('sosGuides')} />
          <ResourceItem icon={<CrownIcon />} title="Go Premium" subtitle="Unlock all features" onClick={() => onNavigate('subscription')} />
        </div>
      </section>
    </div>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className={`p-6 ${color} rounded-2xl text-left flex flex-col justify-between h-32 transform hover:-translate-y-1 transition-transform duration-300 shadow-md`}>
    <div className="bg-white/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
        {icon}
    </div>
    <span className="font-semibold mt-2">{label}</span>
  </button>
);

interface ResourceItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="w-full bg-brand-surface p-4 rounded-xl flex items-center justify-between hover:bg-brand-primary transition-colors duration-200">
    <div className="flex items-center space-x-4">
      <div className="bg-brand-secondary/50 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-brand-text-secondary">{subtitle}</p>
      </div>
    </div>
    <ChevronRightIcon />
  </button>
);

export default Dashboard;