import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useAuth } from '../../../contexts/AuthContext';
import bookingService from '../../../utils/bookingService';
import emailService from '../../../utils/emailService';

const BookingModal = ({ ticket, isOpen, onClose, onConfirmBooking }) => {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({
    passengerName: '',
    passportNumber: '',
    mobileNumber: '',
    paxCount: 1,
    sellingPrice: ticket?.sellingPrice || 0,
    paymentStatus: 'pending',
    comments: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) return null;

  const paymentOptions = [
    { value: 'pending', label: 'Pending Payment' },
    { value: 'partial', label: 'Partial Payment' },
    { value: 'full', label: 'Full Payment' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.passengerName.trim()) {
      newErrors.passengerName = 'Passenger name is required';
    }

    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = 'Passport number is required';
    } else if (formData.passportNumber.length < 8) {
      newErrors.passportNumber = 'Passport number must be at least 8 characters';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^(\+88)?01[3-9]\d{8}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid Bangladeshi mobile number';
    }

    if (formData.paxCount < 1 || formData.paxCount > 9) {
      newErrors.paxCount = 'Passenger count must be between 1 and 9';
    }

    if (formData.sellingPrice < ticket.sellingPrice) {
      newErrors.sellingPrice = `Price cannot be less than ${formatPrice(ticket.sellingPrice)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create booking data
      const bookingData = {
        ticket_id: ticket.id,
        agent_id: userProfile?.id,
        passenger_name: formData.passengerName,
        passport_number: formData.passportNumber,
        mobile_number: formData.mobileNumber,
        pax_count: formData.paxCount,
        total_amount: formData.sellingPrice * formData.paxCount,
        payment_status: formData.paymentStatus,
        comments: formData.comments,
        booking_status: 'pending'
      };

      // Create booking in database
      const result = await bookingService.createBooking(bookingData);
      
      if (result.success) {
        // Send invoice email
        const emailResult = await emailService.sendInvoiceEmail({
          ...result.data,
          ticket: ticket,
          agent: userProfile
        });

        if (emailResult.success) {
          console.log('Invoice email sent successfully');
        }

        // Notify parent component
        onConfirmBooking?.(result.data);
        
        // Close modal and reset form
        onClose();
        setFormData({
          passengerName: '',
          passportNumber: '',
          mobileNumber: '',
          paxCount: 1,
          sellingPrice: ticket?.sellingPrice || 0,
          paymentStatus: 'pending',
          comments: ''
        });
      } else {
        setErrors({ submit: result.error || 'Failed to create booking' });
      }
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
      console.log('Booking creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const totalAmount = formData.sellingPrice * formData.paxCount;

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
                <div className="flex items-center space-x-3">
                  <Icon name="Ticket" size={24} color="var(--color-primary)" />
                  <h2 className="font-heading font-semibold text-xl text-foreground">
                    Book Ticket
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Ticket Summary */}
              <div className="p-6 bg-muted border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={ticket.airlineLogo || '/assets/images/no_image.png'}
                      alt={`${ticket.airline} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground">
                      {ticket.airline} - {ticket.flightNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground font-caption">
                      {ticket.departure_city} → {ticket.arrival_city} • 
                      {new Date(ticket.departureDate).toLocaleDateString('en-GB')} • 
                      {new Date(ticket.departureDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-caption">Base Price</p>
                    <p className="font-semibold text-foreground font-data">
                      {formatPrice(ticket.sellingPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Error Message */}
                {errors.submit && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Passenger Information */}
                <div>
                  <h4 className="font-heading font-medium text-foreground mb-4">
                    Passenger Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Passenger Name"
                      type="text"
                      placeholder="Enter full name as per passport"
                      value={formData.passengerName}
                      onChange={(e) => handleInputChange('passengerName', e.target.value)}
                      error={errors.passengerName}
                      disabled={isSubmitting}
                      required
                    />
                    
                    <Input
                      label="Passport Number"
                      type="text"
                      placeholder="Enter passport number"
                      value={formData.passportNumber}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      error={errors.passportNumber}
                      disabled={isSubmitting}
                      required
                    />
                    
                    <Input
                      label="Mobile Number"
                      type="tel"
                      placeholder="+8801XXXXXXXXX"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      error={errors.mobileNumber}
                      disabled={isSubmitting}
                      required
                    />
                    
                    <Input
                      label="Number of Passengers"
                      type="number"
                      min="1"
                      max="9"
                      value={formData.paxCount}
                      onChange={(e) => handleInputChange('paxCount', parseInt(e.target.value))}
                      error={errors.paxCount}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                {/* Pricing Information */}
                <div>
                  <h4 className="font-heading font-medium text-foreground mb-4">
                    Pricing & Payment
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Selling Price per Ticket"
                      type="number"
                      min={ticket.sellingPrice}
                      value={formData.sellingPrice}
                      onChange={(e) => handleInputChange('sellingPrice', parseInt(e.target.value))}
                      error={errors.sellingPrice}
                      description={`Minimum: ${formatPrice(ticket.sellingPrice)}`}
                      disabled={isSubmitting}
                      required
                    />
                    
                    <Select
                      label="Payment Status"
                      options={paymentOptions}
                      value={formData.paymentStatus}
                      onChange={(value) => handleInputChange('paymentStatus', value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  
                  {/* Total Amount Display */}
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-caption">
                        Total Amount ({formData.paxCount} passenger{formData.paxCount > 1 ? 's' : ''})
                      </span>
                      <span className="text-lg font-semibold text-primary font-data">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <Input
                    label="Comments (Optional)"
                    type="text"
                    placeholder="Add any special notes or requirements"
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    description="Any special requests or notes for this booking"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    iconName="Check"
                    iconPosition="left"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;