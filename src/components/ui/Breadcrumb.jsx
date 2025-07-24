import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/country-ticket-inventory': { label: 'Inventory', icon: 'Package' },
    '/ticket-booking-modal': { label: 'Booking', icon: 'Ticket' },
    '/sales-reports': { label: 'Reports', icon: 'BarChart3' },
    '/agent-management': { label: 'Management', icon: 'Users' },
    '/login-screen': { label: 'Login', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard', icon: 'Home' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap[currentPath];
      
      if (routeInfo) {
        breadcrumbs.push({
          label: routeInfo.label,
          path: currentPath,
          icon: routeInfo.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm font-caption mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={16} 
              color="var(--color-muted-foreground)" 
            />
          )}
          
          {index === breadcrumbs.length - 1 ? (
            // Current page - not clickable
            <div className="flex items-center space-x-1">
              <Icon 
                name={item.icon} 
                size={16} 
                color="var(--color-foreground)" 
              />
              <span className="text-foreground font-medium">
                {item.label}
              </span>
            </div>
          ) : (
            // Clickable breadcrumb
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-center space-x-1">
                <Icon 
                  name={item.icon} 
                  size={16} 
                  color="currentColor" 
                />
                <span>{item.label}</span>
              </div>
            </Button>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;