import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';


const Profile = lazy(() => import('./features/auth/pages/Profile'));
const TenantDashboard = lazy(() => import('./features/tenant/pages/Dashboard'));
const PropertyDetails = lazy(() => import('./features/tenant/pages/PropertyDetails'));
const Favorites = lazy(() => import('./features/tenant/pages/Favorites'));


const MyListings = lazy(() => import('./features/broker/pages/MyListings'));
const NewListing = lazy(() => import('./features/broker/pages/NewListing'));
const EditListing = lazy(() => import('./features/broker/pages/EditListing'));
const Verification = lazy(() => import('./features/broker/pages/Verification'));
const BrokerLayout = lazy(() => import('./features/broker/components/BrokerLayout'));


const AdminDashboard = lazy(() => import('./features/admin/pages/AdminDashboard'));
const AdminListingReview = lazy(() => import('./features/admin/pages/AdminListingReview'));
const AdminBrokerManagement = lazy(() => import('./features/admin/pages/AdminBrokerManagement'));
const AdminVerifications = lazy(() => import('./features/admin/pages/AdminVerifications'));
const AdminLayout = lazy(() => import('./features/admin/components/AdminLayout'));


const Inbox = lazy(() => import('./features/chat/pages/Inbox'));
const ChatWindow = lazy(() => import('./features/chat/pages/ChatWindow'));
const Notifications = lazy(() => import('./features/notifications/pages/Notifications'));
const ChatbotWidget = lazy(() => import('./features/ai/components/ChatbotWidget'));


const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#2563EB' }}>
    <div className="spinner"></div>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Suspense fallback={<PageLoader />}>
        <ChatbotWidget />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {}
          <Route path="/profile" element={<Profile />} />

          <Route path="/notifications" element={<Notifications />} />

          {}
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/tenant/favorites" element={<Favorites />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          {}
          <Route path="/messages" element={<Inbox />} />
          <Route path="/messages/:id" element={<ChatWindow />} />

          {}
          <Route path="/broker/dashboard" element={<BrokerLayout><MyListings /></BrokerLayout>} />
          <Route path="/broker/new-listing" element={<BrokerLayout><NewListing /></BrokerLayout>} />
          <Route path="/broker/edit-listing/:id" element={<BrokerLayout><EditListing /></BrokerLayout>} />
          <Route path="/broker/verification" element={<BrokerLayout><Verification /></BrokerLayout>} />
          <Route path="/broker/messages" element={<BrokerLayout><Inbox /></BrokerLayout>} />
          <Route path="/broker/messages/:id" element={<BrokerLayout><ChatWindow /></BrokerLayout>} />
          <Route path="/broker/profile" element={<BrokerLayout><Profile /></BrokerLayout>} />

          {}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/listings" element={<AdminLayout><AdminListingReview /></AdminLayout>} />
          <Route path="/admin/brokers" element={<AdminLayout><AdminBrokerManagement /></AdminLayout>} />
          <Route path="/admin/verifications" element={<AdminLayout><AdminVerifications /></AdminLayout>} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
