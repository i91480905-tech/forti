import React from 'react';
import { Contact, View } from '../types';
import { ArrowLeftIcon, TrashIcon, UsersIcon, PlusIcon, SirenIcon } from '../constants';

interface ContactsListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onBack: () => void;
  onNavigate: (view: View) => void;
  onSosAndCall: (contact: Contact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, onDelete, onBack, onNavigate, onSosAndCall }) => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-surface transition-colors">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-2xl font-bold">Emergency Contacts</h2>
        <div className="w-8"></div>
      </header>

      {contacts.length > 0 ? (
        <ul className="space-y-3">
          {contacts.map(contact => (
            <li key={contact.id} className="bg-brand-surface p-4 rounded-lg flex items-center justify-between transition-shadow hover:shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-brand-primary p-3 rounded-full">
                  <UsersIcon />
                </div>
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-brand-text-secondary">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onSosAndCall(contact)} 
                  className="p-3 w-12 h-12 rounded-full text-white bg-brand-accent hover:bg-brand-accent/80 transition-colors flex items-center justify-center transform hover:scale-110" 
                  aria-label={`Send SOS and Call ${contact.name}`}
                >
                  <SirenIcon width={24} height={24} />
                </button>
                <button onClick={() => onDelete(contact.id)} className="p-3 w-12 h-12 rounded-full text-brand-text-secondary hover:bg-brand-primary transition-colors flex items-center justify-center" aria-label={`Delete ${contact.name}`}>
                  <TrashIcon width={22} height={22} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 bg-brand-surface rounded-lg">
          <p className="text-brand-text-secondary">No contacts added yet.</p>
          <p className="text-sm text-brand-text-secondary/70">Add contacts to send SOS messages to.</p>
        </div>
      )}
      
      <button onClick={() => onNavigate('addContact')} className="w-full flex items-center justify-center gap-2 bg-brand-secondary text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 transition-opacity">
        <PlusIcon />
        Add New Contact
      </button>
    </div>
  );
};

export default ContactsList;