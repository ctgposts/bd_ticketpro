import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, totalSteps = 3 }) => {
  const steps = [
    { number: 1, title: 'Passenger Details', icon: 'Users' },
    { number: 2, title: 'Pricing', icon: 'DollarSign' },
    { number: 3, title: 'Payment & Confirmation', icon: 'CreditCard' }
  ];

  return (
    <div className="px-6 py-4 bg-muted/30 border-b border-border">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                ${currentStep >= step.number 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {currentStep > step.number ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step.icon} size={16} />
                )}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium font-caption ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`
                w-16 sm:w-24 h-0.5 mx-4 transition-all duration-200
                ${currentStep > step.number ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;