import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingHeader = ({ ticketData, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-white">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Plane" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl text-foreground">
            Book Ticket - {ticketData.airline}
          </h2>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-muted-foreground font-caption">
              {ticketData.route}
            </span>
            <span className="text-sm text-muted-foreground font-caption">
              •
            </span>
            <span className="text-sm text-muted-foreground font-caption">
              {ticketData.departureDate} at {ticketData.departureTime}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground font-caption">Base Price</p>
          <p className="font-heading font-semibold text-lg text-foreground">
            ৳{ticketData.price.toLocaleString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default BookingHeader;