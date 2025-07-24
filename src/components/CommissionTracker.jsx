import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from './AppIcon';

import Select from './ui/Select';
import agentService from '../utils/agentService';
import { useAuth } from '../contexts/AuthContext';

const CommissionTracker = () => {
  const { userProfile } = useAuth();
  const [commissionData, setCommissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedAgent, setSelectedAgent] = useState(userProfile?.id || 'all');
  const [agents, setAgents] = useState([]);

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  // Load agents (for admin/manager view)
  useEffect(() => {
    const loadAgents = async () => {
      if (userProfile?.role === 'admin' || userProfile?.role === 'manager') {
        const result = await agentService.getAgents();
        if (result.success) {
          setAgents([
            { value: 'all', label: 'All Agents' },
            ...result.data.map(agent => ({
              value: agent.id,
              label: agent.full_name
            }))
          ]);
        }
      } else {
        // For staff, only show their own data
        setSelectedAgent(userProfile?.id);
      }
    };

    if (userProfile) {
      loadAgents();
    }
  }, [userProfile]);

  // Load commission data
  useEffect(() => {
    const loadCommissionData = async () => {
      if (!userProfile?.id && selectedAgent === 'all') return;

      setLoading(true);
      setError('');

      try {
        let result;
        
        if (selectedAgent === 'all') {
          // Load all agents' commission data (admin/manager only)
          const allAgentsResult = await agentService.getAgents();
          if (allAgentsResult.success) {
            const commissionPromises = allAgentsResult.data.map(async (agent) => {
              const stats = await agentService.getAgentCommissionStats(agent.id);
              return {
                agent: agent,
                stats: stats.success ? stats.data : null
              };
            });
            
            const allCommissions = await Promise.all(commissionPromises);
            setCommissionData({ type: 'all', data: allCommissions });
          }
        } else {
          // Load specific agent's commission data
          result = await agentService.getAgentCommissionStats(selectedAgent);
          if (result.success) {
            setCommissionData({ type: 'single', data: result.data });
          } else {
            setError(result.error || 'Failed to load commission data');
          }
        }
      } catch (error) {
        setError('Something went wrong while loading commission data');
        console.log('Commission loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCommissionData();
  }, [userProfile, selectedAgent, selectedPeriod]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading commission data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center">
          <Icon name="AlertCircle" size={24} color="var(--color-destructive)" />
          <p className="text-destructive mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header and Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
            <h2 className="font-heading font-semibold text-xl text-foreground">
              Commission Tracker
            </h2>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Agent Selection (for admin/manager) */}
          {(userProfile?.role === 'admin' || userProfile?.role === 'manager') && agents.length > 0 && (
            <Select
              label="Select Agent"
              options={agents}
              value={selectedAgent}
              onChange={setSelectedAgent}
            />
          )}
          
          {/* Period Selection */}
          <Select
            label="Time Period"
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </div>
      </div>

      {/* Commission Data Display */}
      {commissionData?.type === 'single' && commissionData.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon name="DollarSign" size={20} color="var(--color-success)" />
              <span className="text-xs text-success font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {formatPrice(commissionData.data.totalCommission)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Commission</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon name="Ticket" size={20} color="var(--color-primary)" />
              <span className="text-xs text-primary font-medium">+8</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {commissionData.data.totalBookings}
            </h3>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
              <span className="text-xs text-accent font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {formatPrice(commissionData.data.totalSales)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Sales</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon name="BarChart" size={20} color="var(--color-warning)" />
              <span className="text-xs text-warning font-medium">{userProfile?.commission_rate || 5}%</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {formatPrice(commissionData.data.averageBookingValue)}
            </h3>
            <p className="text-sm text-muted-foreground">Avg Booking Value</p>
          </motion.div>
        </div>
      )}

      {/* All Agents Commission Data */}
      {commissionData?.type === 'all' && commissionData.data && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              All Agents Commission Summary
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Agent</th>
                  <th className="text-left p-4 font-medium text-foreground">Role</th>
                  <th className="text-right p-4 font-medium text-foreground">Bookings</th>
                  <th className="text-right p-4 font-medium text-foreground">Total Sales</th>
                  <th className="text-right p-4 font-medium text-foreground">Commission</th>
                  <th className="text-right p-4 font-medium text-foreground">Rate</th>
                </tr>
              </thead>
              <tbody>
                {commissionData.data.map((item, index) => (
                  <motion.tr
                    key={item.agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{item.agent.full_name}</p>
                        <p className="text-sm text-muted-foreground">{item.agent.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                        {item.agent.role}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      {item.stats?.totalBookings || 0}
                    </td>
                    <td className="p-4 text-right font-medium">
                      {formatPrice(item.stats?.totalSales || 0)}
                    </td>
                    <td className="p-4 text-right font-semibold text-success">
                      {formatPrice(item.stats?.totalCommission || 0)}
                    </td>
                    <td className="p-4 text-right text-sm text-muted-foreground">
                      {item.agent.commission_rate || 5}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Breakdown Chart (for single agent) */}
      {commissionData?.type === 'single' && commissionData.data?.bookingsByMonth && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
            Monthly Commission Breakdown
          </h3>
          
          <div className="space-y-3">
            {Object.entries(commissionData.data.bookingsByMonth)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([month, data]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="font-medium text-foreground">
                      {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-muted-foreground">
                      {data.count} bookings
                    </span>
                    <span className="font-semibold text-success">
                      {formatPrice(data.commission)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommissionTracker;