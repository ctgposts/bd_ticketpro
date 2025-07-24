import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterSection from './components/FilterSection';
import SummaryCards from './components/SummaryCards';
import SalesChart from './components/SalesChart';
import ReportsTable from './components/ReportsTable';
import ExportModal from './components/ExportModal';

const SalesReports = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [userRole, setUserRole] = useState('admin'); // admin, manager, staff
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'bookingDate', direction: 'desc' });
  
  const [filters, setFilters] = useState({
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    country: 'all',
    airline: 'all',
    staff: 'all',
    status: 'all',
    quickFilter: 'today'
  });

  // Mock summary data
  const summaryData = {
    totalSales: 1250000,
    salesChange: 12.5,
    ticketsSold: 342,
    ticketsChange: 8.3,
    commission: 125000,
    commissionChange: 15.2,
    pendingPayments: 85000,
    pendingChange: -5.1
  };

  // Mock transaction data
  const transactionData = [
    {
      id: 1,
      bookingDate: '2025-01-21',
      passengerName: 'Ahmed Hassan',
      passportNumber: 'BD1234567',
      destination: 'Riyadh, Saudi Arabia',
      countryFlag: 'https://flagcdn.com/w40/sa.png',
      airline: 'Saudia',
      ticketPrice: 45000,
      buyingPrice: 38000,
      agentName: 'John Doe',
      paymentStatus: 'paid',
      bookingStatus: 'sold'
    },
    {
      id: 2,
      bookingDate: '2025-01-21',
      passengerName: 'Fatima Rahman',
      passportNumber: 'BD2345678',
      destination: 'Dubai, UAE',
      countryFlag: 'https://flagcdn.com/w40/ae.png',
      airline: 'Emirates',
      ticketPrice: 52000,
      buyingPrice: 44000,
      agentName: 'Sarah Ahmed',
      paymentStatus: 'partial',
      bookingStatus: 'booked'
    },
    {
      id: 3,
      bookingDate: '2025-01-20',
      passengerName: 'Mohammad Ali',
      passportNumber: 'BD3456789',
      destination: 'Doha, Qatar',
      countryFlag: 'https://flagcdn.com/w40/qa.png',
      airline: 'Qatar Airways',
      ticketPrice: 48000,
      buyingPrice: 41000,
      agentName: 'Michael Rahman',
      paymentStatus: 'pending',
      bookingStatus: 'locked'
    },
    {
      id: 4,
      bookingDate: '2025-01-20',
      passengerName: 'Rashida Begum',
      passportNumber: 'BD4567890',
      destination: 'Abu Dhabi, UAE',
      countryFlag: 'https://flagcdn.com/w40/ae.png',
      airline: 'Etihad Airways',
      ticketPrice: 49000,
      buyingPrice: 42000,
      agentName: 'Fatima Khan',
      paymentStatus: 'paid',
      bookingStatus: 'sold'
    },
    {
      id: 5,
      bookingDate: '2025-01-19',
      passengerName: 'Karim Sheikh',
      passportNumber: 'BD5678901',
      destination: 'Kuwait City, Kuwait',
      countryFlag: 'https://flagcdn.com/w40/kw.png',
      airline: 'Kuwait Airways',
      ticketPrice: 43000,
      buyingPrice: 37000,
      agentName: 'John Doe',
      paymentStatus: 'paid',
      bookingStatus: 'sold'
    },
    {
      id: 6,
      bookingDate: '2025-01-19',
      passengerName: 'Nasir Ahmed',
      passportNumber: 'BD6789012',
      destination: 'Muscat, Oman',
      countryFlag: 'https://flagcdn.com/w40/om.png',
      airline: 'Oman Air',
      ticketPrice: 46000,
      buyingPrice: 39000,
      agentName: 'Sarah Ahmed',
      paymentStatus: 'partial',
      bookingStatus: 'booked'
    },
    {
      id: 7,
      bookingDate: '2025-01-18',
      passengerName: 'Salma Khatun',
      passportNumber: 'BD7890123',
      destination: 'Manama, Bahrain',
      countryFlag: 'https://flagcdn.com/w40/bh.png',
      airline: 'Gulf Air',
      ticketPrice: 44000,
      buyingPrice: 38000,
      agentName: 'Michael Rahman',
      paymentStatus: 'paid',
      bookingStatus: 'sold'
    },
    {
      id: 8,
      bookingDate: '2025-01-18',
      passengerName: 'Ibrahim Hossain',
      passportNumber: 'BD8901234',
      destination: 'Jeddah, Saudi Arabia',
      countryFlag: 'https://flagcdn.com/w40/sa.png',
      airline: 'Flynas',
      ticketPrice: 47000,
      buyingPrice: 40000,
      agentName: 'Fatima Khan',
      paymentStatus: 'pending',
      bookingStatus: 'locked'
    }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      country: 'all',
      airline: 'all',
      staff: 'all',
      status: 'all',
      quickFilter: 'today'
    });
  };

  const handleExport = (format) => {
    if (format === 'modal') {
      setExportModalOpen(true);
    } else {
      // Handle direct export
      console.log(`Exporting as ${format}...`);
      // Implement actual export logic here
    }
  };

  const handleExportWithConfig = (config) => {
    console.log('Exporting with config:', config);
    // Implement actual export logic with configuration
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Check authentication and role
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') || 'staff';
    
    if (!token) {
      navigate('/login-screen');
      return;
    }
    
    setUserRole(role);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar 
        isExpanded={sidebarExpanded} 
        onToggle={handleSidebarToggle}
        userRole={userRole}
      />
      
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'lg:ml-280' : 'lg:ml-16'}`}>
        <Header 
          onSidebarToggle={handleSidebarToggle}
          title="Sales Reports"
        />
        
        <main className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="font-heading font-semibold text-2xl text-foreground mb-2">
              Sales Reports & Analytics
            </h1>
            <p className="text-muted-foreground font-caption">
              Comprehensive sales performance tracking and financial oversight for travel agency operations
            </p>
          </div>

          {/* Filter Section */}
          <FilterSection
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={() => handleExport('modal')}
            onReset={handleFiltersReset}
          />

          {/* Summary Cards */}
          <SummaryCards 
            summaryData={summaryData}
            userRole={userRole}
          />

          {/* Sales Chart */}
          <SalesChart 
            data={transactionData}
            userRole={userRole}
          />

          {/* Reports Table */}
          <ReportsTable
            data={transactionData}
            userRole={userRole}
            onSort={handleSort}
            sortConfig={sortConfig}
          />

          {/* Export Modal */}
          <ExportModal
            isOpen={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
            onExport={handleExportWithConfig}
          />
        </main>
      </div>
    </div>
  );
};

export default SalesReports;