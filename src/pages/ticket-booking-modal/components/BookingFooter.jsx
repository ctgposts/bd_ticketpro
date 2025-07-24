import React from 'react';

import Button from '../../../components/ui/Button';

const BookingFooter = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSaveDraft, 
  onConfirmBooking, 
  onCancel,
  isLoading,
  canProceed 
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
      {/* Left Section - Cancel */}
      <Button
        variant="ghost"
        onClick={onCancel}
        disabled={isLoading}
        iconName="X"
        iconPosition="left"
      >
        Cancel
      </Button>

      {/* Center Section - Step Info */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground font-caption">
          Step {currentStep} of {totalSteps}
        </span>
        
        {/* Progress Bar */}
        <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Right Section - Navigation & Actions */}
      <div className="flex items-center space-x-3">
        {/* Save Draft */}
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
          iconName="Save"
          iconPosition="left"
          size="sm"
        >
          Save Draft
        </Button>

        {/* Previous Button */}
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
        )}

        {/* Next/Confirm Button */}
        {isLastStep ? (
          <Button
            variant="default"
            onClick={onConfirmBooking}
            disabled={isLoading || !canProceed}
            loading={isLoading}
            iconName="Check"
            iconPosition="left"
            className="min-w-[140px]"
          >
            Confirm Booking
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={onNext}
            disabled={isLoading || !canProceed}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingFooter;