# StayNest - Smart Accommodation Finder

StayNest is a premium hybrid mobile application designed to help students find suitable accommodation near their colleges in Dublin.

## 📱 Features

- **Smart Map View**: Find properties near major Dublin colleges (Trinity, UCD, DCU, etc.) using real-time Geolocation.
- **Easy Listing**: Brokers can post new properties directly from their mobile device, including taking photos using the **Camera**.
- **Role-Based Access**: Specialized dashboards for Admins, Brokers, and Tenants.
- **Interactive Chat**: Built-in messaging system for instant communication.
- **Advanced Filtering**: Filter by price, property type, and proximity to campuses.

## 🛠 Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Vanilla CSS (Premium Airbnb-like aesthetic)
- **Mobile Wrapper**: Apache Cordova
- **Backend**: Node.js & Express
- **Database**: Firebase (Authentication, Firestore, Storage)
- **Maps**: React-Leaflet (OpenStreetMap)
- **Image Hosting**: Cloudinary

## 🔌 Cordova Plugins Used

1. **Geolocation**: Used for "Locate Me" functionality on the interactive map.
2. **Camera**: Used for taking property photos in the "New Listing" flow.

## 🚀 How to Run

1. **Build the Web App**:
   ```bash
   cd client
   npm run build
   ```
2. **Setup Cordova**:
   ```bash
   cordova platform add android
   cordova build android
   ```
3. **Run on Emulator/Device**:
   ```bash
   cordova emulate android
   ```

## 👥 Authors
- [Student 1 Name - Student Number]
- [Student 2 Name - Student Number]
