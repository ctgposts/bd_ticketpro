import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCards = ({ summaryData, userRole }) => {
  const cards = [
    {
      title: 'Total Sales',
      value: `৳${summaryData.totalSales.toLocaleString()}`,
      change: summaryData.salesChange,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Tickets Sold',
      value: summaryData.ticketsSold.toLocaleString(),
      change: summaryData.ticketsChange,
      icon: 'Ticket',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Commission Earned',
      value: `৳${summaryData.commission.toLocaleString()}`,
      change: summaryData.commissionChange,
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      adminOnly: true
    },
    {
      title: 'Pending Payments',
      value: `৳${summaryData.pendingPayments.toLocaleString()}`,
      change: summaryData.pendingChange,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const visibleCards = cards.filter(card => 
    !card.adminOnly || userRole === 'admin'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {visibleCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <Icon 
                name={card.icon} 
                size={24} 
                color={`var(--color-${card.color.replace('text-', '')})`}
              />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              card.change >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              <Icon 
                name={card.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span className="font-medium">
                {Math.abs(card.change)}%
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              {card.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;