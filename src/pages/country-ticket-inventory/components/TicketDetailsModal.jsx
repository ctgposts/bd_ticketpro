import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TicketDetailsModal = ({ ticket, isOpen, onClose, onBookTicket }) => {
  if (!ticket) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB'),
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
  };

  const dateInfo = formatDate(ticket.departureDate);

  const getStatusColor = (status) => {
    const colors = {
      available: 'text-success',
      locked: 'text-warning',
      sold: 'text-error'
    };
    return colors[status] || colors.available;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg border border-border shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-heading font-semibold text-xl text-foreground">
                  Ticket Details
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Airline Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={ticket.airlineLogo}
                      alt={`${ticket.airline} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      {ticket.airline}
                    </h3>
                    <p className="text-muted-foreground font-caption">
                      Flight {ticket.flightNumber}
                    </p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      ticket.status === 'available' ? 'bg-success/10 text-success' :
                      ticket.status === 'locked'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground font-caption">
                        Serial Number
                      </label>
                      <p className="text-foreground font-data">
                        {ticket.serialNumber}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground font-caption">
                        Departure Date
                      </label>
                      <p className="text-foreground">
                        {dateInfo.day}, {dateInfo.date}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground font-caption">
                        Departure Time
                      </label>
                      <p className="text-foreground font-data">
                        {dateInfo.time}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground font-caption">
                        Selling Price
                      </label>
                      <p className="text-lg font-semibold text-foreground font-data">
                        {formatPrice(ticket.sellingPrice)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground font-caption">
                        Route
                      </label>
                      <p className="text-foreground">
                        {ticket.route || 'Dhaka → Dubai'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground font-caption">
                        Aircraft Type
                      </label>
                      <p className="text-foreground">
                        {ticket.aircraftType || 'Boeing 777-300ER'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-heading font-medium text-foreground mb-3">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground font-caption">Baggage:</span>
                      <span className="ml-2 text-foreground">30kg Checked + 7kg Cabin</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-caption">Meal:</span>
                      <span className="ml-2 text-foreground">Included</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-caption">Refundable:</span>
                      <span className="ml-2 text-foreground">Partially Refundable</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-caption">Class:</span>
                      <span className="ml-2 text-foreground">Economy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Close
                </Button>
                {ticket.status === 'available' && (
                  <Button
                    variant="default"
                    onClick={() => {
                      onBookTicket(ticket);
                      onClose();
                    }}
                    iconName="Ticket"
                    iconPosition="left"
                  >
                    Book This Ticket
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TicketDetailsModal;