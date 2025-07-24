import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PermissionsModal = ({ isOpen, onClose, onSave, agent }) => {
  const [permissions, setPermissions] = useState({
    viewDashboard: false,
    manageInventory: false,
    bookTickets: false,
    confirmBookings: false,
    viewReports: false,
    manageAgents: false,
    viewBuyingPrice: false,
    unlockTickets: false,
    exportData: false,
    managePayments: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const permissionGroups = [
    {
      title: 'Dashboard & Overview',
      permissions: [
        { key: 'viewDashboard', label: 'View Dashboard', description: 'Access to main dashboard and statistics' }
      ]
    },
    {
      title: 'Ticket Management',
      permissions: [
        { key: 'manageInventory', label: 'Manage Inventory', description: 'Add, edit, and remove ticket inventory' },
        { key: 'bookTickets', label: 'Book Tickets', description: 'Create new ticket bookings' },
        { key: 'confirmBookings', label: 'Confirm Bookings', description: 'Confirm and finalize bookings' },
        { key: 'unlockTickets', label: 'Unlock Tickets', description: 'Unlock locked tickets' }
      ]
    },
    {
      title: 'Financial',
      permissions: [
        { key: 'viewBuyingPrice', label: 'View Buying Price', description: 'See ticket purchase prices' },
        { key: 'managePayments', label: 'Manage Payments', description: 'Handle payment processing' }
      ]
    },
    {
      title: 'Reports & Data',
      permissions: [
        { key: 'viewReports', label: 'View Reports', description: 'Access sales and performance reports' },
        { key: 'exportData', label: 'Export Data', description: 'Export reports and data to CSV/PDF' }
      ]
    },
    {
      title: 'Administration',
      permissions: [
        { key: 'manageAgents', label: 'Manage Agents', description: 'Add, edit, and manage agent accounts' }
      ]
    }
  ];

  useEffect(() => {
    if (agent) {
      // Set default permissions based on role
      const defaultPermissions = getDefaultPermissions(agent.role);
      setPermissions(defaultPermissions);
    }
  }, [agent]);

  const getDefaultPermissions = (role) => {
    const basePermissions = {
      viewDashboard: false,
      manageInventory: false,
      bookTickets: false,
      confirmBookings: false,
      viewReports: false,
      manageAgents: false,
      viewBuyingPrice: false,
      unlockTickets: false,
      exportData: false,
      managePayments: false
    };

    switch (role?.toLowerCase()) {
      case 'admin':
        return {
          ...basePermissions,
          viewDashboard: true,
          manageInventory: true,
          bookTickets: true,
          confirmBookings: true,
          viewReports: true,
          manageAgents: true,
          viewBuyingPrice: true,
          unlockTickets: true,
          exportData: true,
          managePayments: true
        };
      case 'manager':
        return {
          ...basePermissions,
          viewDashboard: true,
          manageInventory: true,
          bookTickets: true,
          confirmBookings: true,
          viewReports: true,
          exportData: true,
          managePayments: true
        };
      case 'staff':
        return {
          ...basePermissions,
          viewDashboard: true,
          bookTickets: true,
          viewReports: true
        };
      default:
        return basePermissions;
    }
  };

  const handlePermissionChange = (key, checked) => {
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedAgent = {
        ...agent,
        permissions
      };
      
      onSave(updatedAgent);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  if (!agent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={20} color="var(--color-muted-foreground)" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-xl text-foreground">
                    Manage Permissions
                  </h2>
                  <p className="text-sm text-muted-foreground font-caption">
                    {agent.name} • {agent.role}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {permissionGroups.map((group) => (
                  <div key={group.title} className="space-y-3">
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      {group.title}
                    </h3>
                    <div className="space-y-3 pl-4">
                      {group.permissions.map((permission) => (
                        <div key={permission.key} className="space-y-1">
                          <Checkbox
                            label={permission.label}
                            checked={permissions[permission.key]}
                            onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                          />
                          <p className="text-xs text-muted-foreground font-caption pl-6">
                            {permission.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Permissions
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PermissionsModal;