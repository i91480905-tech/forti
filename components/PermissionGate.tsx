
import React from 'react';
import { ShieldIcon } from '../constants';

interface PermissionGateProps {
  onGrant: () => void;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ onGrant }) => {
  return (
    <div className="fixed inset-0 bg-brand-bg z-50 flex flex-col items-center justify-center p-6 text-center text-brand-text-primary">
      <div className="text-brand-action">
        <ShieldIcon width={64} height={64} />
      </div>
      <h1 className="text-3xl font-bold mt-6">Location Access Required</h1>
      <p className="text-brand-text-secondary mt-3 max-w-sm">
        FortiGuard needs access to your location to send accurate alerts to your emergency contacts. Your location is only used when you trigger an SOS.
      </p>
      <button 
        onClick={onGrant}
        className="mt-8 w-full max-w-xs bg-brand-action text-brand-bg font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
      >
        Grant Permission
      </button>
      <p className="text-xs text-brand-text-secondary mt-4">
        You may need to grant permission in your phone's settings for this app.
      </p>
    </div>
  );
};

export default PermissionGate;
