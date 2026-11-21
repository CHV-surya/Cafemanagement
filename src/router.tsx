import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout, AdminLayout, StaffLayout } from '@/layouts'
import { ProtectedRoute } from '@/components/common'
import {
  HomePage,
  MenuPage,
  BookTablePage,
  AboutPage,
  StaffPortalPage,
  StaffLoginPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminBillingPage,
  AdminReservationsPage,
  AdminTablesPage,
  WaiterDashboardPage,
  WaiterOrdersPage,
  WaiterBillingPage,
  WaiterTablesPage,
  KitchenDashboardPage,
  PlaceholderPage,
  NotFoundPage,
} from '@/pages'

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'book-table', element: <BookTablePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },

  // Authentication & Staff Portal
  {
    path: '/staff',
    element: <StaffPortalPage />,
  },
  {
    path: '/staff/login',
    element: <StaffLoginPage />,
  },

  // Protected Admin Management Workspace
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'tables', element: <AdminTablesPage /> },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
      },
      { path: 'reservations', element: <AdminReservationsPage /> },
      {
        path: 'menu',
        element: (
          <PlaceholderPage
            moduleName="Menu & Recipe Catalog"
            description="Price updates, seasonal dish creation, modifiers, and inventory linking."
            backLink="/admin/dashboard"
          />
        ),
      },
      {
        path: 'billing',
        element: <AdminBillingPage />,
      },
      {
        path: 'analytics',
        element: (
          <PlaceholderPage
            moduleName="Analytics & Sales Reports"
            description="Revenue trends, hourly covers, top-selling dishes, and staff tip distribution."
            backLink="/admin/dashboard"
          />
        ),
      },
      {
        path: 'staff',
        element: (
          <PlaceholderPage
            moduleName="Staff Management"
            description="Employee rosters, shift schedules, role permissions, and performance monitoring."
            backLink="/admin/dashboard"
          />
        ),
      },
      {
        path: 'settings',
        element: (
          <PlaceholderPage
            moduleName="Restaurant Settings"
            description="Restaurant branding, tax configurations, currency formatting, and operating hours."
            backLink="/admin/dashboard"
          />
        ),
      },
    ],
  },

  // Protected Waiter Service Workspace
  {
    path: '/waiter',
    element: (
      <ProtectedRoute allowedRoles={['waiter']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/waiter/dashboard" replace /> },
      { path: 'dashboard', element: <WaiterDashboardPage /> },
      { path: 'tables', element: <WaiterTablesPage /> },
      {
        path: 'orders',
        element: <WaiterOrdersPage />,
      },
      {
        path: 'billing',
        element: <WaiterBillingPage />,
      },
      {
        path: 'ready-orders',
        element: (
          <PlaceholderPage
            moduleName="Ready for Service"
            description="Expeditor pass pickup queue."
            backLink="/waiter/dashboard"
          />
        ),
      },
      {
        path: 'menu',
        element: (
          <PlaceholderPage
            moduleName="Quick Menu Lookup"
            description="Ingredient allergens and 86-ed item lookup for floor staff."
            backLink="/waiter/dashboard"
          />
        ),
      },
    ],
  },

  // Protected Kitchen Workspace (Reusing StaffLayout as requested)
  {
    path: '/kitchen',
    element: (
      <ProtectedRoute allowedRoles={['kitchen']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/kitchen/dashboard" replace /> },
      { path: 'dashboard', element: <KitchenDashboardPage /> },
      {
        path: 'tickets',
        element: (
          <PlaceholderPage
            moduleName="Active KDS Tickets"
            description="High-density ticket display for expeditor station."
            backLink="/kitchen/dashboard"
          />
        ),
      },
      {
        path: 'cold-station',
        element: (
          <PlaceholderPage
            moduleName="Appetizer & Cold Station"
            description="Garde manger station line view."
            backLink="/kitchen/dashboard"
          />
        ),
      },
      {
        path: 'hot-station',
        element: (
          <PlaceholderPage
            moduleName="Grill & Hot Line"
            description="Sauté and grill cook station line view."
            backLink="/kitchen/dashboard"
          />
        ),
      },
      {
        path: 'history',
        element: (
          <PlaceholderPage
            moduleName="Completed Tickets History"
            description="Daily log of completed orders and prep turnaround times."
            backLink="/kitchen/dashboard"
          />
        ),
      },
    ],
  },

  // Fallback 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
