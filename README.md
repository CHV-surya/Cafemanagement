# BistroHub — Restaurant Management & Dining Platform

BistroHub is a luxury restaurant SaaS platform integrating a public fine-dining guest portal with operational back-of-house staff workspaces: Admin Operations Hub, Waiter Floor POS, and Centralized Billing & Invoicing.

---

## 1. Project Overview

BistroHub combines a customer-facing table booking and menu browsing experience with operational restaurant management tools:
- **Public Guest Experience**: Dynamic seasonal menu lookup, interactive visual restaurant floor plan with round and rectangular tables, chair arrangements, real-time availability conflict detection, and instant booking vouchers.
- **Admin Management Hub**: Operational dashboards, 5 KPI stat cards, Recharts sales analytics, recent orders tracking, live table occupancy, reservations management, waiter zoning management, and financial billing reports.
- **Waiter Service POS Workspace**: Shift-isolated assigned tables, dine-in and takeaway/delivery order creation with captured historical pricing, order progress tracking, table bills generation, and payment settlement.
- **Centralized Billing & Payments**: Configurable GST calculations (split into 50% CGST and 50% SGST), percentage and flat discounts, Cash (with change calculator), UPI, and Card collections, partial payment tracking, audit-backed refunds, and standard printable A4 invoices.

---

## 2. Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (Data APIs with Protected Routes)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with LocalStorage persistence
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Code Quality**: [Oxlint](https://oxc.rs/)

---

## 3. Demo Login Credentials

Access the internal staff terminals via the **Staff Portal** (`/staff`) or direct login (`/staff/login`):

| Role | Username | Password | Full Name | Workspace Route | Assigned Stations / Duties |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Laurent Moreau | `/admin/dashboard` | All modules, revenue, reservations, tables, billing, refunds |
| **Waiter 1** | `waiter1` | `waiter123` | Sophie Dubois | `/waiter/dashboard` | Main Dining & Window Promenade (Tables T01 - T05) |
| **Waiter 2** | `waiter2` | `waiter123` | Aarav Sharma | `/waiter/dashboard` | Garden Terrace & Patio Veranda (Tables T06 - T10) |
| **Waiter 3** | `waiter3` | `waiter123` | Priya Patel | `/waiter/dashboard` | Royal Banquet & Private Pavilion (Tables T11 - T15) |
| **Kitchen** | `kitchen` | `kitchen123` | Chef Antoine Mercer | `/kitchen/dashboard` | *KDS is excluded in V1 demonstration scope* |

---

## 4. Implemented Modules & Routes

### Public Guest Facing
- `/` — Homepage with brand story, dish highlights, chef introduction, and dining reviews.
- `/menu` — Categorized seasonal menu (Appetizers, Mains, Desserts, Beverages) with dietary tags.
- `/book-table` — Interactive visual restaurant floor plan, live availability by date/time/guests, table selection, and booking voucher.
- `/about` — Restaurant heritage, culinary team, and fine-dining philosophy.

### Staff Authentication
- `/staff` — Multi-role station selector with quick access to Admin, Waiter, and Kitchen portals.
- `/staff/login` — Role-based staff authentication with credential validation.

### Admin Operations Workspace (Protected: Admin only)
- `/admin/dashboard` — Overview KPI stat cards, Recharts sales analytics, recent orders table, reservations overview, and quick floor status.
- `/admin/orders` — All restaurant orders across Dine-in, Takeaway, and Delivery with status progression and filtering.
- `/admin/reservations` — Full reservations management: seat parties, cancel bookings (immediately frees tables), filter, and create direct bookings.
- `/admin/tables` — Live 15-table floor overview, live occupancy, assigned waiter tracking, and dynamic waiter reassignment.
- `/admin/billing` — Financial dashboard (collections, pending receivables, refunds), transactions table, GST tax configuration, and refund audits.

### Waiter Service POS Workspace (Protected: Waiter only)
- `/waiter/dashboard` — Shift overview, assigned tables breakdown, active orders queue, and shift revenue.
- `/waiter/tables` — Assigned table stations with live occupancy and fast order creation.
- `/waiter/orders` — Orders filtered strictly to the logged-in waiter's tables and customers.
- `/waiter/billing` — Shift collection station to generate bills, record Cash/UPI/Card payments, and print invoices.

---

## 5. Getting Started & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
# Clone repository
git clone <repository-url>
cd Bistro

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Production Build & Linting
```bash
# Type check and build
npm run build

# Run linter
npm run lint

# Preview production build locally
npm run preview
```

---

## 6. Vercel Deployment

This application is fully configured for deployment on [Vercel](https://vercel.com/):

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project in Vercel.
3. Select framework preset: **Vite**.
4. Root Directory: `./`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. SPA client-side routing is handled via `vercel.json` (`rewrites` to `/index.html`).

---

## 7. Prototype Architecture & Limitations

- **Browser-Specific LocalStorage**: In this demonstration client prototype, application state (orders, reservations, invoices, table assignments, and auth tokens) is stored in browser `localStorage`. Data does not synchronize across different physical devices or incognito sessions.
- **Frontend Role Protection**: Role-based access control is enforced via React Router client-side `ProtectedRoute` guards and Zustand state. This is appropriate for interactive client demonstration and user-testing.
- **Excluded Modules**: Kitchen Display System (KDS) and physical payment gateways (Razorpay/Stripe) are intentionally excluded from this prototype phase. Payments are recorded manually (Cash with change calculator, UPI transaction reference, Card terminal approval code).
