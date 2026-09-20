# Thee-Hemp-Company
Pittsburgh Dispensary - POS Omnichannel Platform & Mobile Application
A mobile-first omnichannel pickup reservation system and backend POS middleware designed specifically for Pittsburgh Dispensary. This platform bridges real-time inventory management with compliant customer verification to increase point-of-sale (POS) conversion rates.
🚀 Business Pitch: Maximizing POS Conversion & Growth
Executive Summary
Medical dispensaries and legal adult-use retailers face significant hurdles on social media, notably Meta’s strict prohibitions against direct product sales, checkout features, and paid advertising for cannabis products.
This platform converts social media engagement into completed orders by driving traffic off restricted channels into a compliant, high-converting digital portal.
Key Value Pillars
Meta-Compliant Funnel: Drive traffic from Instagram, Facebook, and local digital marketing directly into a custom Progressive Web App (PWA) / mobile application, bypassing platform social selling bans while maintaining brand visibility.
Dual-Path Identity Verification: Increases overall conversion by supporting both 21+ Adult-Use (Government ID / Driver's License) and PA Medical Marijuana Cardholders in a single checkout flow.
BioTrack POS Real-Time Sync: Eliminates double-selling and manual menu management. Inventory auto-syncs every 5 minutes directly with the BioTrack inventory system.
Frictionless Mobile Ordering: Instant pickup reservations reduce wait times in-store, boosting throughput during peak hours and lifting average order value (AOV) via smart upsell prompts.
🛠️ System Architecture
Frontend: React Native / Expo (Mobile Client & PWA support)
Backend: Node.js & Express API Gateway
POS Integration: BioTrack THC API Service (Lot-level 16-digit barcode sync)
Automation: node-cron scheduled background inventory polling (5-minute cache refresh)
Security & Compliance: Dual verification middleware for age (21+) and PA Medical Card validity.
📁 Repository Structure
pittsburgh-dispensary-pos/
├── client/                     # React Native / Expo Mobile App
│   ├── App.js                  # Main Menu & Pickup Reservation UI
│   └── package.json            # Client dependencies
│
└── server/                     # Node.js Express API Server
   ├── server.js               # Express application entry point
   ├── biotrackService.js      # BioTrack POS integration module
   ├── cronSync.js             # 5-minute background inventory polling task
   ├── posSyncMiddleware.js    # 21+ Age & Medical Card verification middleware
   ├── package.json            # Server dependencies
   └── .env                    # Environment variables configuration
⚙️ Setup & Installation Instructions
Prerequisites
Node.js (v18 or higher)
Git
1. Clone the Repository
git clone https://github.com/YOUR-USERNAME/pittsburgh-dispensary-pos.git
cd pittsburgh-dispensary-pos
2. Configure & Run the Backend API (server/)
cd server
npm install
Create a .env file in the server/ directory with the following variables:
PORT=5000
BIOTRACK_API_URL=https://api.biotrackthc.net/v1
BIOTRACK_USERNAME=your_biotrack_username
BIOTRACK_PASSWORD=your_biotrack_password
BIOTRACK_LICENSE=your_pa_license_number
Start the API server:
# Development Mode
npm run dev

# Production Mode
npm start
3. Configure & Run the Mobile Client (client/)
cd ../client
npm install
npx expo start
🔐 Compliance & Policy Guidelines
Meta Policy Compliance: Never link Facebook/Instagram social ads directly to checkout screens. All marketing links must point to educational landing pages or the app entry portal.
PA Legal Compliance: Age verification (21+ State ID) or active PA MMJ Card verification is mandatory prior to reserving orders. Final state database check and physical ID verification must occur in-person at the point of sale during pickup.
