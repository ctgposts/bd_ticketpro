import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different roles
  const mockCredentials = {
    admin: { email: 'admin@bdticketpro.com', password: 'admin123' },
    manager: { email: 'manager@bdticketpro.com', password: 'manager123' },
    staff: { email: 'staff@bdticketpro.com', password: 'staff123' }
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const roleCredentials = mockCredentials[formData.role];
      
      if (formData.email === roleCredentials.email && formData.password === roleCredentials.password) {
        // Store user data in localStorage
        localStorage.setItem('userRole', formData.role);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('isAuthenticated', 'true');
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setErrors({
          general: `Invalid credentials for ${formData.role}. Please check your email and password.`
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Please contact your system administrator to reset your password.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Icon name="Ticket" size={32} color="white" />
        </motion.div>
        
        <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground font-caption">
          Sign in to your BD TicketPro account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-error/10 border border-error/20 rounded-lg p-3"
          >
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <p className="text-sm text-error font-caption">{errors.general}</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            required
            disabled={isLoading}
          />

          <Select
            label="Select Role"
            placeholder="Choose your role"
            options={roleOptions}
            value={formData.role}
            onChange={(value) => handleInputChange('role', value)}
            error={errors.role}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-secondary transition-colors font-caption"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName={isLoading ? undefined : "LogIn"}
          iconPosition="right"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-caption mb-2">
            Demo Credentials:
          </p>
          <div className="space-y-1 text-xs font-data">
            <p><span className="font-medium">Admin:</span> admin@bdticketpro.com / admin123</p>
            <p><span className="font-medium">Manager:</span> manager@bdticketpro.com / manager123</p>
            <p><span className="font-medium">Staff:</span> staff@bdticketpro.com / staff123</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;