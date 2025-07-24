import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import QuickActions from './components/QuickActions';
import CountryTicketSummary from './components/CountryTicketSummary';
import RecentActivity from './components/RecentActivity';
import SearchBookings from '../../components/SearchBookings';
import CommissionTracker from '../../components/CommissionTracker';
import bookingService from '../../utils/bookingService';

import backupService from '../../utils/backupService';

const Dashboard = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Load dashboard metrics
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userProfile) return;

      try {
        setLoading(true);
        
        // Load bookings data
        const bookingsResult = await bookingService.getBookings({
          agentId: userProfile.role === 'staff' ? userProfile.id : null
        });

        if (bookingsResult.success) {
          const bookings = bookingsResult.data;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Calculate metrics
          const todaysBookings = bookings.filter(booking => 
            new Date(booking.created_at) >= today
          );

          const confirmedBookings = bookings.filter(booking => 
            booking.booking_status === 'confirmed'
          );

          const todaysAmount = todaysBookings.reduce((sum, booking) => 
            sum + (booking.total_amount || 0), 0
          );

          const lockedTickets = bookings.filter(booking => 
            booking.booking_status === 'pending'
          ).length;

          setDashboardMetrics({
            totalSales: todaysBookings.length,
            totalAmount: todaysAmount,
            newBookings: todaysBookings.filter(b => b.booking_status === 'pending').length,
            lockedTickets: lockedTickets,
            totalBookings: bookings.length,
            confirmedBookings: confirmedBookings.length
          });
        }

        // Trigger automatic backup (daily)
        if (userProfile.role === 'admin') {
          backupService.scheduleAutomaticBackup().then(result => {
            if (result.success) {
              console.log('Automatic backup completed successfully');
            }
          });
        }

      } catch (error) {
        console.log('Dashboard loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userProfile]);

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Show preview mode for unauthenticated users (development mode)
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-warning">Preview Mode</h2>
            <p className="text-sm text-muted-foreground">
              Please sign in to access the full dashboard functionality.
            </p>
          </div>
          {/* Mock dashboard content for preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Today's Sales" value={25} icon="TrendingUp" color="primary" />
            <MetricCard title="Total Amount" value={120000} currency="৳" icon="DollarSign" color="success" />
            <MetricCard title="New Bookings" value={8} icon="Ticket" color="accent" />
            <MetricCard title="Locked Tickets" value={3} icon="Lock" color="warning" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isExpanded={sidebarExpanded}
        onToggle={handleSidebarToggle}
        userRole={userProfile?.role || 'staff'}
      />
      
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'lg:ml-280' : 'lg:ml-16'}`}>
        <Header 
          onSidebarToggle={handleSidebarToggle}
          title="Dashboard"
        />
        
        <main className="p-6">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-semibold text-foreground">
                  Welcome back, {userProfile?.full_name}!
                </h1>
                <p className="text-muted-foreground font-caption mt-1">
                  Here's what's happening with your travel agency today
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-caption">
                  {currentTime.toLocaleDateString('en-BD', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-lg font-heading font-medium text-foreground">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Metrics Cards */}
          {dashboardMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Today's Sales"
                value={dashboardMetrics.totalSales}
                icon="TrendingUp"
                color="primary"
                trend="up"
                trendValue="+12%"
                delay={0.1}
              />
              <MetricCard
                title="Total Amount"
                value={dashboardMetrics.totalAmount}
                currency="৳"
                icon="DollarSign"
                color="success"
                trend="up"
                trendValue="+8%"
                delay={0.2}
              />
              <MetricCard
                title="New Bookings"
                value={dashboardMetrics.newBookings}
                icon="Ticket"
                color="accent"
                trend="up"
                trendValue="+5"
                delay={0.3}
              />
              <MetricCard
                title="Locked Tickets"
                value={dashboardMetrics.lockedTickets}
                icon="Lock"
                color="warning"
                trend="neutral"
                trendValue="0"
                delay={0.4}
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            
            {/* Quick Actions - Takes 1 column */}
            <div>
              <QuickActions userRole={userProfile?.role || 'staff'} />
            </div>
          </div>

          {/* Search Bookings Section */}
          <div className="mb-8">
            <SearchBookings />
          </div>

          {/* Commission Tracker */}
          <div className="mb-8">
            <CommissionTracker />
          </div>

          {/* Country Summary and Recent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CountryTicketSummary />
            <RecentActivity userRole={userProfile?.role || 'staff'} />
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-8 pt-6 border-t border-border"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground font-caption">
              <div className="flex items-center space-x-4">
                <span>BD TicketPro v2.1.0</span>
                <span>•</span>
                <span>Last sync: {currentTime.toLocaleTimeString()}</span>
                <span>•</span>
                <span>Role: {userProfile?.role?.toUpperCase()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>System Online</span>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;