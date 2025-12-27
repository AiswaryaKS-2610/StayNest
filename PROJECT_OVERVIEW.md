# 🇮🇪 StayNest – Ireland-Focused Smart Accommodation Platform

## Project Overview
StayNest is a comprehensive cross-platform mobile application **tailored specifically for the Irish rental ecosystem**. It addresses the unique challenges faced by **students, migrants, and international renters** moving to Ireland, ensuring a safe, transparent, and efficient rental process.

Built with a modern web stack (**HTML5, CSS3, JavaScript**) and wrapped in **Apache Cordova**, it delivers a premium native-like experience on both Android and iOS.

---

## 🇮🇪 Regional Focus: Built for Ireland
*   **Location Coverage**: Major cities including **Dublin, Cork, Galway, Limerick, Waterford**.
*   **University Zones**: Specialized search for **Trinity College Dublin, UCD, DCU, UCC, University of Galway, UL**.
*   **Eircode Integration**: Precise property lookup using the Irish Eircode system.
*   **Transport Awareness**: Integration with **LUAS, DART, and Bus Éireann** routes for commute planning.
*   **Rental Compliance**: Clear display of **RTB (Residential Tenancies Board)** registration, lease types (Fixed / Part 4), and notice periods.

---

## 🔐 Trust-First Model: Admin-Controlled Broker Verification
StayNest prioritizes safety with a strict **Admin-Gated Broker Onboarding Flow**:
1.  **Registration**: Broker signs up.
2.  **Document Upload**: Mandatory upload of Government ID (Passport/IRP) and Proof of Address/Business.
3.  **Manual Admin Review**: Admins review documents before granting access.
4.  **Status System**:
    *   ❌ *Unverified*: Cannot post listings.
    *   ✅ *Verified Broker*: Can list properties.
    *   **Double Moderation**: Admin approves individual listings before they go live.

---

## � Role-Based Authentication & Onboarding
StayNest implements a role-based authentication system to ensure a personalized and secure experience for different user types.

### Signup Role Selection
During registration, users must choose their role:
1.  **Tenant / Student**: Standard access to search, filter, and chat.
2.  **Broker / Property Owner**: Restricted access until verified.
3.  **Admin**: System-created role for moderation.

### Role-Based Access Control (RBAC)
| Role | Permissions |
| :--- | :--- |
| **Tenant** | Search properties, use filters, view map, save favorites, contact brokers |
| **Broker** | Create listings (after verification), manage properties, respond to enquiries |
| **Admin** | Verify brokers, approve/reject listings, moderate content |

### Broker-Specific Signup Flow
If **Broker** is selected during signup:
1.  Account is created in **Restricted Mode**.
2.  Broker must upload:
    *   Government ID (Passport / IRP)
    *   Proof of Address or Business Registration
3.  Broker remains **Unverified** until Admin approval.
4.  Only after verification can they create listings and receive the **Verified Badge**.

> 🔐 This ensures scam prevention, legal compliance, and user trust — especially critical in Ireland’s rental market.

---

## �🚀 Key Features

### 🗺️ Advanced Map & Discovery covers
*   **Interactive Map**: Google Maps integration with price pins and "Near My Campus" mode (5km/10km radius).
*   **Student-Friendly Filters**:
    *   **Bills Included** (Electricity, Heating, Internet).
    *   **Flexible Leases** (3, 6, 9 months).
    *   **Room Type** (Ensuite, Shared, Studio).
    *   **House Rules** (Quiet hours, Guests).
*   **Budget Transparency**: Full breakdown of Rent, Deposit, Utilities, and Hidden Charges.

### 🌍 International User Experience
*   **Pre-Arrival Booking**: Virtual tours (360°/Video) and "Book Before Arrival" options.
*   **Move-In Readiness Score**: Checks for Furnished status, Wi-Fi, and Heating type.
*   **Local Insights**: Safety ratings, nearby supermarkets (Lidl, Tesco, Aldi), and cost of living estimates.

### 🤖 Smart AI Enhancements
*   **AI Leasing Assistant**: Answers questions like "Is this RTB registered?", "Gas or Electric heating?".
*   **Smart Match**: Recommends properties based on University course duration and budget.

### 🛠️ Tech Stack
*   **Frontend**: HTML5, Vanilla CSS3 (Teal/Red Theme), Vanilla JavaScript.
*   **Mobile Wrapper**: Apache Cordova.
*   **Backend Services**: Firebase (planned).

---

## 📁 Project Structure
```
StayNest/
├── config.xml              # Cordova configuration
├── www/                    # Web Assets
│   ├── index.html          # Entry point (Dashboard, Details, Auth)
│   ├── css/
│   │   ├── style.css       # Premium localization styles
│   │   └── variables.css   # Teal/Red Theme tokens
│   ├── js/
│   │   ├── app.js          # Core logic (Filtering, Navigation, Mock Data)
│   └── img/
└── legacy_flutter_backup/  # Archived Flutter code
```

## 📅 Roadmap

### Phase 1: Core Essentials & Localization (Current)
- [x] Basic UI & Navigation
- [x] Property Details View
- [ ] **Ireland Localization** (Eircode, RTB tags, University Search)
- [ ] **Student Filters** (Bills Inc, Lease Length)
- [ ] **Broker Verification UI** (Simulated Admin Flow)

### Phase 2: Advanced Integrations
- [ ] Firebase Backend Integration
- [ ] Google Maps API specific implementation
- [ ] Real-time Chat
- [ ] AI Chatbot Integration

---

## 🎨 UI/UX Design References
The UI/UX design of StayNest is inspired by leading rental platforms such as:
- **Airbnb**: Property discovery & visual hierarchy.
- **Daft.ie**: Ireland-specific rental structure.
- **Zillow**: Map-based search & filtering.
- **Uniplaces & Student.com**: Student-focused onboarding and lease transparency.

These references helped shape a user-friendly, trust-driven, and localized experience.
