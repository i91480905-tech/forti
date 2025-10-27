import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { ArrowLeftIcon, UserIcon, PhoneIcon, InfoIcon, UserPlusIcon, AddressBookIcon, ShieldIcon } from '../constants';

interface AddContactFormProps {
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onBack: () => void;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ onAddContact, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isContactPickerSupported, setContactPickerSupported] = useState(false);

  useEffect(() => {
    if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
      setContactPickerSupported(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onAddContact({ name, phone });
    } else {
        alert("Please fill in both name and phone number.");
    }
  };

  const handleImport = async () => {
    if (!isContactPickerSupported) return;

    try {
      const contacts = await (navigator as any).contacts.select(['name', 'tel'], { multiple: false });
      if (contacts.length > 0) {
        const contact = contacts[0];
        if (contact.name && contact.name.length > 0) {
          setName(contact.name[0]);
        }
        if (contact.tel && contact.tel.length > 0) {
          // Clean up phone number to remove common formatting characters
          const phoneNumber = contact.tel[0].replace(/[\s-()]/g, '');
          setPhone(phoneNumber);
        }
      }
    } catch (error) {
      console.error('Error picking contact:', error);
      alert('Could not import contact. This can happen if you cancel the request. Please enter the details manually.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <header className="flex items-center h-8">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-brand-surface transition-colors">
                <ArrowLeftIcon />
            </button>
        </header>

        <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Add Emergency Contact</h2>
            <p className="text-sm text-brand-text-secondary">Add trusted contacts who will receive your emergency alerts</p>
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-brand-surface p-6 rounded-2xl space-y-5">
                <h3 className="text-lg font-semibold text-brand-text-primary">Contact Information</h3>

                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserIcon />
                    </span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-primary/50 text-brand-text-primary placeholder-brand-text-secondary p-3 pl-10 rounded-md border border-brand-primary focus:ring-2 focus:ring-brand-action focus:outline-none"
                        placeholder="Full Name"
                        required
                    />
                </div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <PhoneIcon />
                    </span>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-brand-primary/50 text-brand-text-primary placeholder-brand-text-secondary p-3 pl-10 rounded-md border border-brand-primary focus:ring-2 focus:ring-brand-action focus:outline-none"
                        placeholder="Phone Number"
                        required
                    />
                </div>

                <div className="bg-brand-info-bg border border-brand-info-text/30 text-brand-info-text p-3 rounded-lg flex items-start space-x-3">
                    <InfoIcon />
                    <p className="text-sm flex-1">This contact will receive SMS alerts with your location during emergencies</p>
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-brand-action text-brand-bg font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    <UserPlusIcon />
                    Add Emergency Contact
                </button>

                {isContactPickerSupported && (
                    <button 
                        type="button" 
                        onClick={handleImport} 
                        className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-text-primary font-bold py-3 px-4 rounded-lg hover:bg-brand-primary/80 transition-colors"
                    >
                        <AddressBookIcon />
                        Import from Contacts
                    </button>
                )}
            </div>
        </form>

        <div className="bg-brand-surface p-6 rounded-2xl space-y-3">
            <div className="flex items-center space-x-3">
                <ShieldIcon />
                <h3 className="text-lg font-semibold text-brand-text-primary">Safety Tips</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-brand-text-secondary space-y-1 pl-1">
                <li>Add at least 2-3 trusted contacts</li>
                <li>Ensure contacts are available 24/7</li>
                <li>Inform contacts about this emergency feature</li>
            </ul>
        </div>
    </div>
  );
};

export default AddContactForm;