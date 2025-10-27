import React, { useState, useEffect } from 'react';
import { UserProfile, Subscription, View } from '../types';
import { ArrowLeftIcon, UserCircleIcon, CrownIcon } from '../constants';

interface ProfileProps {
  profile: UserProfile;
  subscription: Subscription;
  onUpdateProfile: (name: string) => void;
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, subscription, onUpdateProfile, onBack, onNavigate }) => {
  const [name, setName] = useState(profile.name);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(profile.name);
  }, [profile.name]);

  const handleSave = () => {
    if (name.trim()) {
      onUpdateProfile(name.trim());
      setIsEditing(false);
    } else {
      alert("Name cannot be empty.");
    }
  };

  const getSubscriptionLabel = () => {
    switch(subscription.status) {
      case 'free-trial': return 'Free Trial';
      case 'monthly': return 'Monthly Plan';
      case 'yearly': return 'Yearly Plan';
      default: return 'No Subscription';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-brand-surface transition-colors">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-2xl font-bold text-center flex-grow">My Profile</h2>
        <div className="w-8" />
      </header>

      <div className="flex flex-col items-center space-y-4">
        <div className="p-2 bg-brand-primary rounded-full">
          <UserCircleIcon />
        </div>
      </div>
      
      <div className="bg-brand-surface p-6 rounded-2xl space-y-4">
        <div>
          <label className="text-sm font-semibold text-brand-text-secondary">Name</label>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-primary/50 text-brand-text-primary p-2 rounded-md border border-brand-primary focus:ring-2 focus:ring-brand-action focus:outline-none"
              />
              <button onClick={handleSave} className="bg-brand-action text-brand-bg font-bold px-4 py-2 rounded-lg hover:opacity-90">Save</button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <p className="text-lg">{profile.name}</p>
              <button onClick={() => setIsEditing(true)} className="text-sm text-brand-action">Edit</button>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-text-secondary">Email</label>
          <p className="text-lg text-brand-text-primary/70 italic mt-1">{profile.email}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-text-secondary">Subscription</label>
          <p className={`text-lg mt-1 font-semibold ${subscription.status !== 'none' ? 'text-green-400' : ''}`}>{getSubscriptionLabel()}</p>
        </div>
      </div>

      <button
        onClick={() => onNavigate('subscription')}
        className="w-full flex items-center justify-center gap-3 bg-brand-secondary text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 transition-opacity"
      >
        <CrownIcon />
        Upgrade Subscription
      </button>
    </div>
  );
};

export default Profile;