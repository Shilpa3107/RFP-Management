# AI-Powered RFP Management System

An AI-driven web application that automates the complete Request for Proposal (RFP) workflow — from generating RFPs to parsing vendor responses and comparing proposals.

---

## 🚀 Features

- **Natural Language → RFP**  
  Convert plain English requirements into structured RFP documents using AI.

- **Vendor Management**  
  Add, view, and manage vendor details.

- **Email Integration (Mock/Ethereal)**  
  Send RFPs to vendors and simulate incoming email responses.

- **AI-Based Parsing**  
  Extract pricing, timelines, and terms from unstructured vendor emails.

- **AI Proposal Comparison**  
  Compare multiple vendor proposals side-by-side with smart recommendations.

---

## 🛠 Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Lucide Icons  
**Backend:** Node.js, Express, Sequelize (PostgreSQL)  
**AI:** Gemini API (Mock mode supported)  
**Email:** Nodemailer (Ethereal/Mock)

---

## 📦 Setup Instructions

### 1. Prerequisites

- Node.js **v18+**  
- MySQL database instance

---

## 🔧 Backend Setup

1. Go to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Copy .env.example → .env
   - Set your DATABASE_URL
   - Add GEMINI_API_KEY (optional — mock mode enabled if missing)

4. Start the server:
```bash
npm start
```

5. Backend runs at http://localhost:3000 and auto-syncs the database.

## 🎨 Frontend Setup
1. Navigate to the frontend:

```bash
cd frontend
```
2. Install dependencies:

```bash
npm install
```

3.Run the dev server:

```bash
npm run dev
```
4. Access the UI at http://localhost:5173.

### 🧪 Demo Walkthrough
1. Create RFP
Go to New RFP, enter a requirement (e.g., “10 laptops for engineering team”), click Generate, then save.

2. Add Vendors
Open Vendors and add sample vendor entries.

3. Send RFP
From the RFP details page → choose vendors → Send RFP via Email.

4. Simulate Proposal
Go to Proposals → Simulate Incoming Email → select RFP + Vendor → Receive & Parse.

5. Compare Proposals
Return to the RFP details → click Compare Proposals to view the AI comparison.

### 📘 API Documentation

#### RFP
 - POST /api/rfp/generate – Generate structured RFP from text prompt
 - POST /api/rfp – Create new RFP
 - GET /api/rfp/:id – Fetch RFP details
 - POST /api/rfp/:id/send – Send RFP to selected vendors
 - GET /api/rfp/:id/compare – AI-based proposal comparison

#### Vendors
- GET /api/vendors – List vendors
- POST /api/vendors – Create vendor

#### Proposals
- POST /api/proposals/ingest – Parse incoming email
- GET /api/proposals – List all proposals

#### 🗂 Data Models
- RFP
- Title
- Original prompt
- Structured JSON
- Status

#### Vendor
- Name
- Email
- Contact
- Metadata

#### Proposal
 - Linked RFP ID
 - Linked Vendor ID
 - Raw email text
 - Parsed JSON
 - AI comparison analysis

### 🤖 AI Integration

- Model: Gemini API
- Workflows:
   - Generate structured RFP JSON
   - Parse email text for pricing, timelines, terms
   - Compare proposals and provide recommendations
- Mock Mode:
   - Auto-enabled when API key is not provided.

### ⚠️ Known Limitations / Future Enhancements

No authentication (single-user mode)

Email reception is simulated — full IMAP support planned

No attachment parsing — PDF/doc parsing will be added later

