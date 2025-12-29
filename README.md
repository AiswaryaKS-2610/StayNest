# StayNest: Smart Accommodation Finder & Rental Management System

## 1. Project Overview
**StayNest** is a cutting-edge, cross-platform application designed to revolutionize the student accommodation market in Dublin, Ireland. Built with a robust **MERN Stack** (MongoDB/Firebase, Express, React, Node.js) and wrapped for mobile via **Cordova**, StayNest bridges the gap between students looking for safe, verified housing and landlords (brokers) seeking reliable tenants.

The platform addresses critical pain points in the current rental market:
-   **Scams & Safety:** Integrated verification systems for brokers to prevent fraud.
-   **Communication:** Real-time messaging between tenants and landlords.
-   **Location Intelligence:** Interactive maps with college proximity filtering.
-   **Smart Assistance:** An AI-powered chatbot to guide international students on local laws and neighborhoods.

---

## 2. Technical Architecture & Stack

### Frontend (Client)
The client application is built using **React 19** with **Vite** for lightning-fast development and build performance.
-   **Framework:** React (Functional Components + Hooks).
-   **Styling:** Modern CSS Variables with a custom design system (Calm Blue + Soft Green palette).
-   **Routing:** React Router v7 for seamless navigation.
-   **State Management:** React Context API (AuthContext).
-   **Maps:** **React Leaflet** & **Mapbox GL** for rendering interactive maps.
-   **Motion:** **Framer Motion** for premium UI animations and transitions.

### Backend (Server)
The server is a RESTful API built on **Node.js** and **Express**.
-   **Runtime:** Node.js.
-   **Framework:** Express.js for route handling and middleware.
-   **Database:** **Firebase Firestore** (NoSQL) for real-time data syncing.
-   **Authentication:** **Firebase Authentication** (JWT based) for secure user sessions.
-   **Deployment:** Render (Cloud Hosting).

### Mobile Wrapper
-   **Cordova:** Used to wrap the web application into a native Android APK, allowing access to device features like Geolocations and Camera.

---

## 3. External APIs & Integrations
StayNest leverages several powerful external APIs to deliver its core features.

### A. Mapbox & Leaflet (Location Intelligence)
We utilize **Mapbox GL** and **Leaflet** to provide a rich mapping experience.
-   **Purpose:** To display property listings on an interactive map and allow students to filter homes based on their distance to major colleges (e.g., Trinity, UCD, DCU).
-   **Features:**
    -   **Geocoding:** Converting addresses (e.g., "Dublin 2") into latitude/longitude coordinates.
    -   **Custom Markers:** Visualizing properties with price tags directly on the map.
    -   **Places Autocomplete:** Helping users find addresses quickly when posting listings.

### B. Firebase (Backend-as-a-Service)
Firebase is the backbone of our data and authentication layer.
-   **Authentication:** Handles secure sign-up/login for Tenants, Brokers, and Admins.
-   **Firestore Database:** Stores all application data including User Profiles, Property Listings, Chat History, and Verification Requests.
-   **Storage:** Manages image uploads (Property photos, ID documents) securely in the cloud.

### C. StayNest AI Assistant (Custom Logic)
We have implemented a custom **AI Chatbot** (`ChatbotWidget.jsx`) to assist users.
-   **Implementation:** Unlike generic API wrappers, this is a custom-built rule engine tailored specifically for the Dublin rental market.
-   **Capabilities:**
    -   **Neighborhood Advice:** "Tell me about Dublin 4" -> Returns verified info about safety and amenities.
    -   **Legal Guidance:** Answers common questions about deposits, RTB registration, and tenant rights.
    -   **Sightseeing:** Suggests local attractions based on the user's location query.

---

## 4. Comprehensive File Structure & Explanation

This section provides a detailed breakdown of every key file and directory in the project, explaining functionality and purpose.

### Root Directory
-   **`package.json`**: The manifest file for the entire project (if using workspaces) or the root Cordova configuration.
-   **`config.xml`**: critical for the **Cordova Mobile Build**. It defines the App Name ("StayNest"), Package ID (`com.staynest.app`), permissions (Camera, Geolocation), and icons for Android/iOS.
-   **`.gitignore`**: Specifies files that should *never* be committed to Git (e.g., `node_modules`, API keys, secrets).
-   **`README.md`**: This documentation file.

### Client Directory (`/client`)
This folder contains the entire React Frontend.

#### `client/public/`
-   **`staynest-logo.png` / `icon.png`**: Static assets used for the app icon and favicon.
-   **`manifest.json`**: Web App Manifest for PWA capabilities (allows "Add to Home Screen").

#### `client/src/` (Source Code)

**1. Root Files:**
-   **`main.jsx`**: The entry point of the React application. It wraps the `App` component with `BrowserRouter` and `AuthProvider`.
-   **`App.jsx`**: The main component that defines the application Routes. It handles the logic for switching between Tenant, Broker, and Admin views based on the user's role.
-   **`index.css`**: The global stylesheet. Contains the **CSS Variables** (`--color-brand`, `--color-bg-primary`) that define the application's "Calm Blue" theme.

**2. `client/src/services/` (API Layer)**
-   **`api.js`**: The central networking file. It currently points to the **Production Render Backend** (`https://staynest-6vsv.onrender.com/api`). All external API calls go through here to ensure a single source of truth for the base URL.
-   **`roommateService.js`**: Specific service methods for fetching and managing roommate profiles (mock data or API fetchers).

**3. `client/src/context/`**
-   **`AuthContext.jsx`**: A React Context provider that listens to Firebase Auth state changes. It exposes the `currentUser` object and `loading` state to the rest of the app, ensuring protected pages are only accessible when logged in.

**4. `client/src/features/` (Feature Modules)**
This directory organizes code by usage domain (feature-based architecture).

**Feature: Authentication (`features/auth`)**
-   **`pages/Login.jsx`**: The user login screen. Handles email/password authentication via Firebase.
-   **`pages/Register.jsx`**: The registration screen. Includes logic for selecting a role (Tenant vs Broker) and creating the initial user profile in Firestore.
-   **`pages/Profile.jsx`**: Users can view and edit their personal details here.

**Feature: Tenant (`features/tenant`)**
-   **`pages/Dashboard.jsx`**: The main landing page for students. It includes the **Search Bar**, **College Filters**, and the grid of **Property Listings**.
-   **`pages/PropertyDetails.jsx`**: The "Single Listing" view. Displays high-quality photos, amenities list, Google Maps location, and the "Book Viewing" button.
-   **`pages/Favorites.jsx`**: Displays a list of properties the user has "Hearted".
-   **`components/SearchFilters.jsx`**: The UI component for the "College" dropdown and "Price Range" slider.
-   **`components/RoommateCard.jsx`**: A UI card component used to display potential roommates in the "Find a Roommate" section.

**Feature: Broker (`features/broker`)**
-   **`pages/NewListing.jsx`**: A complex form that allows landlords to upload property details. It integrates **Mapbox Autocomplete** for address entry and handles image file selection.
-   **`pages/MyListings.jsx`**: A dashboard for brokers to see all properties they have posted and their current status (Active/Pending).
-   **`pages/EditListing.jsx`**: Allows brokers to update details of an existing property.
-   **`pages/Verification.jsx`**: A critical security page where brokers upload ID documents (Passport, Proof of Address) to get the "Verified" badge.

**Feature: Admin (`features/admin`)**
-   **`pages/AdminDashboard.jsx`**: A high-level overview for platform administrators (User counts, Active listings).
-   **`pages/AdminListingReview.jsx`**: A moderation queue. Admins can Approve or Reject new property listings before they go live.
-   **`pages/AdminVerifications.jsx`**: Admins review the ID documents uploaded by brokers here.
-   **`pages/AdminBrokerManagement.jsx`**: Allows admins to ban abusive users or manage broker permissions.

**Feature: Chat (`features/chat`)**
-   **`pages/Inbox.jsx`**: Displays a list of all active conversations the user has.
-   **`pages/ChatWindow.jsx`**: The actual chat interface. Messages are synced in real-time using Firestore `onSnapshot` listeners.

**Feature: AI (`features/ai`)**
-   **`components/ChatbotWidget.jsx`**: The floating "StayNest Assistant". Contains the **Rule Engine** for answering questions about Dublin neighborhoods and tenancy laws.

**Feature: Common (`features/common`)**
-   **`components/BottomNav.jsx`**: The mobile navigation bar (Home, Favorites, Chat, Profile) visible on small screens.
-   **`components/PlacesAutocomplete.jsx`**: A reusable component that wraps the Mapbox Geocoding API for address search.

---

### Server Directory (`/server`)
This folder contains the Node.js Backend API.

**1. Root Files:**
-   **`index.js`**: The entry point of the server. It initializes Express, connects to Firebase Admin SDK, configures CORS, and defines the API routes (`/api/listings`, `/api/users`, etc.).
-   **`serviceAccountKey.json`**: (Note: This is often ignored in Git). Contains the **Secret Credentials** allowing the server to talk to Firebase as a Super-Admin.
-   **`.env`**: Stores environment variables like `PORT` and API Keys.

**2. `server/controllers/` (Business Logic)**
-   **`listingController.js`**: Contains logic for CRUD operations on listings (Create, Read, Update, Delete). Example: `getAllListings`, `createListing`.
-   **`userController.js`**: Manages user profiles. Handles requests like "Register User" or "Update Profile".
-   **`verificationController.js`**: Handles the logic for submitting and reviewing verification documents.
-   **`adminController.js`**: Contains privileged logic (e.g., "Get System Stats") allowed only for admin users.

**3. `server/routes/` (API Endpoints)**
-   **`listingRoutes.js`**: Maps URLs like `GET /listings` to the function `listingController.getAllListings`.
-   **`userRoutes.js`**: Maps URLs like `POST /register` to `userController.registerUser`.
-   **`adminRoutes.js`**: Protects routes with middleware to ensure only Admins can access them.

**4. `server/middleware/`**
-   **`authMiddleware.js`**: A critical file. It intercepts every request, checks the `Authorization` header for a Firebase Token, validates it, and attaches the user's ID to the request. If the token is invalid, it returns `401 Unauthorized`.

---

## 5. Deployment & Build Guide
-   **Backend:** Deployed on **Render**. The server listens for requests and communicates with Firestore.
    -   *Environment Variables:* `FIREBASE_SERVICE_ACCOUNT` (JSON Secret), `NODE_ENV=production`.
-   **Frontend:** Built with `npm run build` (Vite). The output is a static `dist` or `www` folder.
-   **Mobile:**
    -   Built using `cordova build android`.
    -   Wraps the `www` folder into an APK.
    -   Requires **Android SDK** and **JAVA_HOME** configured on the build machine.

---

## 6. How to Run Locally

### Prerequisites
-   Node.js (v18+)
-   Git

### Steps
1.  **Clone Repository:**
    ```bash
    git clone https://github.com/AiswaryaKS-2610/StayNest.git
    cd StayNest
    ```

2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    npm run dev
    ```
    *The server runs on http://localhost:5000*

3.  **Setup Frontend:**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    *The client runs on http://localhost:5173*

4.  **Important:**
    -   The current client code in `api.js` points to the **Live Render Server**.
    -   To use your local server, edit `client/src/services/api.js` and change the URL back to `http://localhost:5000/api`.

---

**StayNest Team**
*Aiswarya & Sneha - 2024*
