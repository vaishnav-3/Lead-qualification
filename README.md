
# 🚀 Lead Qualification Backend Service

## 📌 Overview

This project is built as part of the **Backend Engineer Hiring Assignment**.
The goal is to create a backend service that:

* Accepts **Product/Offer details**
* Accepts a **CSV of leads**
* Scores each lead’s **buying intent (High / Medium / Low)** using **rule-based logic + AI reasoning**
* Returns the final results through REST APIs

This is similar to how modern CRMs and sales platforms (like HubSpot, Outreach, Apollo) qualify leads, enabling sales teams to focus on the best prospects.

---

## 🎯 Features

✅ **Offer Management**

* `POST /api/offer` → Add product/offer details
* `GET /api/offer` → View current offer

✅ **Lead Management**

* `POST /api/leads/upload` → Upload CSV of leads
* `GET /api/leads` → View all uploaded leads

✅ **Scoring Pipeline**

* `POST /api/score` → Score leads using rules + AI reasoning

✅ **Results**

* `GET /api/results` → Fetch all scoring results
* `GET /api/export` → Export results as CSV

✅ **Utilities**

* `GET /health` → Health check endpoint

---

## 🛠️ Tech Stack

* **Backend Framework**: Node.js + Express (REST API development)
* **AI Integration**: Google Gemini API (for AI reasoning)
* **Database**: Postgres with Drizzle ORM
* **File Handling**: Multer (CSV upload) + csv-parser
* **Deployment**: Render
* **Optional**: Docker for containerization

---

## ⚙️ Setup Instructions

1. **Clone Repo**

```bash
git clone https://github.com/your-repo.git
cd your-repo
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Variables**
   Create a `.env` file:

```
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the Server**

```bash
npm run dev
```

Server will run at: **[http://localhost:8000](http://localhost:8000)**

---

## 🧪 API Testing

We’ve provided a ready-to-use **Postman collection** for testing:
👉 [Postman Collection Link](https://.postman.co/workspace/My-Workspace~beecabe3-57b0-450b-896e-a812dcfdd182/collection/44508653-aaf63673-9198-450a-9adc-1e9c32f6718f?action=share&creator=44508653&active-environment=44508653-619a9e74-9ba3-4f6d-9168-68e419f56981)

### 📋 Testing Guide

#### 1. Create Offer

**POST** `/api/offer`

```json
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings", "Automated follow-ups"],
  "ideal_use_cases": ["B2B SaaS mid-market", "Sales teams", "Growth companies"]
}
```

#### 2. Get Current Offer

**GET** `/api/offer`

#### 3. Upload Leads (CSV)

**POST** `/api/leads/upload` → Upload file in `form-data` with key `file`.
Sample CSV:

```csv
name,role,company,industry,location,linkedin_bio
John Doe,CEO,TechCorp,SaaS,San Francisco,Tech leader with 10 years experience in B2B software
Jane Smith,VP Sales,DataCorp,Software,New York,Sales expert specializing in mid-market growth
Mike Johnson,Head of Growth,StartupXYZ,Technology,Austin,Growth hacker focused on B2B SaaS scaling
```

#### 4. Get All Leads

**GET** `/api/leads`

#### 5. Score Leads (Main Function)

**POST** `/api/score`

* Uses **Gemini AI** → Make sure `GEMINI_API_KEY` is set

#### 6. Get Results

**GET** `/api/results`
Returns:

```json
[
  {
    "name": "Ava Patel",
    "role": "Head of Growth",
    "company": "FlowMetrics",
    "intent": "High",
    "score": 85,
    "reasoning": "Fits ICP SaaS mid-market and role is decision maker."
  }
]
```

#### 7. Export Results

**GET** `/api/export` → Downloads CSV

#### 8. Health Check

**GET** `/health`

---

## ⚡ Rule Logic Recap

* **Role Relevance**: Decision maker (+20), Influencer (+10), else 0
* **Industry Match**: Exact ICP (+20), Adjacent (+10), else 0
* **Data Completeness**: All fields present (+10)
* **AI Score**: High=50, Medium=30, Low=10
* **Final Score** = Rule Score + AI Score

---

## 📦 Deployment

The service is deployed on **[insert platform: Render / Railway / Vercel / Heroku]**.
Live API Base URL:

```
https://lead-qualification-4g36.onrender.com/health
```

---

## 🧑‍💻 Author

Built as part of the Backend Engineer Hiring Assignment.

---
