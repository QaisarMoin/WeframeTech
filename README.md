# Multi-Tenant Event Booking System

A comprehensive multi-tenant event booking backend built with **Payload CMS** and **Next.js**. This system supports multiple organizations (tenants) managing their own events, users, and bookings with complete data isolation, automatic waitlist management, real-time notifications, and an organizer dashboard.

## 🚀 Features

### Multi-Tenancy

- Complete data isolation between tenants
- Role-based access control (Admin, Organizer, Attendee)
- Tenant-specific user management

### Event Management

- Create and manage events with capacity limits
- Rich text descriptions using Lexical editor
- Date/time scheduling with timezone support

### Booking System

- Automatic booking confirmation or waitlist placement
- Smart waitlist promotion when seats become available
- Booking status tracking (confirmed, waitlisted, canceled)

### Notifications

- Real-time in-app notifications for all booking status changes
- Notification read/unread status tracking
- Automatic notification generation via hooks

### Organizer Dashboard

- Event analytics with circular progress indicators
- Booking statistics and summaries
- Recent activity feed
- Capacity utilization tracking

### Audit Trail

- Comprehensive booking logs for all actions
- Detailed tracking of status changes
- Historical data for compliance and analytics

## 🏗️ Architecture

### Collections Structure

```
├── Tenants - Organization management
├── Users - Multi-role user system (Admin, Organizer, Attendee)
├── Events - Event management with capacity controls
├── Bookings - Booking system with status management
├── Notifications - In-app notification system
└── BookingLogs - Audit trail for all booking actions
```

### API Endpoints

```
POST /api/book-event - Create new booking
POST /api/cancel-booking - Cancel existing booking
GET  /api/my-bookings - User's booking history
GET  /api/my-notifications - User's notifications
POST /api/notifications/:id/read - Mark notification as read
GET  /api/dashboard - Organizer dashboard data
```

### Hooks & Business Logic

- **beforeBookingChange**: Determines booking status based on capacity
- **afterBookingChange**: Creates notifications and logs, handles waitlist promotion
- **Access Control**: Enforces multi-tenancy and role-based permissions

## 📋 Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- MongoDB 4.4+
- pnpm 9+ (recommended) or npm

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd we-frame-tech
pnpm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URI=mongodb://localhost:27017/we-frame-tech
PAYLOAD_SECRET=your-super-secret-key-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Database Setup

Ensure MongoDB is running locally or update `DATABASE_URI` to point to your MongoDB instance.

### 4. Seed Database

```bash
pnpm run seed
```

This creates:

- 2 tenants (TechCorp Events, Creative Studios)
- 8 users (1 organizer + 3 attendees per tenant)
- 4 events with different capacities
- Sample bookings demonstrating waitlist functionality

### 5. Start Development Server

```bash
pnpm run dev
```

Access the application:

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/admin/dashboard

## 👥 Demo Credentials

### Tenant 1: TechCorp Events

- **Organizer**: john.smith@techcorp.com / password123
- **Attendees**:
  - alice.johnson@techcorp.com / password123
  - bob.wilson@techcorp.com / password123
  - carol.davis@techcorp.com / password123

### Tenant 2: Creative Studios

- **Organizer**: sarah.brown@creativestudios.com / password123
- **Attendees**:
  - mike.chen@creativestudios.com / password123
  - emma.taylor@creativestudios.com / password123
  - david.lee@creativestudios.com / password123

## 🧪 Testing the System

### Sample Workflows

1. **Booking Flow Until Full**:
   - Login as an attendee
   - Book the "Tech Conference 2024" (capacity: 3)
   - Try booking as a 4th user → should be waitlisted

2. **Waitlist Promotion**:
   - Login as organizer or admin
   - Cancel a confirmed booking
   - Check that the oldest waitlisted booking is automatically promoted

3. **Notifications**:
   - All booking status changes generate notifications
   - Check `/api/my-notifications` for real-time updates
   - Mark notifications as read via `/api/notifications/:id/read`

4. **Dashboard Analytics**:
   - Login as organizer
   - Visit `/admin/dashboard` to see:
     - Event capacity utilization (circular progress)
     - Booking statistics
     - Recent activity feed

5. **Multi-Tenancy**:
   - Login with different tenant credentials
   - Verify complete data isolation
   - Confirm cross-tenant access is blocked

## 🔧 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm seed         # Seed database with sample data
pnpm lint         # Run ESLint
pnpm test         # Run tests
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Next.js frontend pages
│   └── (payload)/
│       ├── admin/           # Custom admin pages
│       └── api/             # Custom API endpoints
├── collections/             # Payload CMS collections
├── components/              # React components
├── hooks/                   # Payload hooks for business logic
└── scripts/                 # Utility scripts (seed, etc.)
```

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
PAYLOAD_SECRET=your-production-secret-key
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📚 Key Implementation Details

### Multi-Tenancy Enforcement

- All collections include a `tenant` relationship field
- Access control functions filter by user's tenant
- Hooks automatically assign tenant to new records

### Booking Logic

- `beforeBookingChange` hook determines status based on capacity
- `afterBookingChange` hook handles notifications and waitlist promotion
- Atomic operations ensure data consistency

### Notification System

- Automatic generation via Payload hooks
- Real-time updates for booking status changes
- Read/unread status tracking

### Dashboard Analytics

- Real-time capacity calculations
- Circular progress indicators for visual feedback
- Recent activity feed from booking logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
