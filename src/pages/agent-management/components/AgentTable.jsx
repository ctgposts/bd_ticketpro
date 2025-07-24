import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AgentTable = ({ agents, onEdit, onViewPerformance, onManagePermissions, userRole }) => {
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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Agent Name
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Role
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Contact
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Join Date
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Bookings
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Sales Amount
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 font-heading font-semibold text-sm text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr key={agent.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground font-caption">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(agent.role)}`}>
                    {agent.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-foreground font-caption">{agent.phone}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-foreground font-caption">{agent.joinDate}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-medium text-foreground">{agent.totalBookings}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-medium text-foreground">৳{agent.salesAmount.toLocaleString()}</p>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(agent)}
                      iconName="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPerformance(agent)}
                      iconName="BarChart3"
                    />
                    {userRole === 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onManagePermissions(agent)}
                        iconName="Shield"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentTable;