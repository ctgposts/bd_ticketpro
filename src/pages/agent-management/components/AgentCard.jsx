import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AgentCard = ({ agent, onEdit, onViewPerformance, onManagePermissions, userRole }) => {
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-accent text-accent-foreground';
      case 'manager':
        return 'bg-primary text-primary-foreground';
      case 'staff':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success text-success-foreground' :'bg-destructive text-destructive-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Icon name="User" size={24} color="var(--color-muted-foreground)" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {agent.name}
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              {agent.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(agent.role)}`}>
            {agent.role}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
            {agent.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-caption">Phone</p>
          <p className="text-sm font-medium text-foreground">{agent.phone}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-caption">Join Date</p>
          <p className="text-sm font-medium text-foreground">{agent.joinDate}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-caption">Total Bookings</p>
          <p className="text-sm font-medium text-foreground">{agent.totalBookings}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-caption">Sales Amount</p>
          <p className="text-sm font-medium text-foreground">৳{agent.salesAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(agent)}
          iconName="Edit"
          iconPosition="left"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewPerformance(agent)}
          iconName="BarChart3"
          iconPosition="left"
        >
          Performance
        </Button>
        {userRole === 'admin' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onManagePermissions(agent)}
            iconName="Shield"
            iconPosition="left"
          >
            Permissions
          </Button>
        )}
      </div>
    </div>
  );
};

export default AgentCard;