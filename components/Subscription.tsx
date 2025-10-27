import React, { useState, useEffect } from 'react';
import { SubscriptionStatus, Discount } from '../types';
import { ArrowLeftIcon, CrownIcon, TagIcon } from '../constants';

interface SubscriptionProps {
  onBack: () => void;
  onSelectSubscription: (status: SubscriptionStatus) => void;
  discount: Discount;
}

const SubscriptionComponent: React.FC<SubscriptionProps> = ({ onBack, onSelectSubscription, discount }) => {

  const calculateTimeLeft = () => {
    if (!discount.endDate) return {};
    const difference = discount.endDate - Date.now();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    if (value === undefined) return null;
    return (
      <span key={interval} className="font-mono text-sm">
        {String(value).padStart(2, '0')}{interval[0]}
      </span>
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-brand-surface transition-colors">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-2xl font-bold text-center flex-grow">Go Premium</h2>
        <div className="w-8" />
      </header>
      
      <div className="text-center">
          <div className="inline-block p-4 bg-brand-secondary/50 rounded-full text-brand-secondary">
              <CrownIcon />
          </div>
          <p className="mt-4 text-brand-text-secondary">Unlock advanced safety features and peace of mind with a FortiGuard subscription.</p>
      </div>

      <div className="space-y-4">
        {/* Free Trial */}
        <SubscriptionCard 
          title="Free Trial"
          price="Free"
          duration="for 1 week"
          features={['All premium features', 'Up to 5 contacts', 'Shake-to-alert service']}
          onSelect={() => onSelectSubscription('free-trial')}
          buttonText="Start Free Trial"
          isFeatured={false}
        />
        {/* Monthly */}
        <SubscriptionCard 
          title="Monthly"
          price="$6.17"
          duration="/month"
          features={['All premium features', 'Unlimited contacts', 'Priority support']}
          onSelect={() => onSelectSubscription('monthly')}
          buttonText="Choose Monthly"
          isFeatured={false}
        />
        {/* Yearly */}
        <div className="relative border-2 border-brand-action rounded-2xl p-1">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-action text-brand-bg px-4 py-1 rounded-full font-bold text-sm flex items-center gap-2">
            <TagIcon />
            <span>15% OFF</span>
          </div>
          <SubscriptionCard 
            title="Yearly"
            price="$47.77"
            originalPrice="$56.20"
            duration="/year"
            features={['Everything in Monthly', 'Family sharing (soon)', 'Save 15%']}
            onSelect={() => onSelectSubscription('yearly')}
            buttonText="Choose Yearly"
            isFeatured={true}
          />
           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-surface text-brand-text-primary px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-brand-primary">
            <span>Offer ends in:</span>
            <div className="flex gap-1">
                {timerComponents.length ? timerComponents : <span className="font-mono text-sm">00h00m00s</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SubscriptionCardProps {
    title: string;
    price: string;
    originalPrice?: string;
    duration: string;
    features: string[];
    onSelect: () => void;
    buttonText: string;
    isFeatured: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ title, price, originalPrice, duration, features, onSelect, buttonText, isFeatured }) => (
    <div className={`bg-brand-surface p-6 rounded-xl space-y-4`}>
        <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-bold">{title}</h3>
            {title === 'Free Trial' ? (
                <div className="text-right">
                    <span className="text-2xl font-semibold">{price} {duration}</span>
                </div>
            ) : (
                <div className="flex items-baseline gap-2">
                    {originalPrice && (
                      <span className="text-xl text-brand-text-secondary line-through">{originalPrice}</span>
                    )}
                    <span className="text-3xl font-bold">{price}</span>
                    <span className="text-brand-text-secondary ml-1">{duration}</span>
                </div>
            )}
        </div>
        <ul className="space-y-2 text-brand-text-secondary list-disc list-inside">
            {features.map(f => <li key={f}>{f}</li>)}
        </ul>
        <button onClick={onSelect} className={`w-full font-bold py-3 px-4 rounded-lg transition-opacity ${isFeatured ? 'bg-brand-action text-brand-bg hover:opacity-90' : 'bg-brand-primary text-brand-text-primary hover:bg-brand-primary/80'}`}>
            {buttonText}
        </button>
    </div>
);

export default SubscriptionComponent;