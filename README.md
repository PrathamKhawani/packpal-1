# 🎒 PackPal — Ultra-Premium Travel Management Platform

**Live Link**: [https://packpal-1.vercel.app/](https://packpal-1.vercel.app/)

**PackPal** is a state-of-the-art, high-fidelity travel management application designed to streamline trip planning, team coordination, and expense tracking. Built with a focus on "Premium Aesthetics" and "Fluid UX," PackPal transforms the logistical headache of travel into a seamless, interactive experience.

---

## 🌟 Key Features

### 🎬 Cinematic 3D Authentication & Landing
- **Landing Page**: Apple-style scroll-driven 3D photo frames that tilt and animate as you scroll, showcasing features.
- **Login ("The Passport")**: A massive 3D passport rotates open on scroll, travel stamps burst out, and the login form elegantly rises.
- **Register ("The Globe")**: A 3D globe splits in half on scroll, real destination photos burst out, revealing the registration form.
- **SEO Optimized**: Fully structured JSON-LD schema, Open Graph tags, Twitter cards, and semantic HTML for #1 search ranking.

### 🚀 Ultra-Modern Bento Dashboard
- **Dynamic Hero**: High-resolution destination imagery that adapts to your trip.
- **Live Intelligence Feed**: Real-time updates on team activities, checklist progress, and weather alerts.
- **Trip DNA**: Visual radar charts analyzing your trip's vibe (Adventure vs. Relaxing).
- **Financial Health**: Real-time burn-rate tracking against your global budget.

### 🤖 Global AI Chatbot & Itinerary Planner
- **PackPal AI Assistant**: A persistent, context-aware AI chatbot available on every page, ready to answer travel and logistics questions instantly.
- **Gemini AI Integration**: Generate multi-day, cost-aware itineraries in seconds.
- **Interactive Route Map**: Powered by Leaflet, visualizing every activity and landmark on a live map.
- **Professional PDF Export**: One-click "Print Mode" for high-quality physical itinerary documents.

### 🌤️ Real-time Weather Engine
- **Open-Meteo Sync**: Automatic geocoding of destinations with 5-day temperature forecasts and live weather condition icons.

### 🔐 Strict Role-Based Access Control (RBAC)
- **Admin (Command Center)**: Supreme system overseer. Has exclusive access to Platform Analytics, System Logs, Secure Vault, and Risk Analysis, alongside all tactical planning modules.
- **Owner (Mission Control)**: Mid-level tactical leader. Focused purely on mission execution with access to Itinerary, Checklists, Expenses, and Tactical Briefs, without system-governance clutter.
- **Member**: Standard operator. Access to core collaboration tools (Dashboard, Itinerary, Checklists) for personal tracking.

### 💼 Smart Modules
- **Checklists**: Category-based packing lists with progress tracking.
- **Expense Tracker**: Multi-currency support with budget overhead visualization.
- **Document Vault**: Securely manage travel documents with role-based filtering.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (Modular Architecture)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Maps**: [Leaflet.js](https://leafletjs.com/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/)
- **Weather Data**: [Open-Meteo API](https://open-meteo.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Account
- Google AI (Gemini) API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PrathamKhawani/packpal-1.git
   cd packpal-1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 🧠 Architecture & In-Depth Knowledge

### 🛡️ Persistence Strategy
PackPal utilizes a **Hybrid Sync Engine**. Data is primarily persisted in **Supabase** for real-time collaboration. However, the app includes a **LocalStorage Fallback** layer to ensure responsiveness even during intermittent connectivity.

### 🎭 Role-Based Access Control (RBAC)
Access is managed via the `AppContext`. The UI dynamically renders sidebars and routes based on the `currentUser.role` property, ensuring that sensitive modules like the **Vault** and **Member Management** are strictly protected.

### 📡 AI Itinerary Generation
The application uses **Gemini 1.5 Flash/Pro** with **JSON Response Mode**. The backend processes natural language prompts into structured JSON containing activities, times, estimated costs, and geocoordinates (latitude/longitude) for map plotting.

### 🎨 Design System
The project follows a **Bento Grid** design philosophy, emphasizing modularity and information density without clutter. It uses a curated **HSL Color Palette** to support both sleek light and dark modes with high-contrast readability.

---

## 👨‍💻 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any features or bug fixes.

## 📄 License
This project is licensed under the MIT License.

---

*Crafted with ❤️ by the PackPal Team.*
