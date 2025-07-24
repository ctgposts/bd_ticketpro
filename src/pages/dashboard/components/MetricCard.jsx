import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  currency = '', 
  trend, 
  trendValue, 
  icon, 
  color = 'primary',
  delay = 0 
}) => {
  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    accent: 'bg-accent text-accent-foreground'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-heading font-semibold text-foreground mb-1">
          {currency && <span className="text-lg">{currency}</span>}
          {value.toLocaleString()}
        </h3>
        <p className="text-sm text-muted-foreground font-caption">{title}</p>
      </div>
    </motion.div>
  );
};

export default MetricCard;