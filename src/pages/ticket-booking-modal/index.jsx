import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BookingHeader from './components/BookingHeader';
import StepIndicator from './components/StepIndicator';
import PassengerDetailsStep from './components/PassengerDetailsStep';
import PricingStep from './components/PricingStep';
import PaymentStep from './components/PaymentStep';
import BookingFooter from './components/BookingFooter';

const TicketBookingModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get ticket data from navigation state or use mock data
  const ticketData = location.state?.ticketData || {
    id: 'TK001',
    airline: 'Biman Bangladesh Airlines',
    route: 'DAC → RUH',
    departureDate: '25/07/2025',
    departureTime: '14:30',
    price: 85000,
    buyingPrice: 75000,
    country: 'Saudi Arabia',
    status: 'available'
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole] = useState('admin'); // Mock user role
  
  const [formData, setFormData] = useState({
    agent: {
      name: '',
      id: '',
      contact: '',
      email: ''
    },
    passengers: [
      { id: 1, name: '', passport: '', mobile: '' }
    ],
    passengerCount: 1,
    pricing: {
      sellingPrice: ticketData.price,
      discount: 0,
      totalAmount: ticketData.price,
      pricePerPassenger: ticketData.price
    },
    payment: {
      status: 'pending',
      paidAmount: 0,
      remainingAmount: ticketData.price,
      paymentMethod: '',
      transactionId: '',
      comments: ''
    }
  });

  // Validation functions
  const validateStep1 = () => {
    const { agent, passengers } = formData;
    return (
      agent.name && 
      agent.id && 
      agent.contact && 
      agent.email &&
      passengers.every(p => p.name && p.passport && p.mobile)
    );
  };

  const validateStep2 = () => {
    const { pricing } = formData;
    return pricing.sellingPrice > 0 && pricing.totalAmount > 0;
  };

  const validateStep3 = () => {
    const { payment } = formData;
    return payment.status && payment.paymentMethod;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return validateStep1();
      case 2: return validateStep2();
      case 3: return validateStep3();
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock save draft logic
    console.log('Draft saved:', formData);
    
    setIsLoading(false);
    navigate('/country-ticket-inventory', { 
      state: { 
        message: 'Booking draft saved successfully',
        type: 'success'
      }
    });
  };

  const handleConfirmBooking = async () => {
    if (!canProceed()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock booking confirmation logic
    const bookingData = {
      ...formData,
      ticketId: ticketData.id,
      bookingId: `BK${Date.now()}`,
      bookingDate: new Date().toISOString(),
      lockExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: formData.payment.status === 'full' ? 'confirmed' : 'locked'
    };
    
    console.log('Booking confirmed:', bookingData);
    
    setIsLoading(false);
    navigate('/dashboard', { 
      state: { 
        message: `Booking ${bookingData.status === 'confirmed' ? 'confirmed' : 'locked'} successfully`,
        type: 'success',
        bookingId: bookingData.bookingId
      }
    });
  };

  const handleCancel = () => {
    navigate('/country-ticket-inventory');
  };

  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PassengerDetailsStep
            formData={formData}
            onFormChange={handleFormChange}
            userRole={userRole}
          />
        );
      case 2:
        return (
          <PricingStep
            formData={formData}
            onFormChange={handleFormChange}
            ticketData={ticketData}
            userRole={userRole}
          />
        );
      case 3:
        return (
          <PaymentStep
            formData={formData}
            onFormChange={handleFormChange}
          />
        );
      default:
        return null;
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-background">
      {/* Modal Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) {
            handleCancel();
          }
        }}
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <BookingHeader
            ticketData={ticketData}
            onClose={handleCancel}
          />

          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
          />

          {/* Content Area */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <BookingFooter
            currentStep={currentStep}
            totalSteps={3}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            onConfirmBooking={handleConfirmBooking}
            onCancel={handleCancel}
            isLoading={isLoading}
            canProceed={canProceed()}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TicketBookingModal;