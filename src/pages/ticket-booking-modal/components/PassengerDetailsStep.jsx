import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PassengerDetailsStep = ({ formData, onFormChange, userRole }) => {
  const [passengers, setPassengers] = useState(formData.passengers || [
    { id: 1, name: '', passport: '', mobile: '' }
  ]);

  const handleAgentChange = (field, value) => {
    onFormChange({
      ...formData,
      agent: {
        ...formData.agent,
        [field]: value
      }
    });
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = passengers.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    );
    setPassengers(updatedPassengers);
    onFormChange({
      ...formData,
      passengers: updatedPassengers,
      passengerCount: updatedPassengers.length
    });
  };

  const addPassenger = () => {
    const newPassenger = {
      id: passengers.length + 1,
      name: '',
      passport: '',
      mobile: ''
    };
    const updatedPassengers = [...passengers, newPassenger];
    setPassengers(updatedPassengers);
    onFormChange({
      ...formData,
      passengers: updatedPassengers,
      passengerCount: updatedPassengers.length
    });
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(updatedPassengers);
      onFormChange({
        ...formData,
        passengers: updatedPassengers,
        passengerCount: updatedPassengers.length
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Agent Information */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="UserCheck" size={20} color="var(--color-primary)" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Agent Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Agent Name"
            type="text"
            placeholder="Enter agent name"
            value={formData.agent?.name || ''}
            onChange={(e) => handleAgentChange('name', e.target.value)}
            required
          />
          <Input
            label="Agent ID"
            type="text"
            placeholder="Enter agent ID"
            value={formData.agent?.id || ''}
            onChange={(e) => handleAgentChange('id', e.target.value)}
            required
          />
          <Input
            label="Contact Number"
            type="tel"
            placeholder="Enter contact number"
            value={formData.agent?.contact || ''}
            onChange={(e) => handleAgentChange('contact', e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.agent?.email || ''}
            onChange={(e) => handleAgentChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Passenger Information */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} color="var(--color-primary)" />
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Passenger Details
            </h3>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium font-caption">
              {passengers.length} Passenger{passengers.length > 1 ? 's' : ''}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={addPassenger}
            iconName="Plus"
            iconPosition="left"
          >
            Add Passenger
          </Button>
        </div>

        <div className="space-y-4">
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground font-caption">
                  Passenger {index + 1}
                </h4>
                {passengers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePassenger(index)}
                    iconName="Trash2"
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter passenger name"
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  label="Passport Number"
                  type="text"
                  placeholder="Enter passport number"
                  value={passenger.passport}
                  onChange={(e) => handlePassengerChange(index, 'passport', e.target.value)}
                  required
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={passenger.mobile}
                  onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} color="var(--color-primary)" />
          <span className="text-sm font-medium text-primary font-caption">
            Booking Summary
          </span>
        </div>
        <div className="text-sm text-muted-foreground font-caption">
          <p>Agent: {formData.agent?.name || 'Not specified'}</p>
          <p>Total Passengers: {passengers.length}</p>
          <p>All passenger details must be completed before proceeding to pricing.</p>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetailsStep;