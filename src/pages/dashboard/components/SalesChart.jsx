import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SalesChart = () => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('7days');

  const salesData = [
    { name: 'Mon', sales: 45, amount: 125000, bookings: 12 },
    { name: 'Tue', sales: 52, amount: 145000, bookings: 15 },
    { name: 'Wed', sales: 38, amount: 98000, bookings: 10 },
    { name: 'Thu', sales: 61, amount: 175000, bookings: 18 },
    { name: 'Fri', sales: 55, amount: 165000, bookings: 16 },
    { name: 'Sat', sales: 67, amount: 195000, bookings: 20 },
    { name: 'Sun', sales: 43, amount: 115000, bookings: 11 }
  ];

  const monthlyData = [
    { name: 'Jan', sales: 1250, amount: 3500000, bookings: 350 },
    { name: 'Feb', sales: 1180, amount: 3200000, bookings: 320 },
    { name: 'Mar', sales: 1420, amount: 4100000, bookings: 410 },
    { name: 'Apr', sales: 1350, amount: 3800000, bookings: 380 },
    { name: 'May', sales: 1580, amount: 4500000, bookings: 450 },
    { name: 'Jun', sales: 1650, amount: 4700000, bookings: 470 }
  ];

  const currentData = timeRange === '7days' ? salesData : monthlyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'sales' && 'Total Sales: '}
              {entry.name === 'amount' && 'Amount: ৳'}
              {entry.name === 'bookings' && 'Bookings: '}
              {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Sales Performance</h3>
          <p className="text-sm text-muted-foreground font-caption">Track your daily sales trends</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={timeRange === '7days' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('7days')}
              className="text-xs"
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('monthly')}
              className="text-xs"
            >
              Monthly
            </Button>
          </div>
          
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setChartType('bar')}
            >
              <Icon name="BarChart3" size={16} />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setChartType('line')}
            >
              <Icon name="TrendingUp" size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sales" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
                name="sales"
              />
            </BarChart>
          ) : (
            <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                name="sales"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChart;