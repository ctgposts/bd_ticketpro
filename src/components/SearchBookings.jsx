import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from './ui/Input';
import Button from './ui/Button';
import Icon from './AppIcon';
import bookingService from '../utils/bookingService';

const SearchBookings = ({ onSearchResults, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a passport number or phone number');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const result = await bookingService.searchBookings(searchTerm.trim());
      
      if (result.success) {
        setSearchResults(result.data);
        onSearchResults?.(result.data);
        
        if (result.data.length === 0) {
          setError('No bookings found for the provided passport number or phone number');
        }
      } else {
        setError(result.error || 'Failed to search bookings');
      }
    } catch (error) {
      setError('Something went wrong while searching. Please try again.');
      console.log('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setError('');
    onClear?.();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'cancelled':
        return 'text-destructive';
      case 'expired':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Search Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Search" size={24} color="var(--color-primary)" />
          <h2 className="font-heading font-semibold text-xl text-foreground">
            Search Bookings
          </h2>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            label="Search by Passport Number or Phone Number"
            type="text"
            placeholder="e.g., BP1234567 or +8801712345678"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            error={error}
            disabled={isSearching}
            description="Enter a passport number (e.g., BP1234567) or phone number (e.g., +8801712345678)"
          />
          
          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              loading={isSearching}
              iconName="Search"
              iconPosition="left"
              disabled={!searchTerm.trim()}
            >
              {isSearching ? 'Searching...' : 'Search Bookings'}
            </Button>
            
            {(searchTerm || searchResults.length > 0) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                iconName="X"
                iconPosition="left"
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Search Results ({searchResults.length})
            </h3>
          </div>
          
          <div className="space-y-4">
            {searchResults.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Booking Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-heading font-semibold text-foreground">
                        {booking.booking_reference}
                      </h4>
                      <span className={`text-sm font-medium px-2 py-1 rounded-md bg-opacity-20 ${getStatusColor(booking.booking_status)}`}>
                        {booking.booking_status?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Passenger:</span> {booking.passenger_name}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Passport:</span> {booking.passport_number}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Phone:</span> {booking.mobile_number}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Passengers:</span> {booking.pax_count}
                      </p>
                    </div>
                  </div>

                  {/* Flight Info */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-foreground">Flight Details</h5>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Airline:</span> {booking.ticket?.airline?.name || 'N/A'}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Flight:</span> {booking.ticket?.flight_number || 'N/A'}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Route:</span> {booking.ticket?.departure_city || 'N/A'} → {booking.ticket?.arrival_city || 'N/A'}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Departure:</span> {booking.ticket?.departure_date ? new Date(booking.ticket.departure_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-foreground">Payment Details</h5>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Total Amount:</span>{' '}
                        <span className="font-semibold text-foreground">
                          {formatPrice(booking.total_amount || 0)}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Payment Status:</span>{' '}
                        <span className={`font-medium ${getStatusColor(booking.payment_status)}`}>
                          {booking.payment_status?.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Booked:</span> {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                      {booking.booking_status === 'pending' && (
                        <p className="text-warning text-xs">
                          <Icon name="Clock" size={14} className="inline mr-1" />
                          Expires: {new Date(booking.expires_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Printer"
                    iconPosition="left"
                    onClick={() => window.print()}
                  >
                    Print
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Mail"
                    iconPosition="left"
                  >
                    Send Invoice
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBookings;