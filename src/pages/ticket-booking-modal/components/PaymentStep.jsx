import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentStep = ({ formData, onFormChange }) => {
  const [payment, setPayment] = useState({
    status: formData.payment?.status || 'pending',
    paidAmount: formData.payment?.paidAmount || 0,
    remainingAmount: formData.payment?.remainingAmount || 0,
    paymentMethod: formData.payment?.paymentMethod || '',
    transactionId: formData.payment?.transactionId || '',
    comments: formData.payment?.comments || ''
  });

  const totalAmount = formData.pricing?.totalAmount || 0;

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending Payment' },
    { value: 'partial', label: 'Partial Payment' },
    { value: 'full', label: 'Full Payment' },
    { value: 'advance', label: 'Advance Payment' }
  ];

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'mobile_banking', label: 'Mobile Banking' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'cheque', label: 'Cheque' }
  ];

  const handlePaymentChange = (field, value) => {
    let updatedPayment = { ...payment, [field]: value };
    
    // Calculate remaining amount when paid amount changes
    if (field === 'paidAmount') {
      const paidAmount = parseFloat(value) || 0;
      updatedPayment.remainingAmount = Math.max(0, totalAmount - paidAmount);
      
      // Auto-update status based on payment amount
      if (paidAmount === 0) {
        updatedPayment.status = 'pending';
      } else if (paidAmount >= totalAmount) {
        updatedPayment.status = 'full';
        updatedPayment.remainingAmount = 0;
      } else {
        updatedPayment.status = 'partial';
      }
    }
    
    setPayment(updatedPayment);
    onFormChange({
      ...formData,
      payment: updatedPayment
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'full': return 'text-success';
      case 'partial': return 'text-warning';
      case 'advance': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'full': return 'CheckCircle';
      case 'partial': return 'Clock';
      case 'advance': return 'ArrowUp';
      default: return 'AlertCircle';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Payment Summary */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="CreditCard" size={20} color="var(--color-primary)" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Payment Summary
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-caption mb-1">Total Amount</p>
            <p className="font-heading font-semibold text-lg text-foreground">
              ৳{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-caption mb-1">Paid Amount</p>
            <p className="font-heading font-semibold text-lg text-success">
              ৳{payment.paidAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-caption mb-1">Remaining</p>
            <p className="font-heading font-semibold text-lg text-warning">
              ৳{payment.remainingAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon 
            name={getStatusIcon(payment.status)} 
            size={20} 
            color={`var(--color-${payment.status === 'full' ? 'success' : payment.status === 'partial' ? 'warning' : 'primary'})`} 
          />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Payment Details
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium font-caption ${getStatusColor(payment.status)}`}>
            {paymentStatusOptions.find(opt => opt.value === payment.status)?.label}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Payment Status"
            options={paymentStatusOptions}
            value={payment.status}
            onChange={(value) => handlePaymentChange('status', value)}
            required
          />
          
          <Select
            label="Payment Method"
            options={paymentMethodOptions}
            value={payment.paymentMethod}
            onChange={(value) => handlePaymentChange('paymentMethod', value)}
            placeholder="Select payment method"
            required
          />
          
          <Input
            label="Paid Amount (৳)"
            type="number"
            placeholder="Enter paid amount"
            value={payment.paidAmount}
            onChange={(e) => handlePaymentChange('paidAmount', e.target.value)}
            min="0"
            max={totalAmount}
            description="Amount received from customer"
          />
          
          <Input
            label="Transaction ID"
            type="text"
            placeholder="Enter transaction reference"
            value={payment.transactionId}
            onChange={(e) => handlePaymentChange('transactionId', e.target.value)}
            description="Reference number for tracking"
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="MessageSquare" size={20} color="var(--color-primary)" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Internal Comments
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-caption">
              Booking Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows="4"
              placeholder="Add any special instructions, customer requests, or internal notes..."
              value={payment.comments}
              onChange={(e) => handlePaymentChange('comments', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1 font-caption">
              These comments are for internal use only and will not be visible to customers.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Status Preview */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Info" size={20} color="var(--color-primary)" />
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Booking Status Preview
          </h3>
        </div>
        
        <div className="space-y-2 text-sm font-caption">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking Status:</span>
            <span className="font-medium text-foreground">
              {payment.status === 'full' ? 'Confirmed' : 'Locked (24 hours)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lock Expires:</span>
            <span className="font-medium text-foreground">
              {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')} at{' '}
              {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Action:</span>
            <span className="font-medium text-foreground">
              {payment.status === 'full' ? 'Issue Ticket' : 'Collect Remaining Payment'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;