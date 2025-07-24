import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Button from '../../../components/ui/Button';


const SalesChart = ({ data, userRole }) => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('week');

  const weeklyData = [
    { name: 'Mon', sales: 45000, tickets: 12, commission: 4500 },
    { name: 'Tue', sales: 52000, tickets: 15, commission: 5200 },
    { name: 'Wed', sales: 38000, tickets: 10, commission: 3800 },
    { name: 'Thu', sales: 61000, tickets: 18, commission: 6100 },
    { name: 'Fri', sales: 55000, tickets: 16, commission: 5500 },
    { name: 'Sat', sales: 67000, tickets: 20, commission: 6700 },
    { name: 'Sun', sales: 43000, tickets: 11, commission: 4300 }
  ];

  const monthlyData = [
    { name: 'Jan', sales: 185000, tickets: 52, commission: 18500 },
    { name: 'Feb', sales: 220000, tickets: 65, commission: 22000 },
    { name: 'Mar', sales: 195000, tickets: 58, commission: 19500 },
    { name: 'Apr', sales: 240000, tickets: 72, commission: 24000 },
    { name: 'May', sales: 210000, tickets: 61, commission: 21000 },
    { name: 'Jun', sales: 280000, tickets: 85, commission: 28000 }
  ];

  const countryData = [
    { name: 'Saudi Arabia', value: 35, color: '#289E8E' },
    { name: 'UAE', value: 25, color: '#FF6B35' },
    { name: 'Qatar', value: 20, color: '#10B981' },
    { name: 'Kuwait', value: 12, color: '#F59E0B' },
    { name: 'Others', value: 8, color: '#6B7280' }
  ];

  const currentData = timeRange === 'week' ? weeklyData : monthlyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'sales' || entry.name === 'commission' 
                ? `৳${entry.value.toLocaleString()}` 
                : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
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
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="tickets" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
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
              <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              {userRole === 'admin' && (
                <Bar dataKey="commission" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Sales Analytics
          </h3>
          <p className="text-sm text-muted-foreground font-caption mt-1">
            Performance overview and trends
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
          </div>
          
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
            />
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
            />
            <Button
              variant={chartType === 'pie' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('pie')}
              iconName="PieChart"
            />
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full">
        {renderChart()}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground font-caption">Sales Amount</span>
        </div>
        {chartType !== 'pie' && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-sm text-muted-foreground font-caption">
              {chartType === 'bar' && userRole === 'admin' ? 'Commission' : 'Tickets Sold'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;