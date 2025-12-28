import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Profile from './features/auth/pages/Profile';
import TenantDashboard from './features/tenant/pages/Dashboard';
import PropertyDetails from './features/tenant/pages/PropertyDetails';
import Favorites from './features/tenant/pages/Favorites';
import MyListings from './features/broker/pages/MyListings';
import NewListing from './features/broker/pages/NewListing';
import EditListing from './features/broker/pages/EditListing';
import Verification from './features/broker/pages/Verification';
import BrokerLayout from './features/broker/components/BrokerLayout';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AdminListingReview from './features/admin/pages/AdminListingReview';
import AdminBrokerManagement from './features/admin/pages/AdminBrokerManagement';
import AdminVerifications from './features/admin/pages/AdminVerifications';
import AdminLayout from './features/admin/components/AdminLayout';

import Inbox from './features/chat/pages/Inbox';
import ChatWindow from './features/chat/pages/ChatWindow';
import Notifications from './features/notifications/pages/Notifications';
import ChatbotWidget from './features/ai/components/ChatbotWidget';

function App() {
  return (
    <div className="app-container">
      <ChatbotWidget />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profile (Shared or Role-specific) */}
        <Route path="/profile" element={<Profile />} />

        <Route path="/notifications" element={<Notifications />} />

        {/* Tenant */}
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/tenant/favorites" element={<Favorites />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* Chat - Tenant Side */}
        <Route path="/messages" element={<Inbox />} />
        <Route path="/messages/:id" element={<ChatWindow />} />

        {/* Broker */}
        <Route path="/broker/dashboard" element={<BrokerLayout><MyListings /></BrokerLayout>} />
        <Route path="/broker/new-listing" element={<BrokerLayout><NewListing /></BrokerLayout>} />
        <Route path="/broker/edit-listing/:id" element={<BrokerLayout><EditListing /></BrokerLayout>} />
        <Route path="/broker/verification" element={<BrokerLayout><Verification /></BrokerLayout>} />
        <Route path="/broker/messages" element={<BrokerLayout><Inbox /></BrokerLayout>} />
        <Route path="/broker/messages/:id" element={<BrokerLayout><ChatWindow /></BrokerLayout>} />
        <Route path="/broker/profile" element={<BrokerLayout><Profile /></BrokerLayout>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/listings" element={<AdminLayout><AdminListingReview /></AdminLayout>} />
        <Route path="/admin/brokers" element={<AdminLayout><AdminBrokerManagement /></AdminLayout>} />
        <Route path="/admin/verifications" element={<AdminLayout><AdminVerifications /></AdminLayout>} />
      </Routes>
    </div>
  );
}

export default App;
