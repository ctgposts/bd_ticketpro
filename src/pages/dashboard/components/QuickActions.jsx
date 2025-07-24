import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ userRole = 'staff' }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Booking',
      description: 'Create a new ticket booking',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      onClick: () => navigate('/ticket-booking-modal'),
      roles: ['admin', 'manager', 'staff']
    },
    {
      title: 'View Inventory',
      description: 'Check ticket availability',
      icon: 'Package',
      color: 'bg-secondary text-secondary-foreground',
      onClick: () => navigate('/country-ticket-inventory'),
      roles: ['admin', 'manager', 'staff']
    },
    {
      title: 'Sales Reports',
      description: 'View today\'s sales data',
      icon: 'BarChart3',
      color: 'bg-accent text-accent-foreground',
      onClick: () => navigate('/sales-reports'),
      roles: ['admin', 'manager']
    },
    {
      title: 'Agent Management',
      description: 'Manage staff and agents',
      icon: 'Users',
      color: 'bg-success text-success-foreground',
      onClick: () => navigate('/agent-management'),
      roles: ['admin']
    }
  ];

  const filteredActions = actions.filter(action => action.roles.includes(userRole));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground font-caption">Frequently used operations</p>
      </div>

      <div className="space-y-3">
        {filteredActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <Button
              variant="ghost"
              onClick={action.onClick}
              className="w-full justify-start p-4 h-auto hover:bg-muted"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                  <Icon name={action.icon} size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="text-sm text-muted-foreground font-caption">{action.description}</p>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-caption">Last updated</span>
          <span className="text-foreground font-medium">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;