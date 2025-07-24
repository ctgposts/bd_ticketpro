import React, { useState, useMemo } from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const TicketTable = ({ tickets, userRole, onBookTicket, onViewDetails }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId, checked) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: 'bg-success text-success-foreground', label: 'Available' },
      locked: { color: 'bg-warning text-warning-foreground', label: 'Locked' },
      sold: { color: 'bg-error text-error-foreground', label: 'Sold Out' }
    };

    const config = statusConfig[status] || statusConfig.available;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateFormatted = date.toLocaleDateString('en-GB');
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    return { day, date: dateFormatted, time };
  };

  const sortedTickets = React.useMemo(() => {
    if (!sortConfig.key) return tickets;

    return [...tickets].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'departureDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [tickets, sortConfig]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={16} color="var(--color-muted-foreground)" />;
    }
    return (
      <Icon 
        name={sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={16} 
        color="var(--color-primary)" 
      />
    );
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedTickets.length === tickets.length && tickets.length > 0}
              indeterminate={selectedTickets.length > 0 && selectedTickets.length < tickets.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Available Tickets ({tickets.length})
            </h3>
          </div>
          
          {selectedTickets.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground font-caption">
                {selectedTickets.length} selected
              </span>
              <Button variant="outline" size="sm" iconName="Download">
                Export Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption">
                  Select
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('serialNumber')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption hover:text-foreground"
                >
                  <span>S/N</span>
                  <SortIcon column="serialNumber" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('airline')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption hover:text-foreground"
                >
                  <span>Airline</span>
                  <SortIcon column="airline" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('departureDate')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption hover:text-foreground"
                >
                  <span>Departure</span>
                  <SortIcon column="departureDate" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('sellingPrice')}
                  className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption hover:text-foreground"
                >
                  <span>Selling Price</span>
                  <SortIcon column="sellingPrice" />
                </button>
              </th>
              {userRole === 'admin' && (
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('buyingPrice')}
                    className="flex items-center space-x-1 text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption hover:text-foreground"
                  >
                    <span>Buying Price</span>
                    <SortIcon column="buyingPrice" />
                  </button>
                </th>
              )}
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption">
                  Status
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-caption">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTickets.map((ticket) => {
              const dateInfo = formatDate(ticket.departureDate);
              const isSelected = selectedTickets.includes(ticket.id);
              
              return (
                <tr 
                  key={ticket.id}
                  className={`hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleSelectTicket(ticket.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground font-data">
                      {ticket.serialNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={ticket.airlineLogo}
                          alt={`${ticket.airline} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {ticket.airline}
                        </div>
                        <div className="text-xs text-muted-foreground font-caption">
                          {ticket.flightNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {dateInfo.date}
                      </div>
                      <div className="text-xs text-muted-foreground font-caption">
                        {dateInfo.day} • {dateInfo.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground font-data">
                      {formatPrice(ticket.sellingPrice)}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-muted-foreground font-data">
                        {formatPrice(ticket.buyingPrice)}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(ticket)}
                        iconName="Eye"
                        iconPosition="left"
                      >
                        View
                      </Button>
                      {ticket.status === 'available' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onBookTicket(ticket)}
                          iconName="Ticket"
                          iconPosition="left"
                        >
                          Book
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Icon name="Ticket" size={48} color="var(--color-muted-foreground)" />
          <h3 className="mt-4 text-lg font-heading font-semibold text-foreground">
            No tickets found
          </h3>
          <p className="mt-2 text-muted-foreground font-caption">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketTable;