import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  statusFilter, 
  onStatusFilterChange,
  onAddAgent,
  userRole
}) => {
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search agents by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-40">
            <Select
              placeholder="Filter by role"
              options={roleOptions}
              value={roleFilter}
              onChange={onRoleFilterChange}
            />
          </div>
          
          <div className="w-full sm:w-40">
            <Select
              placeholder="Filter by status"
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
            />
          </div>
        </div>

        {/* Add Agent Button */}
        {userRole === 'admin' && (
          <div className="flex justify-end">
            <Button
              onClick={onAddAgent}
              iconName="Plus"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Add New Agent
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-6 text-sm font-caption">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">
              Showing filtered results
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Active</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;