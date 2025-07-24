import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const CountryTicketSummary = () => {
  const navigate = useNavigate();

  const countryData = [
    {
      id: 'saudi-arabia',
      name: 'Saudi Arabia',
      flag: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=60&fit=crop',
      available: 145,
      locked: 23,
      sold: 67,
      total: 235,
      popular: true
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100&h=60&fit=crop',
      available: 89,
      locked: 12,
      sold: 45,
      total: 146,
      popular: true
    },
    {
      id: 'qatar',
      name: 'Qatar',
      flag: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=100&h=60&fit=crop',
      available: 67,
      locked: 8,
      sold: 34,
      total: 109,
      popular: false
    },
    {
      id: 'kuwait',
      name: 'Kuwait',
      flag: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&h=60&fit=crop',
      available: 43,
      locked: 5,
      sold: 22,
      total: 70,
      popular: false
    },
    {
      id: 'oman',
      name: 'Oman',
      flag: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=60&fit=crop',
      available: 32,
      locked: 4,
      sold: 18,
      total: 54,
      popular: false
    },
    {
      id: 'bahrain',
      name: 'Bahrain',
      flag: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=60&fit=crop',
      available: 28,
      locked: 3,
      sold: 15,
      total: 46,
      popular: false
    }
  ];

  const handleCountryClick = (countryId) => {
    navigate(`/country-ticket-inventory?country=${countryId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Country Ticket Summary</h3>
          <p className="text-sm text-muted-foreground font-caption">Available tickets by destination</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/country-ticket-inventory')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countryData.map((country, index) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Button
              variant="ghost"
              onClick={() => handleCountryClick(country.id)}
              className="w-full p-4 h-auto border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="relative">
                  <div className="w-12 h-8 rounded overflow-hidden border border-border">
                    <img
                      src={country.flag}
                      alt={`${country.name} flag`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  {country.popular && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground text-sm">{country.name}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-xs text-muted-foreground font-caption">{country.available}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-xs text-muted-foreground font-caption">{country.locked}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span className="text-xs text-muted-foreground font-caption">{country.sold}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-heading font-semibold text-foreground">{country.available}</p>
                  <p className="text-xs text-muted-foreground font-caption">Available</p>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground font-caption">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground font-caption">Locked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-muted-foreground font-caption">Sold</span>
            </div>
          </div>
          <span className="text-muted-foreground font-caption">
            Total: {countryData.reduce((sum, country) => sum + country.total, 0)} tickets
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryTicketSummary;