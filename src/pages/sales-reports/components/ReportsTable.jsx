import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportsTable = ({ data, userRole, onSort, sortConfig }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = [
    { key: 'bookingDate', label: 'Booking Date', sortable: true },
    { key: 'passengerName', label: 'Passenger Name', sortable: true },
    { key: 'destination', label: 'Destination', sortable: true },
    { key: 'airline', label: 'Airline', sortable: true },
    { key: 'ticketPrice', label: 'Ticket Price', sortable: true },
    { key: 'buyingPrice', label: 'Buying Price', sortable: true, adminOnly: true },
    { key: 'profit', label: 'Profit', sortable: true, adminOnly: true },
    { key: 'agentName', label: 'Agent', sortable: true },
    { key: 'paymentStatus', label: 'Payment', sortable: true },
    { key: 'bookingStatus', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const visibleColumns = columns.filter(col => 
    !col.adminOnly || userRole === 'admin'
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sold: { color: 'bg-success text-success-foreground', label: 'Sold' },
      booked: { color: 'bg-primary text-primary-foreground', label: 'Booked' },
      locked: { color: 'bg-warning text-warning-foreground', label: 'Locked' },
      cancelled: { color: 'bg-destructive text-destructive-foreground', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.booked;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const paymentConfig = {
      paid: { color: 'bg-success text-success-foreground', label: 'Paid' },
      partial: { color: 'bg-warning text-warning-foreground', label: 'Partial' },
      pending: { color: 'bg-muted text-muted-foreground', label: 'Pending' }
    };

    const config = paymentConfig[status] || paymentConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Sales Transactions
        </h3>
        <p className="text-sm text-muted-foreground font-caption mt-1">
          {data.length} total transactions found
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-foreground transition-colors"
                    >
                      <span>{column.label}</span>
                      <Icon 
                        name={
                          sortConfig?.key === column.key 
                            ? sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' :'ChevronsUpDown'
                        } 
                        size={14} 
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((row, index) => (
              <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Date(row.bookingDate).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {row.passengerName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {row.passportNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={row.countryFlag} 
                      alt={row.destination}
                      className="w-5 h-4 object-cover rounded"
                    />
                    <span className="text-sm text-foreground">{row.destination}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {row.airline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  ৳{row.ticketPrice.toLocaleString()}
                </td>
                {userRole === 'admin' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      ৳{row.buyingPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                      ৳{(row.ticketPrice - row.buyingPrice).toLocaleString()}
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {row.agentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPaymentBadge(row.paymentStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(row.bookingStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => {/* View details */}}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={() => {/* Download ticket */}}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-caption">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              iconName="ChevronLeft"
            />
            <span className="text-sm text-foreground font-caption">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              iconName="ChevronRight"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTable;