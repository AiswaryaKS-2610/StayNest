# 📂 StayNest Project Structure (React + Node)

This project follows a **Domain-Driven Design (DDD)** architecture, optimized for scalability and clean separation of concerns.

## 📱 Client (Frontend) - `client/src`

The frontend is organized by **Features**, not just file types.

| Folder | Purpose |
|--------|---------|
| **`features/auth/`** | **Authentication Module** <br> - `pages/Login.jsx`: Role selection & login <br> - `services/authService.js`: API calls |
| **`features/tenant/`** | **Student/Tenant Module** <br> - `pages/Dashboard.jsx`: Main search view <br> - `components/ListingCard.jsx`: Property card |
| **`features/broker/`** | **Broker Module** <br> - `pages/MyListings.jsx`: Property management <br> - `pages/Verification.jsx`: ID upload |
| **`features/admin/`** | **Admin Module** <br> - `pages/Moderation.jsx`: Approve/Reject users |
| **`shared/`** | **Reusable Code** <br> - `components/ui/`: Buttons, Inputs, Modals <br> - `layouts/`: Navbar, Sidebar |
| **`App.jsx`** | Main Router & Layout definition |
| **`main.jsx`** | Application Entry Point |

---

## 🚀 Server (Backend) - `server/`

The backend follows a standard **MVC (Model-View-Controller)** pattern.

| Folder | Purpose |
|--------|---------|
| **`controllers/`** | **Logic Layer**: Handles the actual business logic (e.g., `getProperties`) |
| **`routes/`** | **API Endpoints**: Defines URLs (e.g., `GET /api/properties`) |
| **`models/`** | **Data Layer**: Database schemas and types |
| **`middleware/`** | **Security**: Auth checks, Validation (e.g., `verifyToken`) |
| **`config/`** | **Configuration**: Firebase setup, Database connections |
| **`index.js`** | Server Entry Point |

---

## 🏗️ Build Output - `www/`

*   **`www/`**: This folder contains the **compiled** React app.
*   **Cordova** uses this folder to build the mobile app (APK/IPA).
*   **Do not edit files in `www` directly**; they are overwritten every time you run `npm run build`.
