import React from 'react';
import Icon from '../../../components/AppIcon';

const TeamStats = ({ agents }) => {
  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalBookings = agents.reduce((sum, agent) => sum + agent.totalBookings, 0);
  const totalSales = agents.reduce((sum, agent) => sum + agent.salesAmount, 0);

  const roleDistribution = agents.reduce((acc, agent) => {
    acc[agent.role] = (acc[agent.role] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      title: 'Total Agents',
      value: totalAgents,
      icon: 'Users',
      color: 'var(--color-primary)'
    },
    {
      title: 'Active Agents',
      value: activeAgents,
      icon: 'UserCheck',
      color: 'var(--color-success)'
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: 'Ticket',
      color: 'var(--color-accent)'
    },
    {
      title: 'Total Sales',
      value: `৳${totalSales.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'var(--color-warning)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Team Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon name={stat.icon} size={20} color={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-caption">
                    {stat.title}
                  </p>
                  <p className="text-lg font-heading font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Role Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(roleDistribution).map(([role, count]) => (
            <div key={role} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  role === 'admin' ? 'bg-accent' :
                  role === 'manager' ? 'bg-primary' : 'bg-secondary'
                }`}></div>
                <span className="text-sm font-medium text-foreground capitalize">
                  {role}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={16} color="var(--color-success)" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                New agent <span className="font-medium">Sarah Ahmed</span> joined as Staff
              </p>
              <p className="text-xs text-muted-foreground font-caption">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="Award" size={16} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">Mohammad Khan</span> achieved top sales this month
              </p>
              <p className="text-xs text-muted-foreground font-caption">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
              <Icon name="Settings" size={16} color="var(--color-warning)" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                Permissions updated for <span className="font-medium">Fatima Ali</span>
              </p>
              <p className="text-xs text-muted-foreground font-caption">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStats;