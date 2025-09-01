# LunchPay - Expense Splitting Application

A modern web application for splitting expenses among friends and groups, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features (Iteration 1)

### ✅ Completed in Iteration 1
- **User Authentication**: Secure login and registration with JWT tokens
- **Protected Routing**: Route guards ensuring authenticated access
- **Group Management**: Create and manage expense-sharing groups
- **Member Management**: Add and view group members
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **API Integration**: Generic REST API service layer

### 🚧 Coming in Future Iterations
- **Expense Creation**: Add and split expenses among group members
- **Balance Tracking**: Real-time balance calculations
- **Settlement System**: Record payments and settle debts
- **Advanced Splitting**: Unequal splits with custom amounts/percentages
- **Expense Categories**: Organize expenses by type
- **Search & Filtering**: Find expenses and transactions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Development**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Modern web browser

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd lunch-pay-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp env.example .env
```

Edit `.env` with your API configuration:
```env
VITE_API_BASE_URL=https://lunch-pay-generic-api.onrender.com
VITE_APP_NAME=LunchPay
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

### 4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📖 Available Scripts

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Type checking
npm run type-check

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── groups/         # Group management components
│   ├── layout/         # Layout components
│   ├── shared/         # Shared/common components
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   └── useGroups.ts
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── GroupPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── services/           # API service layer
│   ├── api.ts          # Generic API service
│   ├── auth.service.ts
│   └── groups.service.ts
├── types/              # TypeScript type definitions
│   ├── api.types.ts
│   ├── auth.types.ts
│   ├── group.types.ts
│   └── index.ts
├── utils/              # Utility functions
│   ├── cn.ts           # Class name utility
│   ├── formatters.ts   # Data formatting
│   ├── storage.ts      # Local storage helpers
│   └── validators.ts   # Zod validation schemas
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔗 API Integration

The application uses a generic REST API service layer that supports any backend implementing standard CRUD endpoints:

### Endpoint Pattern
```
GET    /{entity}           # List all entities
GET    /{entity}/{id}      # Get entity by ID
POST   /{entity}           # Create new entity
PUT    /{entity}/{id}      # Update entity
DELETE /{entity}/{id}      # Delete entity
```

### Authentication Endpoints
```
POST   /auth/login         # User login
POST   /auth/register      # User registration
POST   /auth/logout        # User logout
POST   /auth/refresh       # Token refresh
GET    /auth/me            # Get current user
```

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

## 🎨 UI Components

The application uses shadcn/ui components for a consistent design system:

- **Button**: Primary, secondary, outline, ghost variants
- **Input**: Form inputs with validation states
- **Card**: Content containers with header/footer
- **Label**: Form labels with accessibility
- **LoadingSpinner**: Loading states and feedback

All components are fully typed and customizable with Tailwind CSS.

## 🔐 Authentication

### Features
- JWT token-based authentication
- Secure password validation
- Session persistence across browser restarts
- Automatic token refresh
- Protected routes with redirects

### Storage
- Tokens stored in localStorage
- Automatic cleanup on logout
- Secure token validation

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces
- Optimized for tablet and desktop usage

## 🧪 Testing Strategy

### Current Implementation
- Type safety with TypeScript
- Runtime validation with Zod
- Error boundaries for graceful error handling
- Loading states for all async operations

### Future Testing (Iterations 2-3)
- Unit tests with Jest + React Testing Library
- Integration tests for API services
- E2E tests for critical user flows
- Component testing with Storybook

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the app
npm run build

# Deploy dist/ folder to Netlify
```

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to any static hosting service
```

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=LunchPay
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

## 🔧 Configuration

### Tailwind CSS
Custom design tokens and components are configured in `tailwind.config.js`:
- Color palette with dark mode support
- Custom border radius and spacing
- Component-specific utilities

### TypeScript
Strict mode enabled with path mapping for clean imports:
```json
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/hooks/*": ["./src/hooks/*"]
}
```

### Vite
Optimized build configuration with:
- Code splitting for vendor libraries
- Path aliases for clean imports
- Development server with HMR

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
npm run type-check
# Fix any type errors and rebuild
npm run build
```

**API requests failing**
- Check `.env` file configuration
- Verify API base URL is correct
- Ensure backend server is running

**Styling issues**
```bash
# Regenerate Tailwind styles
npm run build
```

**Authentication not persisting**
- Check browser localStorage for tokens
- Verify token expiration times
- Clear localStorage and re-login

### Development Tips
- Use React Developer Tools for debugging
- Check browser console for errors
- Use Network tab to debug API calls
- Verify environment variables with `import.meta.env`

## 🤝 Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write descriptive commit messages
- Add JSDoc comments for complex functions

### Pull Request Process
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run quality checks: `npm run lint && npm run type-check`
4. Submit PR with description of changes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Roadmap

### Iteration 2 (Next)
- [ ] Expense creation and management
- [ ] Equal expense splitting
- [ ] Balance calculation and display
- [ ] Basic settlement functionality

### Iteration 3
- [ ] Unequal splitting with custom amounts
- [ ] Percentage-based splitting
- [ ] Expense categories and filtering
- [ ] Enhanced UI/UX with animations

### Iteration 4
- [ ] Search and filtering functionality
- [ ] Expense history and reporting
- [ ] Performance optimizations
- [ ] Advanced settlement features

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**LunchPay** - Making expense splitting simple and fair for everyone! 🍽️💰
