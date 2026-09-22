import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import BirthdayPage from '../pages/public/BirthdayPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from '../pages/admin/DashboardPage';
import BirthdayListPage from '../pages/admin/BirthdayListPage';
import CreateBirthdayPage from '../pages/admin/CreateBirthdayPage';
import EditBirthdayPage from '../pages/admin/EditBirthdayPage';
import GalleryPage from '../pages/admin/GalleryPage';
import MemoriesPage from '../pages/admin/MemoriesPage';
import WishesPage from '../pages/admin/WishesPage';
import ThemesPage from '../pages/admin/ThemesPage';
import SettingsPage from '../pages/admin/SettingsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/birthday/:slug" element={<BirthdayPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/register" element={<RegisterPage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="birthdays" element={<BirthdayListPage />} />
          <Route path="birthdays/create" element={<CreateBirthdayPage />} />
          <Route path="birthdays/:id/edit" element={<EditBirthdayPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="memories" element={<MemoriesPage />} />
          <Route path="wishes" element={<WishesPage />} />
          <Route path="themes" element={<ThemesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Root Redirect to default Kavita birthday page */}
        <Route path="/" element={<Navigate to="/birthday/kavita-special" replace />} />
        <Route path="*" element={<Navigate to="/birthday/kavita-special" replace />} />
      </Routes>
    </Router>
  );
}
