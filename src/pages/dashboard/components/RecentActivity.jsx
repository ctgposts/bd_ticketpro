import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ userRole = 'staff' }) => {
  const activities = [
    {
      id: 1,
      type: 'booking',
      title: 'New booking created',
      description: 'Flight to Dubai - Emirates Airlines',
      user: 'Rashid Ahmed',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      icon: 'Ticket',
      color: 'text-primary'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment received',
      description: '৳45,000 for booking #BK-2024-001',
      user: 'Fatima Khan',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      icon: 'CreditCard',
      color: 'text-success'
    },
    {
      id: 3,
      type: 'lock',
      title: 'Ticket locked',
      description: 'Saudi Airlines - Riyadh flight locked for 24h',
      user: 'Mohammad Hassan',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      icon: 'Lock',
      color: 'text-warning'
    },
    {
      id: 4,
      type: 'confirmation',
      title: 'Booking confirmed',
      description: 'Qatar Airways - Doha flight confirmed',
      user: 'Ayesha Rahman',
      timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 5,
      type: 'inventory',
      title: 'Inventory updated',
      description: '25 new tickets added for Kuwait Airways',
      user: 'System',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'Package',
      color: 'text-accent'
    }
  ];

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground font-caption">Latest system updates</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground font-caption">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activity.color}`}>
              <Icon name={activity.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground text-sm">{activity.title}</p>
                <span className="text-xs text-muted-foreground font-caption">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-caption mt-1">
                {activity.description}
              </p>
              {activity.user !== 'System' && (
                <p className="text-xs text-muted-foreground font-caption mt-1">
                  by {activity.user}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center">
          <button className="text-sm text-primary hover:text-primary/80 font-medium font-caption transition-colors duration-200">
            View all activities
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivity;