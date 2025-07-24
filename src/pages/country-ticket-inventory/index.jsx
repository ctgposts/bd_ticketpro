import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CountryHeader from './components/CountryHeader';
import FilterPanel from './components/FilterPanel';
import TicketTable from './components/TicketTable';
import BookingSummary from './components/BookingSummary';
import TicketDetailsModal from './components/TicketDetailsModal';
import BookingModal from './components/BookingModal';

const CountryTicketInventory = () => {
  const [searchParams] = useSearchParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});

  // Get country from URL params or default to UAE
  const countryCode = searchParams.get('country') || 'ae';
  
  // Mock user role - in real app, this would come from auth context
  const userRole = 'admin'; // admin, manager, staff

  // Mock country data
  const countryData = {
    ae: {
      name: 'United Arab Emirates',
      code: 'AE',
      flagUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100&h=75&fit=crop',
      totalTickets: 156,
      availableTickets: 89,
      lockedTickets: 23,
      soldTickets: 44
    },
    sa: {
      name: 'Saudi Arabia',
      code: 'SA',
      flagUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=75&fit=crop',
      totalTickets: 203,
      availableTickets: 127,
      lockedTickets: 31,
      soldTickets: 45
    },
    qa: {
      name: 'Qatar',
      code: 'QA',
      flagUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=100&h=75&fit=crop',
      totalTickets: 98,
      availableTickets: 54,
      lockedTickets: 18,
      soldTickets: 26
    }
  };

  const currentCountry = countryData[countryCode] || countryData.ae;

  // Mock airlines data
  const airlines = [
    { code: 'EK', name: 'Emirates' },
    { code: 'EY', name: 'Etihad Airways' },
    { code: 'FZ', name: 'flydubai' },
    { code: 'SV', name: 'Saudi Arabian Airlines' },
    { code: 'QR', name: 'Qatar Airways' },
    { code: 'BG', name: 'Biman Bangladesh Airlines' }
  ];

  // Mock tickets data
  const mockTickets = [
    {
      id: 1,
      serialNumber: 'TK001',
      airline: 'Emirates',
      flightNumber: 'EK-585',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&h=50&fit=crop',
      departureDate: '2025-01-25T14:30:00Z',
      sellingPrice: 85000,
      buyingPrice: 78000,
      status: 'available',
      route: 'Dhaka → Dubai',
      aircraftType: 'Boeing 777-300ER'
    },
    {
      id: 2,
      serialNumber: 'TK002',
      airline: 'Qatar Airways',
      flightNumber: 'QR-639',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&h=50&fit=crop',
      departureDate: '2025-01-26T09:15:00Z',
      sellingPrice: 82000,
      buyingPrice: 75000,
      status: 'available',
      route: 'Dhaka → Doha',
      aircraftType: 'Airbus A350-900'
    },
    {
      id: 3,
      serialNumber: 'TK003',
      airline: 'Etihad Airways',
      flightNumber: 'EY-587',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&h=50&fit=crop',
      departureDate: '2025-01-27T16:45:00Z',
      sellingPrice: 87000,
      buyingPrice: 80000,
      status: 'locked',
      route: 'Dhaka → Abu Dhabi',
      aircraftType: 'Boeing 787-9'
    },
    {
      id: 4,
      serialNumber: 'TK004',
      airline: 'flydubai',
      flightNumber: 'FZ-571',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&h=50&fit=crop',
      departureDate: '2025-01-28T11:20:00Z',
      sellingPrice: 65000,
      buyingPrice: 58000,
      status: 'available',
      route: 'Dhaka → Dubai',
      aircraftType: 'Boeing 737 MAX 8'
    },
    {
      id: 5,
      serialNumber: 'TK005',
      airline: 'Saudi Arabian Airlines',
      flightNumber: 'SV-803',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&h=50&fit=crop',
      departureDate: '2025-01-29T13:10:00Z',
      sellingPrice: 79000,
      buyingPrice: 72000,
      status: 'sold',
      route: 'Dhaka → Riyadh',
      aircraftType: 'Airbus A320'
    }
  ];

  // Mock booking summary data
  const summaryData = {
    todayBookings: 12,
    lockedTickets: 23,
    totalRevenue: 1250000,
    pendingPayments: 8,
    recentActivity: [
      {
        action: 'New booking confirmed for Emirates EK-585',
        time: '2 minutes ago'
      },
      {
        action: 'Payment received for Qatar Airways QR-639',
        time: '15 minutes ago'
      },
      {
        action: 'Ticket locked for Etihad Airways EY-587',
        time: '1 hour ago'
      },
      {
        action: 'Booking cancelled for flydubai FZ-571',
        time: '2 hours ago'
      }
    ]
  };

  // Initialize filtered tickets
  useEffect(() => {
    setFilteredTickets(mockTickets);
  }, []);

  // Handle filters change
  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
    
    let filtered = [...mockTickets];

    // Filter by airline
    if (filters.airline) {
      filtered = filtered.filter(ticket => 
        ticket.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(ticket => 
        new Date(ticket.departureDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(ticket => 
        new Date(ticket.departureDate) <= new Date(filters.dateTo)
      );
    }

    // Filter by price range
    if (filters.priceMin) {
      filtered = filtered.filter(ticket => 
        ticket.sellingPrice >= parseInt(filters.priceMin)
      );
    }

    if (filters.priceMax) {
      filtered = filtered.filter(ticket => 
        ticket.sellingPrice <= parseInt(filters.priceMax)
      );
    }

    // Filter by departure time
    if (filters.departureTime) {
      filtered = filtered.filter(ticket => {
        const hour = new Date(ticket.departureDate).getHours();
        switch (filters.departureTime) {
          case 'morning':
            return hour >= 6 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 18;
          case 'evening':
            return hour >= 18 && hour < 24;
          case 'night':
            return hour >= 0 && hour < 6;
          default:
            return true;
        }
      });
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    setFilteredTickets(filtered);
  };

  // Handle ticket actions
  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const handleBookTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (bookingData) => {
    console.log('Booking confirmed:', bookingData);
    // In real app, this would make an API call
    
    // Update ticket status to locked
    const updatedTickets = filteredTickets.map(ticket => 
      ticket.id === bookingData.ticketId 
        ? { ...ticket, status: 'locked' }
        : ticket
    );
    setFilteredTickets(updatedTickets);
  };

  const customBreadcrumbs = [
    { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
    { label: 'Countries', path: '/dashboard', icon: 'Globe' },
    { label: currentCountry.name, path: null, icon: 'MapPin' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        userRole={userRole}
      />
      
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'lg:ml-280' : 'lg:ml-16'}`}>
        <Header 
          onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)}
          title="Country Ticket Inventory"
        />
        
        <main className="p-6">
          <Breadcrumb customItems={customBreadcrumbs} />
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              <CountryHeader country={currentCountry} />
              
              <FilterPanel 
                onFiltersChange={handleFiltersChange}
                airlines={airlines}
              />
              
              <TicketTable
                tickets={filteredTickets}
                userRole={userRole}
                onBookTicket={handleBookTicket}
                onViewDetails={handleViewDetails}
              />
            </div>
            
            {/* Sidebar */}
            <div className="xl:col-span-1">
              <BookingSummary summaryData={summaryData} />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTicket(null);
        }}
        onBookTicket={handleBookTicket}
      />

      <BookingModal
        ticket={selectedTicket}
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedTicket(null);
        }}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  );
};

export default CountryTicketInventory;