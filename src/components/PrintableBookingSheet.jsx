import React from 'react';
import { motion } from 'framer-motion';

const PrintableBookingSheet = ({ booking, onClose }) => {
  if (!booking) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            page-break-inside: avoid;
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>

      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-border no-print">
            <h2 className="font-heading font-semibold text-xl text-foreground">
              Print Booking Confirmation
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Printable Content */}
          <div className="print-area print-page p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">BD TicketPro</h1>
              <p className="text-lg text-muted-foreground">Booking Confirmation Sheet</p>
              <div className="w-full h-px bg-border mt-4"></div>
            </div>

            {/* Booking Reference */}
            <div className="text-center mb-8">
              <div className="inline-block bg-primary/10 border-2 border-primary rounded-lg px-6 py-3">
                <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                <p className="text-2xl font-bold text-primary">{booking.booking_reference}</p>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Passenger Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Passenger Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{booking.passenger_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passport:</span>
                    <span className="font-medium">{booking.passport_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mobile:</span>
                    <span className="font-medium">{booking.mobile_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passengers:</span>
                    <span className="font-medium">{booking.pax_count}</span>
                  </div>
                </div>
              </div>

              {/* Flight Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Flight Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Airline:</span>
                    <span className="font-medium">{booking.ticket?.airline?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flight:</span>
                    <span className="font-medium">{booking.ticket?.flight_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route:</span>
                    <span className="font-medium">
                      {booking.ticket?.departure_city || 'N/A'} → {booking.ticket?.arrival_city || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure:</span>
                    <span className="font-medium">
                      {booking.ticket?.departure_date ? 
                        new Date(booking.ticket.departure_date).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Class:</span>
                    <span className="font-medium capitalize">
                      {booking.ticket?.ticket_class || 'Economy'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                Booking Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Booking Status</p>
                  <p className="font-semibold text-lg capitalize">{booking.booking_status}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                  <p className="font-semibold text-lg capitalize">{booking.payment_status}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Booking Date</p>
                  <p className="font-semibold text-lg">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                Payment Summary
              </h3>
              <div className="bg-primary/5 rounded-lg p-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">{formatPrice(booking.total_amount || 0)}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Price per ticket:</span>
                    <span>{formatPrice((booking.total_amount || 0) / (booking.pax_count || 1))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Number of passengers:</span>
                    <span>{booking.pax_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Information */}
            {booking.agent && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                  Booked By
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agent:</span>
                    <span className="font-medium">{booking.agent.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{booking.agent.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            {booking.comments && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                  Special Notes
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-muted-foreground">{booking.comments}</p>
                </div>
              </div>
            )}

            {/* Important Notes */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                Important Information
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Please arrive at the airport at least 3 hours before international flights</p>
                <p>• Carry a valid passport and visa (if required) for international travel</p>
                <p>• Check baggage allowance and restrictions with the airline</p>
                <p>• This booking confirmation must be presented at check-in</p>
                <p>• Contact BD TicketPro for any changes or cancellations</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-6 text-center">
              <div className="mb-4">
                <p className="text-lg font-semibold text-foreground">BD TicketPro</p>
                <p className="text-sm text-muted-foreground">Your Trusted Travel Partner</p>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Contact: support@bdticketpro.com | Phone: +880 1700-000000</p>
                <p>Address: House #123, Road #456, Gulshan-2, Dhaka-1212, Bangladesh</p>
                <p className="mt-2">Printed on: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PrintableBookingSheet;