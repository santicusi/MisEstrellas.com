# Overview

MisEstrellas.com is a customer loyalty platform built with vanilla HTML, CSS, and JavaScript. The platform features a bilingual interface (Spanish/English) and provides separate dashboards for customers and business administrators. Customers can collect "stars" (loyalty points) by visiting affiliated businesses, while administrators can manage their customer base and award points.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Design Pattern**: Multi-page application with client-side routing
- **Language Support**: Bilingual system with Spanish as default and English as secondary
- **Responsive Design**: Mobile-first approach with progressive enhancement

### Backend Architecture
- **Firebase Integration**: Configured for authentication, database, and storage
- **Authentication**: Firebase Auth with phone/SMS and email/password support
- **Database**: Firestore for real-time data synchronization
- **Storage**: Firebase Storage for images and files

### UI Framework
- **Styling**: Custom CSS with CSS custom properties for theming
- **Component System**: Modular CSS components in separate files
- **Icons**: Font Awesome for consistent iconography
- **Color Scheme**: Dark theme with orange accents (#FF8C42 on #1A1A1A background)

## Key Components

### Authentication System
- **Client Login**: Phone number (with country code) or email-based authentication
- **Admin Login**: Traditional email/password authentication
- **Verification**: SMS/email verification code system
- **Session Management**: Firebase Auth state persistence

### User Interfaces
- **Client Portal**: Dashboard, QR scanner, business map, profile management
- **Admin Portal**: Dashboard with analytics, client management, star allocation system, business profile
- **Shared Components**: Language toggle, navigation headers, form inputs

### QR Code System
- **QR Generation**: Businesses generate QR codes for point allocation
- **QR Scanning**: Clients scan QR codes to receive stars
- **Validation**: Server-side validation of QR code transactions

### Internationalization
- **Translation System**: JavaScript-based translation module with JSON language files
- **Language Toggle**: Persistent language preference across sessions
- **Dynamic Content**: Real-time language switching without page reload

## Data Flow

### Authentication Flow
1. User selects client or admin login type
2. Credentials are validated through Firebase Auth
3. User is redirected to appropriate dashboard
4. Session state is maintained across page navigation

### Star Collection Flow
1. Customer visits participating business
2. Admin generates QR code with star value
3. Customer scans QR code using mobile camera
4. Stars are added to customer's account in real-time
5. Transaction is recorded in Firestore

### Business Management Flow
1. Admin accesses client management dashboard
2. Can view customer statistics and history
3. Can manually add/remove stars
4. Can search and filter customer database

## External Dependencies

### Third-party Libraries
- **Firebase SDK v9**: Authentication, database, and storage
- **Font Awesome 6.0**: Icon library for UI elements
- **intl-tel-input**: International phone number input validation
- **qrcode.js**: QR code generation for star allocation
- **jsQR**: QR code scanning functionality

### Browser APIs
- **Camera API**: For QR code scanning functionality
- **Geolocation API**: For business location mapping
- **Local Storage**: For user preferences and session data

## Deployment Strategy

### Static Hosting
- **Platform**: Designed for static hosting (Netlify, Vercel, GitHub Pages)
- **Build Process**: No build step required - direct HTML/CSS/JS deployment
- **CDN Integration**: External libraries loaded via CDN for performance

### Firebase Configuration
- **Environment Setup**: Requires Firebase project configuration
- **Security Rules**: Firestore security rules for data protection
- **Hosting**: Can be deployed to Firebase Hosting for seamless integration

### Progressive Web App Features
- **Offline Capability**: Service worker for offline functionality (to be implemented)
- **Mobile Optimization**: Touch-friendly interface with proper viewport settings
- **Performance**: Lazy loading and optimized asset delivery

### File Structure
```
misestrellas/
├── index.html (login/authentication)
├── cliente/ (customer portal)
├── admin/ (business admin portal)
├── css/ (styling and components)
├── js/ (application logic and utilities)
└── images/ (assets and media)
```

The application follows a modular architecture with clear separation between customer and admin functionalities, making it easy to maintain and extend features independently.