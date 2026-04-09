// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import StationSearchPage from './pages/StationSearchPage';
import StationDetailsPage from './pages/StationDetailsPage';
import SlotSelectionPage from './pages/SlotSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', background: '#0f172a' }}>
            <Navbar />
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<StationSearchPage />} />
                <Route path="/station/:id" element={<StationDetailsPage />} />

                {/* Protected routes */}
                <Route path="/station/:id/book" element={
                  <ProtectedRoute><SlotSelectionPage /></ProtectedRoute>
                } />
                <Route path="/vehicle-details" element={
                  <ProtectedRoute><VehicleDetailsPage /></ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute><CheckoutPage /></ProtectedRoute>
                } />
                <Route path="/payment-success" element={
                  <ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                  <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />

              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}
