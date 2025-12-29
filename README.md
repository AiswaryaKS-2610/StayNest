Project Report

Project Title: StayNest – Smart Accommodation Finder & Rental Management System
Domain: Web & Mobile Application Development
Technology Stack: MERN Stack + Firebase + Cordova
Target Users: Students, Brokers, Administrators
Region Focus: Ireland
Developed By: Aiswarya Koonakkampilly Sunilal & Sneha Shajan

1. Introduction
Finding safe, affordable, and verified student accommodation has become a major challenge in cities like Dublin, especially for international students. The lack of transparency, prevalence of rental scams, and inefficient communication between students and landlords have made the process stressful and unreliable.
StayNest is a smart, cross-platform accommodation finder and rental management system designed to address these challenges. The platform connects students with verified brokers through a secure, interactive, and user-friendly application, ensuring trust, convenience, and safety.

2. Objectives of the Project
The main objectives of StayNest are:
•	To provide a secure and scam-free accommodation platform for students
•	To enable verified brokers to list properties efficiently
•	To integrate location-based search using interactive maps
•	To offer real-time communication between tenants and brokers
•	To assist international students through an AI-powered chatbot
•	To provide administrators with full control over listings and user verification

3. Scope of the System
StayNest is designed as a full-stack web application with mobile support. The system supports three primary user roles:
•	Tenant (Student): Search properties, view listings on maps, chat with brokers, save favorites, and get AI assistance
•	Broker (Landlord): Post and manage property listings, upload verification documents, and communicate with tenants
•	Admin: Review listings, verify brokers, manage users, and monitor platform activity
The application is scalable and adaptable for expansion to other cities in the future.

4. System Architecture
StayNest follows a modular client-server architecture:
•	Frontend: React-based single-page application
•	Backend: Node.js and Express REST API
•	Database: Firebase Firestore (NoSQL)
•	Authentication: Firebase Authentication (JWT)
•	Mobile Platform: Apache Cordova
•	Hosting: Render (Backend)
This architecture ensures scalability, performance, and real-time data synchronization.

5. Technology Stack
5.1 Frontend Technologies
•	React 19 (Functional Components & Hooks)
•	Vite (Fast Build Tool)
•	React Router v7
•	Context API (Authentication State Management)
•	CSS Variables (Custom Design System)
•	Framer Motion (Animations)
•	React Leaflet & Mapbox GL (Maps Integration)
5.2 Backend Technologies
•	Node.js
•	Express.js
•	Firebase Admin SDK
•	Firebase Firestore
•	Firebase Authentication
5.3 Mobile Integration
•	Apache Cordova
•	Android SDK

6. External APIs & Integrations
6.1 Mapbox & Leaflet
Used for interactive maps and location intelligence:
•	Property visualization on maps
•	College proximity filtering
•	Address geocoding and autocomplete
•	Custom map markers
6.2 Firebase Services
•	User authentication and role management
•	Real-time database for listings and chat
•	Secure cloud storage for images and documents
6.3 StayNest AI Assistant
A custom-built rule-based chatbot that provides:
•	Neighborhood information
•	Rental laws and tenant rights guidance
•	Local attractions and city insights

7. Module Description
7.1 Authentication Module
•	User registration and login
•	Role-based access control (Tenant, Broker, Admin)
•	Profile management
7.2 Tenant Module
•	Property search and filtering
•	Interactive map-based listings
•	Property details and booking requests
•	Favorites management
•	Buddy Up - Roommate finder

7.2.1 Buddy Up Feature
The Buddy Up feature helps students find compatible roommates based on their preferences and lifestyle choices. This feature addresses the common challenge of finding trustworthy and compatible roommates, especially for international students new to Dublin.

Key Features:
•	Preference-based matching: Students can set preferences including budget range, cleanliness habits, study schedules, lifestyle choices, and interests
•	Profile browsing: View profiles of other students looking for roommates with detailed compatibility scores
•	Direct messaging: Chat with potential roommates through the integrated messaging system to discuss expectations and compatibility
•	Safety first: All users are verified through the platform's authentication system
•	Flexible search: Filter potential roommates by college, budget, move-in date, and other criteria

How It Works:
1.	Students complete their roommate preference profile including budget, lifestyle, and habits
2.	The system suggests compatible matches based on shared preferences
3.	Students can browse profiles and initiate conversations with potential roommates
4.	Once compatible roommates connect, they can search for properties together or share listings
5.	Both parties can communicate expectations and finalize roommate arrangements before booking
7.3 Broker Module
•	Property listing creation and editing
•	Image uploads and address autocomplete
•	Listing status tracking
•	Broker identity verification

7.3.1 Broker Verification Flow
To ensure platform safety and prevent rental scams, all brokers must complete a verification process before their listings can go live. This verification system validates the broker's identity using official Irish documentation.

Verification Process:
1.	Broker Registration: Broker creates an account and selects the "Broker" role during signup
2.	Document Submission: Broker uploads one of the following identity documents:
   •	PPSN (Personal Public Service Number) - for Irish residents
   •	GNIB (Garda National Immigration Bureau) card - for international landlords/brokers
3.	Document Review: Admin reviews the submitted documents to verify:
   •	Document authenticity and validity
   •	Name matches the registered broker account
   •	Document is clear and readable
   •	Information is current and not expired
4.	Verification Decision:
   •	Approved: Broker receives verification badge and can publish listings immediately
   •	Rejected: Broker is notified with reasons and can resubmit corrected documents
5.	Listing Activation: Only verified brokers can have their listings appear in tenant searches

Benefits:
•	Prevents fraudulent listings and scams
•	Builds trust between tenants and landlords
•	Ensures compliance with Irish rental regulations
•	Protects both parties in rental transactions
7.4 Admin Module
•	Dashboard analytics
•	Listing approval and rejection
•	Broker verification review
•	User and broker management
7.5 Chat Module
•	Real-time messaging using Firestore
•	Inbox and chat window interface
7.6 AI Assistance Module
•	Chatbot widget for user support
•	Rule-based responses tailored to Dublin

8. App Flow

The StayNest platform supports three distinct user roles, each with specific workflows and capabilities. Below are detailed flow descriptions for each role:

8.1 Tenant/User Flow

User A (Tenant) Journey:

1. Registration & Login
   •	User A visits StayNest and clicks "Sign Up"
   •	Enters email, password, and selects "Tenant" as role
   •	Verifies email through OTP sent to their inbox
   •	Completes profile with personal details (name, college, contact info)
   •	Logs into the platform

2. Property Search
   •	User A lands on the Tenant Dashboard
   •	Uses search filters to specify preferences:
      - College proximity (e.g., Trinity College Dublin, UCD)
      - Budget range
      - Property type (shared room, private room, studio)
      - Amenities (WiFi, laundry, parking)
   •	Views properties on an interactive map with markers
   •	Clicks on property markers to see quick details

3. Property Details & Favorites
   •	User A clicks on a listing to view full details
   •	Reviews property images, description, amenities, and location
   •	Checks broker verification status (verified badge)
   •	Saves property to "Favorites" for later review
   •	Compares multiple properties from favorites list

4. Buddy Up - Finding Roommates
   •	User A navigates to "Buddy Up" section
   •	Completes roommate preference profile:
      - Budget range
      - Cleanliness level
      - Study habits (quiet hours, group study)
      - Lifestyle preferences (vegetarian, non-smoker, etc.)
   •	Browses potential roommate profiles with compatibility scores
   •	Initiates chat with compatible users (e.g., User B)
   •	Discusses expectations and decides to search together

5. Contacting Brokers
   •	User A finds a suitable property
   •	Clicks "Contact Broker" to initiate chat
   •	Sends message inquiring about availability, viewing schedule
   •	Receives real-time responses from the broker
   •	Schedules property viewing

6. AI Assistant Support
   •	User A clicks on the AI chatbot widget
   •	Asks questions about:
      - Neighborhood safety and amenities
      - Irish rental laws and tenant rights
      - Public transport options
      - Local attractions and facilities
   •	Receives instant, helpful responses

7. Ongoing Activities
   •	User A can view chat history with brokers
   •	Update search preferences anytime
   •	Manage favorites list
   •	Update profile information
   •	Log out securely

8.2 Broker Flow

Broker B (Landlord) Journey:

1. Registration & Verification
   •	Broker B visits StayNest and clicks "Sign Up"
   •	Enters email, password, and selects "Broker" as role
   •	Verifies email through OTP
   •	Completes broker profile with business details
   •	Logs into the platform

2. Identity Verification Submission
   •	Broker B navigates to "Verification" section
   •	Uploads identity document:
      - PPSN card (for Irish residents), OR
      - GNIB card (for international brokers)
   •	Submits document for admin review
   •	Receives notification: "Verification pending admin approval"

3. Awaiting Verification
   •	Broker B can create property listings but they remain in "Draft" status
   •	Listings are NOT visible to tenants until verification is approved
   •	Broker receives email notification when admin reviews the documents

4. Post-Verification (Approved)
   •	Admin approves Broker B's verification
   •	Broker B receives "Verified" badge on profile
   •	All draft listings automatically become "Active" and visible to tenants

5. Creating Property Listings
   •	Broker B clicks "Add New Listing"
   •	Fills in property details:
      - Title and description
      - Address (with Mapbox autocomplete)
      - Rent amount and deposit
      - Property type and room configuration
      - Amenities (checkboxes for WiFi, parking, etc.)
      - Availability date
   •	Uploads property images (multiple photos)
   •	Selects nearby colleges for proximity targeting
   •	Clicks "Publish Listing"

6. Managing Listings
   •	Broker B views all listings on "My Listings" dashboard
   •	Can edit listing details anytime
   •	Can mark listings as "Rented" or "Unavailable"
   •	Can delete outdated listings
   •	Views listing status: Active, Pending, or Rejected

7. Tenant Communication
   •	Broker B receives chat notifications when tenants inquire
   •	Opens chat inbox to view messages from interested tenants
   •	Responds to inquiries about property details, viewing times
   •	Schedules property viewings with potential tenants
   •	Maintains conversation history for reference

8. Ongoing Activities
   •	Monitor listing performance (views, inquiries)
   •	Update property availability
   •	Respond to tenant messages
   •	Renew or update verification documents if expired
   •	Log out securely

8.3 Admin Flow

Admin C Journey:

1. Admin Login
   •	Admin C accesses the platform with admin credentials
   •	Logs into the Admin Panel (restricted access)

2. Dashboard Overview
   •	Admin C views the admin dashboard showing:
      - Total number of users (Tenants and Brokers)
      - Total active listings
      - Pending broker verifications
      - Pending listing approvals
      - Recent platform activity

3. Broker Verification Review
   •	Admin C navigates to "Pending Verifications"
   •	Views list of brokers awaiting verification
   •	Clicks on Broker B's verification request
   •	Reviews uploaded documents (PPSN or GNIB):
      - Checks document clarity and readability
      - Verifies name matches broker account
      - Confirms document is valid and not expired
   •	Makes decision:
      - Approve: Broker gets verified badge, listings go live
      - Reject: Broker receives notification with rejection reason and can resubmit

4. Listing Management
   •	Admin C navigates to "All Listings"
   •	Reviews property listings for policy compliance:
      - Checks for inappropriate content
      - Verifies pricing is reasonable
      - Ensures images are appropriate
      - Confirms property details are complete
   •	Can approve, reject, or flag listings for review
   •	Can delete fraudulent or spam listings

5. User Management
   •	Admin C views all registered users (Tenants and Brokers)
   •	Can search users by name, email, or role
   •	Can view user activity and listing history
   •	Can suspend or deactivate accounts violating platform policies
   •	Can reset user passwords if requested

6. Platform Monitoring
   •	Admin C monitors chat activity for inappropriate behavior
   •	Reviews reported listings or users
   •	Analyzes platform usage statistics
   •	Identifies trends (popular colleges, price ranges)

7. Ongoing Activities
   •	Regularly review pending verifications
   •	Monitor new listings for quality control
   •	Respond to user support requests
   •	Update platform policies as needed
   •	Generate reports for platform performance
   •	Log out securely

9. File Structure Overview
The project is divided into three main directories:
•	Client: React frontend
•	Server: Node.js backend
•	Root: Cordova configuration and project metadata
Each feature is organized using a feature-based architecture for better maintainability and scalability.

9. Deployment Details
•	Backend deployed on Render
•	Frontend built using Vite
•	Mobile APK generated using Cordova
•	Environment variables securely managed using .env

10. How to Run the Project Locally
Prerequisites
•	Node.js (v18+)
•	Git
Steps
1.	Clone the repository
2.	Install backend dependencies and run the server
3.	Install frontend dependencies and start the client
4.	Update API base URL for local testing

11. Advantages of the System
•	Secure and verified rental platform
•	User-friendly interface
•	Real-time chat and updates
•	AI-based guidance for students
•	Scalable and modular architecture

12. Future Enhancements
•	Payment integration for booking fees
•	Advanced AI using NLP models
•	iOS mobile application support
•	Multi-city accommodation support
•	Recommendation system for listings

13. Project Conclusion
StayNest successfully addresses the challenges faced by students in finding safe and verified accommodation. By combining modern web technologies, real-time data handling, location intelligence, and AI assistance, the system provides a reliable and efficient solution for both students and landlords.
The project demonstrates strong practical application of full-stack development concepts and serves as a scalable foundation for future expansion.