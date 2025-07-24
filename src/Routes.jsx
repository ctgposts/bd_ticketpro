import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginScreen from "pages/login-screen";
import Dashboard from "pages/dashboard";
import TicketBookingModal from "pages/ticket-booking-modal";
import SalesReports from "pages/sales-reports";
import AgentManagement from "pages/agent-management";
import CountryTicketInventory from "pages/country-ticket-inventory";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticket-booking-modal" element={<TicketBookingModal />} />
        <Route path="/sales-reports" element={<SalesReports />} />
        <Route path="/agent-management" element={<AgentManagement />} />
        <Route path="/country-ticket-inventory" element={<CountryTicketInventory />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;