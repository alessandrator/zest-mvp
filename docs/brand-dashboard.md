# Brand Dashboard Documentation

## Overview

The brand dashboard is a comprehensive interface for companies to manage their marketing campaigns, track performance, and handle administrative tasks within the ZEST platform.

## File Structure

```
app/dashboard/brand/
├── page.tsx                     # Main brand dashboard (server component with auth)
├── demo/
│   └── page.tsx                 # Demo version for testing without auth
└── components/dashboard/
    └── brand-dashboard-client.tsx # Client component with all UI logic
```

## Features Implemented

### 1. Authentication & Access Control
- Server-side authentication check
- Role-based access (only `brand` users)
- Automatic redirect to login for unauthorized users
- Demo mode available for testing

### 2. Header & Navigation
- ZEST logo with brand colors
- "Brand Dashboard" title using Saira Stencil One font
- Navigation menu: Campagne, Modelli, Report, Pagamenti, Profilo, Logout
- Responsive design with mobile menu support

### 3. Overview Cards
- **Campagne Attive**: Shows active campaigns count
- **Campagne Concluse**: Shows completed campaigns this month
- **Voti Ricevuti**: Total votes received with growth percentage
- **Engagement Influencer**: Average engagement rate across campaigns

### 4. Campaigns Management
- Table view of all campaigns with status indicators
- Campaign types: Social Media, Content Creation, Influencer Marketing
- Action buttons: Modifica, Visualizza, Report
- "Crea Campagna" button for creating new campaigns
- Status badges with color coding (green=active, yellow=preparing, gray=completed)

### 5. Model Upload Section
- Form for uploading marketing models/templates
- Fields: Title, Description, File upload (images/videos)
- File upload with brand-styled input
- Ready for backend integration

### 6. Reporting & Analytics
- **Bar Chart**: Votes by category (Students, Influencers, Consumers) using Chart.js
- **Doughnut Chart**: Engagement distribution (High, Medium, Low)
- Charts use brand color scheme (#fcff59, #bfbfbf, #1a1a1a)
- Responsive chart containers

### 7. Payments Management
- Payment history table with campaign association
- Payment status indicators (Pagato=green, In attesa=yellow)
- Amount display in Euro format
- Action buttons for payment details

### 8. Contracts Management
- PDF contract list with file icons
- Contract status indicators (Firmato=green, In revisione=yellow)
- Action buttons: Visualizza, Scarica
- Ready for PDF document integration

## Design System

### Colors
- **Background**: #fcff59 (brand yellow)
- **Cards**: Semi-transparent white (bg-white/90)
- **Text**: #1a1a1a (dark)
- **Accent**: #bfbfbf (light gray)
- **Status Colors**: Green (#22c55e), Yellow (#eab308), Gray (#6b7280)

### Typography
- **Titles**: Saira Stencil One font (font-stencil class)
- **Body**: Inter font (default)
- **Display**: Montserrat font for headings

### Components
- Cards with backdrop blur and transparency
- Consistent button styling
- Status badges with appropriate colors
- Responsive tables with overflow handling

## Demo Data Structure

### Campaigns
```typescript
{
  id: number,
  name: string,
  status: 'Attiva' | 'In preparazione' | 'Conclusa',
  type: string,
  startDate: string,
  endDate: string,
  statusColor: string
}
```

### Payments
```typescript
{
  id: number,
  campaign: string,
  amount: string,
  status: 'Pagato' | 'In attesa',
  date: string,
  statusColor: string
}
```

### Contracts
```typescript
{
  id: number,
  name: string,
  status: 'Firmato' | 'In revisione',
  date: string,
  statusColor: string
}
```

## Chart Configuration

### Bar Chart (Votes by Category)
- Categories: Gennaio through Giugno
- Datasets: Voti Studenti, Voti Influencer, Voti Consumatori
- Brand colors with dark borders
- Responsive and accessible

### Doughnut Chart (Engagement Distribution)
- Categories: Alta, Media, Bassa
- Percentage distribution: 45%, 35%, 20%
- Legend positioned at bottom
- Consistent brand colors

## Backend Integration Points

### API Endpoints Needed
1. `GET /api/campaigns` - Fetch user's campaigns
2. `POST /api/campaigns` - Create new campaign
3. `GET /api/analytics/votes` - Get voting data for charts
4. `GET /api/analytics/engagement` - Get engagement distribution
5. `GET /api/payments` - Fetch payment history
6. `GET /api/contracts` - Fetch contract list
7. `POST /api/models/upload` - Upload marketing models

### Data Transformations Required
- Campaign status mapping to UI status badges
- Date formatting for Italian locale
- Currency formatting for Euro amounts
- Chart data aggregation and formatting

## Responsive Design

### Breakpoints
- **Mobile**: Stacked layout, hidden navigation menu
- **Tablet**: 2-column grid for cards, horizontal tables
- **Desktop**: 4-column grid for overview cards, full table display

### Mobile Optimizations
- Collapsible navigation menu
- Horizontal scroll for tables
- Touch-friendly button sizes
- Optimized chart sizing

## Security Considerations

- Server-side authentication validation
- Role-based route protection
- CSRF protection through Next.js
- Secure file upload handling (ready for implementation)

## Performance Optimizations

- Chart.js components loaded only when needed
- Lazy loading for chart data
- Efficient re-rendering with React hooks
- Optimized bundle size with tree shaking

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live campaign updates
2. **Advanced Filtering**: Campaign filtering by status, date, type
3. **Bulk Actions**: Multi-select for campaign operations
4. **Export Features**: PDF/Excel export for reports
5. **Notification System**: Real-time alerts for campaign events
6. **Drag & Drop**: Enhanced file upload with drag-and-drop
7. **Advanced Charts**: More detailed analytics with time range selection
8. **Collaboration**: Multi-user campaign management features

## Testing

### Demo Mode
Access `/dashboard/brand/demo` to test the interface without authentication.

### Test Scenarios
1. **Navigation**: Test all menu items and internal links
2. **Responsive Design**: Test on mobile, tablet, and desktop viewports
3. **Charts**: Verify chart rendering and responsiveness
4. **Forms**: Test file upload and form submissions
5. **Tables**: Test table scrolling and action buttons

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast color scheme
- Responsive font sizing