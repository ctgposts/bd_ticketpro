import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'custom',
    fromDate: '',
    toDate: '',
    includeFields: {
      bookingDate: true,
      passengerName: true,
      destination: true,
      airline: true,
      ticketPrice: true,
      buyingPrice: false,
      profit: false,
      agentName: true,
      paymentStatus: true,
      bookingStatus: true
    }
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel Compatible)' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Workbook' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const fieldOptions = [
    { key: 'bookingDate', label: 'Booking Date', required: true },
    { key: 'passengerName', label: 'Passenger Name', required: true },
    { key: 'destination', label: 'Destination', required: false },
    { key: 'airline', label: 'Airline', required: false },
    { key: 'ticketPrice', label: 'Ticket Price', required: true },
    { key: 'buyingPrice', label: 'Buying Price (Admin Only)', required: false, adminOnly: true },
    { key: 'profit', label: 'Profit Margin (Admin Only)', required: false, adminOnly: true },
    { key: 'agentName', label: 'Agent Name', required: false },
    { key: 'paymentStatus', label: 'Payment Status', required: false },
    { key: 'bookingStatus', label: 'Booking Status', required: false }
  ];

  const handleFieldChange = (fieldKey, checked) => {
    setExportConfig(prev => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [fieldKey]: checked
      }
    }));
  };

  const handleExport = () => {
    onExport(exportConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-heading font-semibold text-xl text-foreground">
              Export Sales Report
            </h2>
            <p className="text-sm text-muted-foreground font-caption mt-1">
              Configure your export settings and download the report
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Export Format */}
            <div>
              <Select
                label="Export Format"
                description="Choose the format for your exported report"
                options={formatOptions}
                value={exportConfig.format}
                onChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}
              />
            </div>

            {/* Date Range */}
            <div>
              <Select
                label="Date Range"
                description="Select the time period for the report"
                options={dateRangeOptions}
                value={exportConfig.dateRange}
                onChange={(value) => setExportConfig(prev => ({ ...prev, dateRange: value }))}
              />
              
              {exportConfig.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="From Date"
                    type="date"
                    value={exportConfig.fromDate}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, fromDate: e.target.value }))}
                    required
                  />
                  <Input
                    label="To Date"
                    type="date"
                    value={exportConfig.toDate}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, toDate: e.target.value }))}
                    required
                  />
                </div>
              )}
            </div>

            {/* Field Selection */}
            <div>
              <h3 className="font-medium text-foreground mb-3">
                Include Fields
              </h3>
              <p className="text-sm text-muted-foreground font-caption mb-4">
                Select which fields to include in your export
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fieldOptions.map((field) => (
                  <Checkbox
                    key={field.key}
                    label={field.label}
                    checked={exportConfig.includeFields[field.key]}
                    onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                    disabled={field.required}
                  />
                ))}
              </div>
            </div>

            {/* Export Preview */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Export Preview</h4>
              <div className="text-sm text-muted-foreground font-caption space-y-1">
                <p>Format: {formatOptions.find(f => f.value === exportConfig.format)?.label}</p>
                <p>Date Range: {dateRangeOptions.find(d => d.value === exportConfig.dateRange)?.label}</p>
                <p>Fields: {Object.values(exportConfig.includeFields).filter(Boolean).length} selected</p>
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
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
            disabled={exportConfig.dateRange === 'custom' && (!exportConfig.fromDate || !exportConfig.toDate)}
          >
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;