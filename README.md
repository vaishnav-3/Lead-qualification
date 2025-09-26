# 🚀 Lead Qualification Backend Service

## 📌 Overview

This project is built as part of the **Backend Engineer Hiring Assignment**.
The goal is to create a backend service that:

* Accepts **Product/Offer details**
* Accepts a **CSV of leads**
* Scores each lead’s **buying intent (High / Medium / Low)** using **rule-based logic + AI reasoning**
* Returns the final results through REST APIs

This mimics modern CRMs and sales platforms (like HubSpot, Outreach, Apollo), enabling sales teams to focus on the best prospects.

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
* **Containerization**: Docker

---

## ⚙️ Setup Instructions (Local)

1. **Clone Repo**

```bash
git clone https://github.com/vaishnav-3/Lead-qualification
cd Lead-qualification
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
DATABASE_URL=postgres://username:password@your-neon-endpoint:5432/dbname
```

4. **Run the Server**

```bash
npm run dev
```

Server will run at: **[http://localhost:8000](http://localhost:8000)**

---

## 🐳 Docker Setup

### 1. Build Docker Image

```bash
docker build -t lead-qualification-backend .
```

### 2. Run Container

```bash
docker run -p 8000:8000 \
  -e GEMINI_API_KEY="your_gemini_api_key_here" \
  -e DATABASE_URL="postgres://username:password@your-neon-endpoint:5432/dbname" \
  lead-qualification-backend
```

* Server will run inside Docker and be accessible at: `http://localhost:8000`


### 3. Optional: Use `.env` File

Create `.env`:

```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgres://username:password@your-neon-endpoint:5432/dbname
PORT=8000
```

Run Docker using:

```bash
docker run --env-file .env -p 8000:8000 lead-qualification-backend
```

---

## 🧪 API Testing

We’ve provided a ready-to-use **Postman collection** for testing:
👉 [Postman Collection Link](https://www.postman.com/workspace/My-Workspace~beecabe3-57b0-450b-896e-a812dcfdd182/collection/44508653-aaf63673-9198-450a-9adc-1e9c32f6718f?action=share&source=copy-link&creator=44508653)

Follow the **Testing Guide** (Create Offer → Upload Leads → Score → Results → Export CSV → Health check).

---

## 📦 Deployment

The service can be deployed:

* **Render** → Live API URL: `https://lead-qualification-4g36.onrender.com/health`
* **Docker** → Run anywhere (local, cloud, or container platforms)

---

## 🧑‍💻 Author

Built as part of the Backend Engineer Hiring Assignment.


