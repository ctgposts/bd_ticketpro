import React from 'react';
import Image from '../../../components/AppImage';


const CountryHeader = ({ country }) => {
  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-12 rounded-lg overflow-hidden border border-border">
            <Image 
              src={country.flagUrl} 
              alt={`${country.name} flag`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-heading font-semibold text-2xl text-foreground">
              {country.name}
            </h1>
            <p className="text-muted-foreground font-caption">
              Flight Tickets Available
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-heading font-semibold text-primary">
              {country.totalTickets}
            </div>
            <div className="text-sm text-muted-foreground font-caption">
              Total Tickets
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-semibold text-success">
              {country.availableTickets}
            </div>
            <div className="text-sm text-muted-foreground font-caption">
              Available
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-semibold text-warning">
              {country.lockedTickets}
            </div>
            <div className="text-sm text-muted-foreground font-caption">
              Locked
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-semibold text-error">
              {country.soldTickets}
            </div>
            <div className="text-sm text-muted-foreground font-caption">
              Sold Out
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryHeader;