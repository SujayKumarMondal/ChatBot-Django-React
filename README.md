# ChatPaat - AI-Powered Chat Assistant

A modern, full-stack chatbot application with beautiful animations and seamless user experience. Built with **FastAPI** (backend) and **React + TypeScript** (frontend), featuring JWT authentication, persistent profile images, and Framer Motion animations.

---

## 🎯 Purpose

**ChatPaat** enables users to register, authenticate, and interact with an AI-powered chat assistant in real-time. Each user maintains their own encrypted chat history and profile, with support for profile image uploads that persist across sessions via browser localStorage.

---

## ✨ Main Features

### Authentication & User Management
- **JWT-based Authentication** - Secure token management with localStorage persistence
- **User Registration & Login** - Email/password authentication
- **Single Sign-In Experience** - Automatic session restoration; users stay logged in after page reload
- **Profile Management** - Update username, email, and profile picture
- **Password Reset** - Secure password recovery via email

### Chat Features
- **Real-Time Chat Interface** - Instant messaging with AI assistant
- **Chat History** - Persistent storage of all conversations per user
- **Individual Chat Sessions** - Each conversation is isolated to the authenticated user
- **Typing Indicator** - Animated loader shows when AI is processing
- **Message Persistence** - All messages saved in SQLite/PostgreSQL database

### Profile & Image Storage
- **Profile Picture Upload** - Select and upload images with preview
- **Browser localStorage Storage** - Images stored locally by user email (no server upload needed)
- **Image Persistence** - Profile images persist across browser sessions
- **Automatic Image Retrieval** - Images automatically loaded on user login

### UI/UX & Animations
- **Framer Motion Animations** - Professional component animations throughout the app
  - Message slide-in effects (from left/right)
  - Button hover and tap effects
  - Navbar header animations
  - LoginPrompt with animated robot character
  - Typing loader with bouncing dots
  - Dialog and modal animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme Support** - Context-based theme switching
- **Tailwind CSS Styling** - Modern, utility-first CSS framework
- **Interactive Components** - Smooth transitions and visual feedback

### Pages & Navigation
- **Home/Chat Page** - Main chat interface with message history
- **About Page** - Project information and features
- **Privacy Policy Page** - User privacy details
- **Terms of Service Page** - Usage terms and conditions
- **Login/Register Pages** - Authentication interface
- **Profile Page** - User profile management with image upload
- **Settings Page** - User preferences and account settings
- **Forgot Password Page** - Password recovery initiation
- **Reset Password Page** - Secure password reset flow

---

## 🏗️ Project Structure

### Backend (`fastapi_backend/`)

```
fastapi_backend/
├── fastapi_server.py       # Main FastAPI application
├── db.py                   # Database configuration & connection
├── models.py               # SQLAlchemy ORM models
├── routes.py               # API endpoint definitions
├── auth.py                 # JWT authentication logic
├── email_utils.py          # Email sending utilities
├── db.sqlite3              # SQLite database (default)
├── requirements.txt        # Python dependencies
├── alembic/                # Database migrations
└── scripts/                # Helper scripts for testing
```

**Key Backend Files:**

- **fastapi_server.py**: Main application entry point with CORS configuration
  - Runs on `http://127.0.0.1:7004`
  - Includes CORS middleware for localhost:5173 (frontend)

- **models.py**: Database models using SQLAlchemy
  - `User`: User account with email, hashed password, profile image
  - `Chat`: Chat session linked to user
  - `ChatMessage`: Individual messages in a chat

- **routes.py**: API endpoint definitions
  - `/api/register/` - User registration
  - `/api/login/` - User login (returns JWT token)
  - `/api/chat/` - Create new chat
  - `/api/messages/` - Get/create messages
  - `/api/user/` - Get/update user profile

- **auth.py**: JWT token creation and validation
  - Token encoding with user ID and email
  - Token expiration and validation
  - Secure password hashing

- **db.py**: Database configuration
  - SQLite (default) or PostgreSQL support
  - Session management and engine configuration

- **email_utils.py**: Email sending for password reset
  - SMTP configuration
  - Password reset link generation and validation

### Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── App.tsx                  # Main router and app component
│   ├── main.tsx                 # React DOM entry point
│   ├── vite-env.d.ts            # Vite type definitions
│   ├── index.css                # Global styles
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx         # Main chat interface
│   │   ├── LoginPrompt.tsx      # Unauthenticated welcome page
│   │   ├── SignIn.tsx           # Login page
│   │   ├── RegisterPage.tsx     # Registration page
│   │   ├── ProfilePage.tsx      # Profile & image upload
│   │   ├── SettingsPage.tsx     # User settings
│   │   ├── AboutPage.tsx        # About page
│   │   ├── PrivacyPolicyPage.tsx # Privacy policy
│   │   ├── TermsPage.tsx        # Terms of service
│   │   ├── ForgotPassword.tsx   # Password reset request
│   │   ├── ResetPassword.tsx    # Password reset confirmation
│   │   └── OAuthCallback.tsx    # OAuth integration handler
│   ├── components/              # Reusable components
│   │   ├── AppSidebar.tsx       # Sidebar with chat history
│   │   ├── Dashboard.tsx        # Dashboard layout
│   │   ├── MainLayout.tsx       # Main layout wrapper
│   │   ├── Message.tsx          # Message display component
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── TypingLoader.tsx     # Typing indicator animation
│   │   ├── LoginPrompt.tsx      # Login CTA with animations
│   │   └── ui/                  # UI component library
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dropdown.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── badge.tsx
│   │       └── more...
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.tsx      # Auth state management
│   │   ├── ThemeContext.tsx     # Theme (dark/light) management
│   │   └── ToastContext.tsx     # Toast notifications
│   ├── hooks/                   # Custom React hooks
│   │   └── use-mobile.ts        # Mobile device detection
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts              # Backend API calls
│   │   ├── imageStorage.ts     # localStorage image management
│   │   ├── utils.ts            # Helper functions
│   │   ├── advancedChat.tsx    # Advanced chat logic
│   │   ├── responsive.tsx      # Responsive utilities
│   │   └── a11y.tsx            # Accessibility utilities
│   ├── i18n/                    # Internationalization (i18n)
│   │   └── locales/             # Language files
│   ├── styles/                  # Style files (CSS modules, etc.)
│   └── assets/                  # Images and static assets
├── public/                      # Static files
├── index.html                   # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # NPM dependencies
└── README.md                    # Frontend documentation
```

**Key Frontend Files:**

- **App.tsx**: Main router with protected routes
  - Protected routes: `/`, `/profile`, `/settings` (require authentication)
  - Public routes: `/signin`, `/register`, `/about`, `/forgot-password`
  - Route protection via `ProtectedRoute` component

- **AuthContext.tsx**: Centralized authentication state
  - `signIn()`, `signOut()`, `register()` functions
  - JWT token management
  - User profile data management
  - Loading state for initial auth restoration
  - Automatic image retrieval from localStorage on login

- **HomePage.tsx**: Main chat interface
  - Message display with Framer Motion animations
  - User messages slide in from right
  - AI responses slide in from left
  - Message input with focus animations
  - Smooth send button interactions

- **ProfilePage.tsx**: User profile management
  - Profile image upload with preview
  - Stores images in browser localStorage using `storeProfileImage()`
  - Update username and email
  - Secure password change

- **imageStorage.ts**: localStorage image utility
  - `storeProfileImage(email, imageData)` - Save image for user
  - `getProfileImageByEmail(email)` - Retrieve saved image
  - `removeProfileImage(email)` - Delete user's image
  - Base64 image encoding/decoding

- **lib/api.ts**: Centralized API client
  - All requests include JWT token in headers
  - Base URL: `http://127.0.0.1:7004`
  - Functions for chat, messages, user, auth operations

---

## 🔐 Authentication & Security

### How Authentication Works

1. **User Registration**
   - User enters email and password
   - Backend hashes password using `bcrypt`
   - User stored in database with `verified=false` (initial state)

2. **User Login**
   - User sends credentials to `/api/login/`
   - Backend validates password and returns JWT token
   - Frontend stores token in localStorage: `authToken`
   - Token includes user ID and email; expires after set duration

3. **Token Persistence**
   - On page load, AuthContext checks localStorage for `authToken`
   - If token exists, user is automatically restored (loaded from localStorage)
   - `isLoading` state prevents routes from redirecting during restoration

4. **Protected Routes**
   - Routes like `/`, `/profile`, `/settings` require valid token
   - `ProtectedRoute` component redirects to `/signin` if not authenticated
   - Token sent in every API request via `Authorization: Bearer <token>` header

### Security Features

- **JWT Token-Based Auth** - Stateless, secure authentication
- **Password Hashing** - Passwords never stored in plain text
- **Email Verification** - Optional email verification for new accounts
- **CORS Protection** - Only allows requests from configured frontend URL
- **Token Expiration** - Tokens expire after configured duration (default: 7 days)
- **HttpOnly Cookies Option** - Can be configured instead of localStorage
- **Secure Password Reset** - Email-based password reset with secure tokens

---

## 🎨 Animation & UI Features

### Framer Motion Animations

The entire application features smooth, professional animations powered by **Framer Motion 12.23.15**:

#### HomePage Animations
- **User Messages**: Slide in from right (x: 100 → 0) with 0.3s duration
- **AI Messages**: Slide in from left (x: -100 → 0) with 0.3s duration
- **Input Textarea**: Scales on focus (1 → 1.02) for visual feedback
- **Send Button**: Hover scale (1 → 1.1), tap scale (1 → 0.95)

#### LoginPrompt Animations
- **Container Stagger**: All child elements animate with 0.2s stagger delay
- **Robot Character**: Floating effect with continuous bounce animation
- **Robot Antenna**: Rotating spin animation (-10° ↔ 10°)
- **Robot Eyes**: Blinking opacity animation
- **Chat Icon**: Pulsing scale effect (1 → 1.2)
- **Buttons**: Scale and color on hover/tap with whileHover/whileTap

#### Navbar Animations
- **Header**: Slides down on load (y: -100 → 0) with spring physics
- **Logo Zap Icon**: Continuous rotation animation
- **Theme Toggle**: Smooth 180° rotation on click
- **Notification Bell**: Pulse animation (scale: 1 → 1.1 → 1)
- **User Avatar**: Hover scale (1 → 1.1)
- **Buttons**: Scale and shadow on hover/tap
- **Sign Out Dialog**: Modal animation with scale (0.9 → 1) and fade

#### TypingLoader Animations
- **Bouncing Dots**: Three dots with staggered vertical bounce
- **Duration**: 0.8s per dot, 0.15s stagger between dots
- **Effect**: Dots bounce from y: 0 → -8 → 0

#### Global Animations
- **Fade In/Up**: Elements fade and slide in on mount
- **Slide Effects**: Smooth directional slides for modals and sidebars
- **Pulse Glow**: Subtle pulsing effect for active elements
- **Shimmer Effect**: Loading skeleton animation
- **Button Hovers**: Universal button hover effects

### CSS Animation Definitions

Global animations defined in `animations.css` (imported in App.tsx):
- `.fadeInUp` - Fade in with upward slide
- `.fadeInDown` - Fade in with downward slide
- `.slideInRight` - Slide in from right
- `.slideInLeft` - Slide in from left
- `.pulseGlow` - Pulsing glow effect
- `.shimmer` - Skeleton loader shimmer
- `.float` - Floating motion effect
- `.bounceIn` - Bounce entrance
- `.shake` - Shake animation
- `.spin` - Continuous rotation

---

## 🗄️ Database Schema

### SQLite/PostgreSQL Models

**User Table**
```sql
- id (Primary Key)
- email (Unique, String)
- username (String)
- password_hash (String)
- profile_image (Text - stored as base64 or URL)
- is_verified (Boolean, default: False)
- created_at (DateTime)
- updated_at (DateTime)
```

**Chat Table**
```sql
- id (Primary Key)
- user_id (Foreign Key → User)
- title (String)
- created_at (DateTime)
- updated_at (DateTime)
```

**ChatMessage Table**
```sql
- id (Primary Key)
- chat_id (Foreign Key → Chat)
- role (String: "user" or "assistant")
- content (Text)
- created_at (DateTime)
- updated_at (DateTime)
```

### Client-Side localStorage Storage

**Profile Images**
```javascript
localStorage["profile_images"] = {
  "user@email.com": "data:image/png;base64,iVBORw0KGg..."
}
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 16+ and npm (for frontend)
- **Python** 3.8+ and pip (for backend)
- **SQLite** (included with Python) or **PostgreSQL** (optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChatPaat/fastapi_backend
   ```

2. **Create a Python virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in `fastapi_backend/`:
   ```
   DATABASE_URL=sqlite:///./db.sqlite3
   # OR for PostgreSQL:
   # DATABASE_URL=postgresql://user:password@localhost:5432/chatpaat
   
   JWT_SECRET_KEY=your_secret_key_here
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION_HOURS=168
   
   GROQ_API_KEY=your_groq_api_key
   
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   
   FRONTEND_URL=http://localhost:5173
   ```

5. **Initialize the database**
   ```bash
   # If using SQLAlchemy automatic migrations
   python -c "from db import Base, engine; Base.metadata.create_all(engine)"
   ```

6. **Run the backend server**
   ```bash
   python fastapi_server.py
   ```
   Server runs on `http://127.0.0.1:7004`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ChatPaat/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in `frontend/`:
   ```
   VITE_API_URL=http://127.0.0.1:7004
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📡 API Documentation

### Base URL
`http://127.0.0.1:7004/api`

### Authentication
All protected endpoints require the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```



## 📦 Dependencies

### Backend
- **FastAPI** 0.104.1 - Web framework
- **SQLAlchemy** 2.0.23 - ORM
- **Pydantic** 2.4.2 - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing
- **aiofiles** - Async file handling

### Frontend
- **React** 18.3.1 - UI framework
- **TypeScript** 5.5.3 - Type safety
- **Framer Motion** 12.23.15 - Animations
- **Tailwind CSS** 4.1.11 - Styling
- **React Router** v7.6.3 - Navigation
- **Lucide React** - Icons
- **React Query** - Server state management
- **Zustand** (optional) - Client state management

---

## 📋 Project Status

### ✅ Completed Features
- User authentication with JWT
- Single sign-in with session persistence
- Profile management with image upload
- Image storage in browser localStorage
- Chat history per user
- AI-powered responses via Groq API
- Dark/Light theme support
- Password reset flow
- Complete Framer Motion animation system
- Responsive design for all devices
- Protected routes and authorization

### 🔄 In Development
- OAuth integration (Google, GitHub)
- Internationalization (i18n) support
- Advanced search in chat history
- Chat export functionality
- User preferences and customization


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Author

**Sujay** - Full-stack development and animation enhancements
**Tapasya** - Full-stack development, Auth Flow and Deployment enhancements


---

## 📞 Support

For issues, questions, or suggestions, please contact:
- hiiiamsujay12@gmail.com
- mailrip00@gmail.com