import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingSummary = ({ summaryData }) => {
  const summaryItems = [
    {
      label: 'Today\'s Bookings',
      value: summaryData.todayBookings,
      icon: 'Calendar',
      color: 'text-primary'
    },
    {
      label: 'Locked Tickets',
      value: summaryData.lockedTickets,
      icon: 'Lock',
      color: 'text-warning'
    },
    {
      label: 'Total Revenue',
      value: `৳${summaryData.totalRevenue.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-success'
    },
    {
      label: 'Pending Payments',
      value: summaryData.pendingPayments,
      icon: 'Clock',
      color: 'text-accent'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
        Booking Summary
      </h3>
      
      <div className="space-y-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center`}>
                <Icon name={item.icon} size={16} color="var(--color-muted-foreground)" />
              </div>
              <span className="text-sm text-muted-foreground font-caption">
                {item.label}
              </span>
            </div>
            <span className={`text-sm font-medium ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-heading font-medium text-foreground mb-3">
          Recent Activity
        </h4>
        <div className="space-y-3">
          {summaryData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;