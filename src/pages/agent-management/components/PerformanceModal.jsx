import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceModal = ({ isOpen, onClose, agent }) => {
  if (!agent) return null;

  const monthlyData = [
    { month: 'Jan', bookings: 45, sales: 125000 },
    { month: 'Feb', bookings: 52, sales: 142000 },
    { month: 'Mar', bookings: 38, sales: 98000 },
    { month: 'Apr', bookings: 61, sales: 167000 },
    { month: 'May', bookings: 49, sales: 134000 },
    { month: 'Jun', bookings: 55, sales: 151000 }
  ];

  const recentBookings = [
    {
      id: 1,
      passenger: "Ahmed Hassan",
      destination: "Dubai",
      amount: 45000,
      date: "2025-01-20",
      status: "confirmed"
    },
    {
      id: 2,
      passenger: "Fatima Khan",
      destination: "Riyadh",
      amount: 38000,
      date: "2025-01-19",
      status: "confirmed"
    },
    {
      id: 3,
      passenger: "Mohammad Ali",
      destination: "Doha",
      amount: 42000,
      date: "2025-01-18",
      status: "pending"
    },
    {
      id: 4,
      passenger: "Rashida Begum",
      destination: "Kuwait",
      amount: 35000,
      date: "2025-01-17",
      status: "confirmed"
    }
  ];

  const getStatusColor = (status) => {
    return status === 'confirmed' ?'bg-success text-success-foreground' :'bg-warning text-warning-foreground';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} color="var(--color-muted-foreground)" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-xl text-foreground">
                    {agent.name} - Performance Report
                  </h2>
                  <p className="text-sm text-muted-foreground font-caption">
                    {agent.role} • Joined {agent.joinDate}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-6">
              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Ticket" size={20} color="var(--color-primary)" />
                    <span className="text-sm font-medium text-muted-foreground font-caption">
                      Total Bookings
                    </span>
                  </div>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    {agent.totalBookings}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="DollarSign" size={20} color="var(--color-success)" />
                    <span className="text-sm font-medium text-muted-foreground font-caption">
                      Total Sales
                    </span>
                  </div>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    ৳{agent.salesAmount.toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
                    <span className="text-sm font-medium text-muted-foreground font-caption">
                      Avg. Per Booking
                    </span>
                  </div>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    ৳{Math.round(agent.salesAmount / Math.max(agent.totalBookings, 1)).toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Star" size={20} color="var(--color-warning)" />
                    <span className="text-sm font-medium text-muted-foreground font-caption">
                      Performance
                    </span>
                  </div>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    Excellent
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                    Monthly Bookings
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="var(--color-primary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                    Monthly Sales (৳)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="var(--color-success)" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Recent Bookings
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-heading font-semibold text-sm text-foreground">
                          Passenger
                        </th>
                        <th className="text-left py-2 font-heading font-semibold text-sm text-foreground">
                          Destination
                        </th>
                        <th className="text-left py-2 font-heading font-semibold text-sm text-foreground">
                          Amount
                        </th>
                        <th className="text-left py-2 font-heading font-semibold text-sm text-foreground">
                          Date
                        </th>
                        <th className="text-left py-2 font-heading font-semibold text-sm text-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-border">
                          <td className="py-3 text-sm text-foreground font-caption">
                            {booking.passenger}
                          </td>
                          <td className="py-3 text-sm text-foreground font-caption">
                            {booking.destination}
                          </td>
                          <td className="py-3 text-sm font-medium text-foreground">
                            ৳{booking.amount.toLocaleString()}
                          </td>
                          <td className="py-3 text-sm text-foreground font-caption">
                            {new Date(booking.date).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceModal;