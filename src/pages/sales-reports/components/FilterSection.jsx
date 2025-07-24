import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const FilterSection = ({ filters, onFiltersChange, onExport, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const countryOptions = [
    { value: 'all', label: 'All Countries' },
    { value: 'saudi-arabia', label: 'Saudi Arabia' },
    { value: 'uae', label: 'United Arab Emirates' },
    { value: 'qatar', label: 'Qatar' },
    { value: 'kuwait', label: 'Kuwait' },
    { value: 'oman', label: 'Oman' },
    { value: 'bahrain', label: 'Bahrain' }
  ];

  const airlineOptions = [
    { value: 'all', label: 'All Airlines' },
    { value: 'biman', label: 'Biman Bangladesh Airlines' },
    { value: 'emirates', label: 'Emirates' },
    { value: 'qatar-airways', label: 'Qatar Airways' },
    { value: 'etihad', label: 'Etihad Airways' },
    { value: 'flydubai', label: 'FlyDubai' },
    { value: 'saudia', label: 'Saudia' }
  ];

  const staffOptions = [
    { value: 'all', label: 'All Staff' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-ahmed', label: 'Sarah Ahmed' },
    { value: 'michael-rahman', label: 'Michael Rahman' },
    { value: 'fatima-khan', label: 'Fatima Khan' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'sold', label: 'Sold' },
    { value: 'booked', label: 'Booked' },
    { value: 'locked', label: 'Locked' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Filter Reports
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'}`}>
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="From Date"
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
          />
          <Input
            label="To Date"
            type="date"
            value={filters.toDate}
            onChange={(e) => handleFilterChange('toDate', e.target.value)}
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Country"
            options={countryOptions}
            value={filters.country}
            onChange={(value) => handleFilterChange('country', value)}
          />
          <Select
            label="Airline"
            options={airlineOptions}
            value={filters.airline}
            onChange={(value) => handleFilterChange('airline', value)}
          />
          <Select
            label="Staff Member"
            options={staffOptions}
            value={filters.staff}
            onChange={(value) => handleFilterChange('staff', value)}
          />
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onExport('csv')}
            iconName="Download"
            iconPosition="left"
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => onExport('pdf')}
            iconName="FileText"
            iconPosition="left"
          >
            Export PDF
          </Button>
          <Button
            variant="default"
            onClick={() => {/* Apply filters logic */}}
            iconName="Search"
            iconPosition="left"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${isExpanded ? 'mt-4 pt-4 border-t border-border' : ''}`}>
        <Button
          variant={filters.quickFilter === 'today' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('quickFilter', 'today')}
        >
          Today
        </Button>
        <Button
          variant={filters.quickFilter === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('quickFilter', 'week')}
        >
          This Week
        </Button>
        <Button
          variant={filters.quickFilter === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('quickFilter', 'month')}
        >
          This Month
        </Button>
        <Button
          variant={filters.quickFilter === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('quickFilter', 'year')}
        >
          This Year
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;