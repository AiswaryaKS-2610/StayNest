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
import Verification from './features/broker/pages/Verification';
import Moderation from './features/admin/pages/Moderation';

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Tenant */}
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/tenant/favorites" element={<Favorites />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* Chat */}
        <Route path="/messages" element={<Inbox />} />
        <Route path="/messages/:id" element={<ChatWindow />} />

        {/* Broker */}
        <Route path="/broker/dashboard" element={<MyListings />} />
        <Route path="/broker/new-listing" element={<NewListing />} />
        <Route path="/broker/verification" element={<Verification />} />

        {/* Admin */}
        <Route path="/admin" element={<Moderation />} />
      </Routes>
    </div>
  );
}

export default App;
