import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const PricingStep = ({ formData, onFormChange, ticketData, userRole }) => {
  const [pricing, setPricing] = useState({
    sellingPrice: formData.pricing?.sellingPrice || ticketData.price,
    discount: formData.pricing?.discount || 0,
    totalAmount: formData.pricing?.totalAmount || 0,
    pricePerPassenger: formData.pricing?.pricePerPassenger || ticketData.price
  });

  const passengerCount = formData.passengerCount || 1;
  const canEditPrice = userRole === 'admin' || userRole === 'manager';

  useEffect(() => {
    calculateTotal();
  }, [pricing.sellingPrice, pricing.discount, passengerCount]);

  const calculateTotal = () => {
    const baseAmount = pricing.sellingPrice * passengerCount;
    const discountAmount = (baseAmount * pricing.discount) / 100;
    const totalAmount = baseAmount - discountAmount;
    
    const updatedPricing = {
      ...pricing,
      totalAmount,
      pricePerPassenger: pricing.sellingPrice
    };
    
    setPricing(updatedPricing);
    onFormChange({
      ...formData,
      pricing: updatedPricing
    });
  };

  const handlePricingChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    setPricing(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Base Ticket Information */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Ticket" size={20} color="var(--color-primary)" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Ticket Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-caption mb-1">Base Price</p>
            <p className="font-heading font-semibold text-lg text-foreground">
              ৳{ticketData.price.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-caption mb-1">Passengers</p>
            <p className="font-heading font-semibold text-lg text-foreground">
              {passengerCount}
            </p>
          </div>
          {userRole === 'admin' && (
            <div className="bg-white rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground font-caption mb-1">Buying Price</p>
              <p className="font-heading font-semibold text-lg text-success">
                ৳{ticketData.buyingPrice?.toLocaleString() || 'N/A'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Configuration */}
      <div className="bg-white border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="DollarSign" size={20} color="var(--color-primary)" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Pricing Details
          </h3>
          {!canEditPrice && (
            <span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-medium font-caption">
              View Only
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Selling Price (Per Passenger)"
            type="number"
            placeholder="Enter selling price"
            value={pricing.sellingPrice}
            onChange={(e) => handlePricingChange('sellingPrice', e.target.value)}
            disabled={!canEditPrice}
            description={!canEditPrice ? "Contact admin to modify pricing" : "Price per passenger in BDT"}
          />
          
          <Input
            label="Discount (%)"
            type="number"
            placeholder="Enter discount percentage"
            value={pricing.discount}
            onChange={(e) => handlePricingChange('discount', e.target.value)}
            min="0"
            max="100"
            description="Discount percentage to apply"
          />
        </div>
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Calculator" size={20} color="var(--color-primary)" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Price Breakdown
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-primary/10">
            <span className="text-sm text-muted-foreground font-caption">
              Base Amount ({passengerCount} × ৳{pricing.sellingPrice.toLocaleString()})
            </span>
            <span className="font-medium text-foreground">
              ৳{(pricing.sellingPrice * passengerCount).toLocaleString()}
            </span>
          </div>
          
          {pricing.discount > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-primary/10">
              <span className="text-sm text-muted-foreground font-caption">
                Discount ({pricing.discount}%)
              </span>
              <span className="font-medium text-success">
                -৳{((pricing.sellingPrice * passengerCount * pricing.discount) / 100).toLocaleString()}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2 bg-primary/10 rounded-lg px-3">
            <span className="font-heading font-semibold text-lg text-foreground">
              Total Amount
            </span>
            <span className="font-heading font-bold text-xl text-primary">
              ৳{pricing.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Profit Margin (Admin Only) */}
      {userRole === 'admin' && ticketData.buyingPrice && (
        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-success font-caption">
              Profit Analysis
            </span>
          </div>
          <div className="text-sm text-muted-foreground font-caption">
            <p>Cost Price: ৳{(ticketData.buyingPrice * passengerCount).toLocaleString()}</p>
            <p>Selling Price: ৳{pricing.totalAmount.toLocaleString()}</p>
            <p className="font-medium text-success">
              Profit Margin: ৳{(pricing.totalAmount - (ticketData.buyingPrice * passengerCount)).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingStep;