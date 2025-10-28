
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Contact, View, UserProfile, Subscription, SubscriptionStatus, Discount } from './types';
import Dashboard from './components/Dashboard';
import ContactsList from './components/ContactsList';
import AddContactForm from './components/AddContactForm';
import EditMessage from './components/EditMessage';
import SafetyInstructions from './components/SafetyInstructions';
import SOSGuides from './components/SOSGuides';
import Helpline from './components/Helpline';
import EmergencyService from './components/EmergencyService';
import SOSCountdown from './components/SOSCountdown';
import PermissionGate from './components/PermissionGate';
import Profile from './components/Profile';
import SubscriptionComponent from './components/Subscription';
import Emergency from './emergency-plugin';

const DEFAULT_SOS_MESSAGE = 'I am in DANGER, i need help. Please urgently reach me out.';
const DISCOUNT_DURATION = 48 * 60 * 60 * 1000; // 48 hours in ms

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sosMessage, setSosMessage] = useState<string>(DEFAULT_SOS_MESSAGE);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [sosData, setSosData] = useState<{ message: string; contactNumbers: string } | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'User', email: 'user@example.com' });
  const [subscription, setSubscription] = useState<Subscription>({ status: 'none', endDate: null });
  const [discount, setDiscount] = useState<Discount>({ endDate: null });

  const contactsRef = useRef(contacts);
  const sosMessageRef = useRef(sosMessage);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location === 'granted') {
          setPermissionGranted('granted');
        } else if (permissions.location === 'prompt' || permissions.location === 'prompt-with-rationale') {
          setPermissionGranted('pending');
        } else {
          setPermissionGranted('denied');
        }
      } catch (error) {
        console.error('Error checking location permissions', error);
        setPermissionGranted('denied');
      }
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    contactsRef.current = contacts;
    sosMessageRef.current = sosMessage;
  }, [contacts, sosMessage]);

  const triggerSosFromShake = useCallback(async () => {
    const currentContacts = contactsRef.current;
    if (currentContacts.length === 0) {
        console.warn("Shake detected by native service, but no contacts are set up in the app.");
        return;
    }
    
    try {
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = `${sosMessageRef.current}\nMy location: ${locationUrl}`;
        setSosData({ message, contactNumbers: currentContacts.map(c => c.phone).join(',') });
        setView('sosCountdown');
    } catch (error) {
        console.error("Failed to get location for shake SOS:", error);
        const message = `${sosMessageRef.current}\nLocation services failed.`;
        setSosData({ message, contactNumbers: currentContacts.map(c => c.phone).join(',') });
        setView('sosCountdown');
    }
  }, []);

  useEffect(() => {
    const listener = Emergency.addListener('shakeDetected', triggerSosFromShake);
    return () => {
        listener.then(l => l.remove());
    };
  }, [triggerSosFromShake]);


  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem('emergency-contacts');
      if (storedContacts) setContacts(JSON.parse(storedContacts));
      
      const storedMessage = localStorage.getItem('emergency-sos-message');
      if (storedMessage) setSosMessage(storedMessage);
      else localStorage.setItem('emergency-sos-message', DEFAULT_SOS_MESSAGE);

      const storedMonitoringStatus = localStorage.getItem('emergency-monitoring-status');
      const monitoringStatus = storedMonitoringStatus === 'true';
      if (monitoringStatus && permissionGranted === 'granted') startMonitoring();
      
      const storedProfile = localStorage.getItem('fortiguard-profile');
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));

      const storedSub = localStorage.getItem('fortiguard-subscription');
      if (storedSub) setSubscription(JSON.parse(storedSub));

      const storedDiscount = localStorage.getItem('fortiguard-discount');
      if (storedDiscount) {
        const parsedDiscount: Discount = JSON.parse(storedDiscount);
        if (parsedDiscount.endDate && parsedDiscount.endDate > Date.now()) {
          setDiscount(parsedDiscount);
        } else {
          const newEndDate = Date.now() + DISCOUNT_DURATION;
          setDiscount({ endDate: newEndDate });
          localStorage.setItem('fortiguard-discount', JSON.stringify({ endDate: newEndDate }));
        }
      } else {
        const newEndDate = Date.now() + DISCOUNT_DURATION;
        setDiscount({ endDate: newEndDate });
        localStorage.setItem('fortiguard-discount', JSON.stringify({ endDate: newEndDate }));
      }

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, [permissionGranted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      localStorage.setItem('emergency-contacts', JSON.stringify(contacts));
      localStorage.setItem('emergency-sos-message', sosMessage);
      localStorage.setItem('fortiguard-profile', JSON.stringify(userProfile));
      localStorage.setItem('fortiguard-subscription', JSON.stringify(subscription));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [contacts, sosMessage, userProfile, subscription]);

  const startMonitoring = useCallback(() => {
    Emergency.startMonitoring();
    setIsMonitoring(true);
    localStorage.setItem('emergency-monitoring-status', 'true');
  }, []);

  const stopMonitoring = useCallback(() => {
    Emergency.stopMonitoring();
    setIsMonitoring(false);
    localStorage.setItem('emergency-monitoring-status', 'false');
  }, []);

  const toggleMonitoring = () => {
    if (permissionGranted !== 'granted') {
        alert("Please grant location permission first.");
        requestLocationPermission();
        return;
    }
    if (!isMonitoring) {
        if (contacts.length === 0) {
            alert("Please add at least one emergency contact first.");
            return;
        }
        startMonitoring();
    } else {
        stopMonitoring();
    }
  };

  const addContact = (contact: Omit<Contact, 'id'>) => {
    setContacts(prev => [...prev, { ...contact, id: Date.now().toString() }]);
    setView('contacts');
  };

  const deleteContact = (id: string) => setContacts(prev => prev.filter(c => c.id !== id));
  const updateSosMessage = (message: string) => { setSosMessage(message); setView('dashboard'); };
  
  const sendSosAndCallContact = async (contact: Contact) => {
    if (!confirm(`This will send an SOS to ${contact.name} and then immediately call them. Continue?`)) return;

    try {
      const position = await Geolocation.getCurrentPosition({ timeout: 10000 });
      const { latitude, longitude } = position.coords;
      const message = `${sosMessage}\nMy location: https://www.google.com/maps?q=${latitude},${longitude}`;
      await Emergency.sendSosAndCall({ recipient: contact.phone, message });
    } catch (error) {
      console.error(error);
      alert(`Could not get location. Preparing message without location.`);
      const message = `${sosMessage}\nLocation not available.`;
      await Emergency.sendSosAndCall({ recipient: contact.phone, message });
    }
  };

  const makeHelplineCall = (number: string) => Emergency.makeCall({ number });
  
  const requestLocationPermission = async () => {
    try {
      console.log('Attempting to request location permissions via Capacitor plugin...');
      const permissions = await Geolocation.requestPermissions();
      console.log('Capacitor permissions request returned:', permissions);
      if (permissions.location === 'granted') {
        setPermissionGranted('granted');
      } else {
        setPermissionGranted('denied');
        alert('Location permission was denied. Please enable it in your phone settings to use this app.');
      }
    } catch (error: any) {
      console.error('Error requesting location permissions', error);
      alert(`Failed to request location permission. Error: ${error.message || 'An unknown error occurred.'}. This might happen if the app is not properly configured for native device features.`);
      setPermissionGranted('denied');
    }
  };

  const handleBack = useCallback(() => setView('dashboard'), []);
  
  const handleSosConfirm = async () => {
    if (sosData) {
        try {
            await Emergency.sendSms({ recipients: sosData.contactNumbers.split(','), message: sosData.message });
            alert("SOS message sent successfully!");
        } catch(e) {
            alert(`Failed to send SMS: ${e}`);
        }
    }
    setTimeout(() => {
        setView('dashboard');
        setSosData(null);
    }, 500);
  };
  const handleSosCancel = () => { setSosData(null); setView('dashboard'); };

  const handleUpdateProfile = (name: string) => setUserProfile(p => ({ ...p, name }));
  const handleSelectSubscription = (status: SubscriptionStatus) => {
    let endDate = null;
    if (status === 'free-trial') endDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
    if (status === 'monthly') endDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
    if (status === 'yearly') endDate = Date.now() + 365 * 24 * 60 * 60 * 1000;
    setSubscription({ status, endDate });
    alert(`You've subscribed to the ${status} plan!`);
    setView('profile');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard onNavigate={setView} />;
      case 'contacts': return <ContactsList contacts={contacts} onDelete={deleteContact} onBack={handleBack} onNavigate={setView} onSosAndCall={sendSosAndCallContact} />;
      case 'addContact': return <AddContactForm onAddContact={addContact} onBack={handleBack} />;
      case 'editMessage': return <EditMessage currentMessage={sosMessage} onSave={updateSosMessage} onBack={handleBack} defaultMessage={DEFAULT_SOS_MESSAGE} />;
      case 'safetyInstructions': return <SafetyInstructions onBack={handleBack} />;
      case 'sosGuides': return <SOSGuides onBack={handleBack} />;
      case 'helpline': return <Helpline onBack={handleBack} onCall={makeHelplineCall} />;
      case 'emergencyService': return <EmergencyService onBack={handleBack} isMonitoring={isMonitoring} onToggleMonitoring={toggleMonitoring} />;
      case 'profile': return <Profile onBack={handleBack} profile={userProfile} subscription={subscription} onUpdateProfile={handleUpdateProfile} onNavigate={setView} />;
      case 'subscription': return <SubscriptionComponent onBack={() => setView('profile')} onSelectSubscription={handleSelectSubscription} discount={discount} />;
      default: return <Dashboard onNavigate={setView} />;
    }
  };
  
  if (permissionGranted !== 'granted') return <PermissionGate onGrant={requestLocationPermission} />;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans">
      <div className="container mx-auto max-w-lg p-4">
        {view !== 'sosCountdown' && renderView()}
      </div>
      {view === 'sosCountdown' && sosData && <SOSCountdown onCancel={handleSosCancel} onConfirm={handleSosConfirm} message={sosData.message} />}
    </div>
  );
};

export default App;
