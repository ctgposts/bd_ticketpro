import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isExpanded = true, onToggle, userRole = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('');

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['admin', 'manager', 'staff'],
      tooltip: 'Overview and metrics'
    },
    {
      label: 'Inventory',
      path: '/country-ticket-inventory',
      icon: 'Package',
      roles: ['admin', 'manager', 'staff'],
      tooltip: 'Country ticket inventory'
    },
    {
      label: 'Reports',
      path: '/sales-reports',
      icon: 'BarChart3',
      roles: ['admin', 'manager'],
      tooltip: 'Sales analytics and reports'
    },
    {
      label: 'Management',
      path: '/agent-management',
      icon: 'Users',
      roles: ['admin'],
      tooltip: 'Agent administration'
    }
  ];

  const userInfo = {
    name: 'John Doe',
    role: userRole,
    avatar: '/assets/images/no_image.png'
  };

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveItem(path);
  };

  const handleLogout = () => {
    navigate('/login-screen');
  };

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-border z-50
          transition-transform duration-300 ease-out
          ${isExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-280' : 'w-280 lg:w-16'}
        `}
        style={{ width: isExpanded ? '280px' : '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className={`flex items-center space-x-3 ${!isExpanded && 'lg:justify-center'}`}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Ticket" size={20} color="white" />
              </div>
              {(isExpanded || window.innerWidth < 1024) && (
                <div>
                  <h1 className="font-heading font-semibold text-lg text-foreground">
                    BD TicketPro
                  </h1>
                  <p className="text-xs text-muted-foreground font-caption">
                    Travel Management
                  </p>
                </div>
              )}
            </div>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-border">
            <div className={`flex items-center space-x-3 ${!isExpanded && 'lg:justify-center'}`}>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="var(--color-muted-foreground)" />
              </div>
              {(isExpanded || window.innerWidth < 1024) && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {userInfo.name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize font-caption">
                    {userInfo.role}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavItems.map((item) => (
              <div key={item.path} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-3 rounded-lg
                    transition-all duration-150 ease-out
                    ${activeItem === item.path 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                    ${!isExpanded && 'lg:justify-center lg:px-2'}
                  `}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={activeItem === item.path ? 'currentColor' : 'currentColor'}
                  />
                  {(isExpanded || window.innerWidth < 1024) && (
                    <span className="font-medium text-sm font-caption">
                      {item.label}
                    </span>
                  )}
                </button>
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="
                    absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                    bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none z-50 whitespace-nowrap shadow-modal
                    hidden lg:block
                  ">
                    {item.tooltip}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`
                w-full justify-start text-muted-foreground hover:text-foreground
                ${!isExpanded && 'lg:justify-center lg:px-2'}
              `}
            >
              <Icon name="LogOut" size={20} />
              {(isExpanded || window.innerWidth < 1024) && (
                <span className="ml-3 font-caption">Logout</span>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;