
export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface HelplineContact {
  id: string;
  name: string;
  number: string;
  icon: string;
}

export type SubscriptionStatus = 'free-trial' | 'monthly' | 'yearly' | 'none';

export interface Subscription {
  status: SubscriptionStatus;
  endDate: number | null; // Timestamp
}

export interface Discount {
  endDate: number | null; // Timestamp
}

export interface UserProfile {
  name: string;
  email: string;
}

export type View = 
  | 'dashboard' 
  | 'contacts' 
  | 'addContact' 
  | 'editMessage' 
  | 'safetyInstructions' 
  | 'sosGuides'
  | 'helpline'
  | 'emergencyService'
  | 'sosCountdown'
  | 'profile'
  | 'subscription';