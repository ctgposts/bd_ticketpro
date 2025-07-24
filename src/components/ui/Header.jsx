import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onSidebarToggle, title = 'Dashboard', showBreadcrumbs = false }) => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>

          {/* Page Title */}
          <div>
            <h1 className="font-heading font-semibold text-xl text-foreground">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Icon name="Settings" size={20} />
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="var(--color-muted-foreground)" />
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="ChevronDown" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;