import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const FilterPanel = ({ onFiltersChange, airlines }) => {
  const [filters, setFilters] = useState({
    airline: '',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: '',
    departureTime: '',
    status: ''
  });

  const airlineOptions = [
    { value: '', label: 'All Airlines' },
    ...airlines.map(airline => ({
      value: airline.code,
      label: airline.name
    }))
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'locked', label: 'Locked' },
    { value: 'sold', label: 'Sold Out' }
  ];

  const timeOptions = [
    { value: '', label: 'Any Time' },
    { value: 'morning', label: 'Morning (06:00 - 12:00)' },
    { value: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
    { value: 'evening', label: 'Evening (18:00 - 24:00)' },
    { value: 'night', label: 'Night (00:00 - 06:00)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      airline: '',
      dateFrom: '',
      dateTo: '',
      priceMin: '',
      priceMax: '',
      departureTime: '',
      status: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Filter Tickets
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Airline"
          options={airlineOptions}
          value={filters.airline}
          onChange={(value) => handleFilterChange('airline', value)}
          placeholder="Select airline"
        />

        <Input
          label="From Date"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        />

        <Select
          label="Departure Time"
          options={timeOptions}
          value={filters.departureTime}
          onChange={(value) => handleFilterChange('departureTime', value)}
          placeholder="Any time"
        />

        <Input
          label="Min Price (BDT)"
          type="number"
          placeholder="0"
          value={filters.priceMin}
          onChange={(e) => handleFilterChange('priceMin', e.target.value)}
        />

        <Input
          label="Max Price (BDT)"
          type="number"
          placeholder="100000"
          value={filters.priceMax}
          onChange={(e) => handleFilterChange('priceMax', e.target.value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="All status"
        />

        <div className="flex items-end">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            className="w-full"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;