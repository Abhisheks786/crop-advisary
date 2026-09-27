# 🌾 Smart Crop Advisory & Resource Planner

> AI-Assisted Rural Crop Planning, Irrigation & Resource Management System

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Features](#features)
4. [System Architecture](#system-architecture)
5. [Technology Stack](#technology-stack)
6. [Folder Structure](#folder-structure)
7. [Installation](#installation)
8. [Environment Variables](#environment-variables)
9. [Database Setup](#database-setup)
10. [Redis Setup](#redis-setup)
11. [Demo Mode](#demo-mode)
12. [API Documentation](#api-documentation)
13. [Recommendation Algorithm](#recommendation-algorithm)
14. [Dataset Structure](#dataset-structure)
15. [Irrigation Planner](#irrigation-planner)
16. [Crop Rotation Engine](#crop-rotation-engine)
17. [Resource Planner](#resource-planner)
18. [Background Jobs](#background-jobs)
19. [Caching Strategy](#caching-strategy)
20. [Testing](#testing)
21. [Demo Credentials](#demo-credentials)
22. [Sample User Flow](#sample-user-flow)
23. [Deployment Instructions](#deployment-instructions)
24. [Known Limitations](#known-limitations)
25. [Future Improvements](#future-improvements)

---

## 📖 Project Overview

The **Smart Crop Advisory & Resource Planner** is a comprehensive web application designed to help farmers and agricultural officers make informed crop-planning decisions. The system uses a **scoring-based recommendation engine** that analyzes multiple factors to suggest the most suitable crops for given conditions.

Unlike simple CRUD applications, this project features:
- A **deterministic, explainable recommendation engine** with weighted multi-factor scoring
- An **irrigation planning module** with stage-wise scheduling
- A **crop rotation engine** that considers soil health and seasonal compatibility
- A **resource planning module** with cost estimation
- **Demo mode** that works entirely offline with JSON datasets
- **Background jobs** for seasonal recalculation
- **Redis caching** with graceful fallback

---

## 🎯 Problem Statement

Farmers often make crop-planning decisions without having enough information about:
- Which crop is suitable for their soil type and pH
- What was grown previously and its impact on soil
- How much water is available vs. required
- Which crops should be rotated for soil health
- How frequently and how much to irrigate
- What inputs/resources are required and their costs
- Which crop provides the best balance between suitability, water consumption, and expected yield

This system accepts basic farm information and provides **practical, explainable crop recommendations** along with an irrigation schedule and resource plan.

---

## ✨ Features

### For Farmers
- 🌱 **Multi-step Farm Input Form** - Easy-to-use wizard for entering farm details
- 📊 **Explainable Crop Recommendations** - Every recommendation comes with a detailed reasoning breakdown
- 💧 **Irrigation Planning** - Stage-wise irrigation schedule with water balance analysis
- 🔄 **Crop Rotation Suggestions** - Smart rotation recommendations for soil health
- 📦 **Resource Planning** - Estimated seeds, fertilizer, labour, and cost requirements
- 📈 **Comparison Tool** - Side-by-side comparison of recommended crops
- 📜 **History** - View past recommendations

### For Admins
- 🎛️ **Dashboard** - System-wide statistics and analytics
- ✏️ **Crop Management** - Add, edit, delete crop data
- ⚖️ **Scoring Weights** - Adjust recommendation algorithm weights
- 📉 **Analytics** - Regional statistics, popular crops, usage patterns

### System Features
- 🔒 **JWT Authentication** with role-based access
- 🗄️ **Demo Mode** - Full functionality without MongoDB/Redis
- ⚡ **Redis Caching** with graceful fallback
- 🔄 **Background Jobs** for seasonal updates
- 📱 **Mobile Responsive** design
- 🛡️ **Error Handling** with graceful degradation

---

## 🏗️ System Architecture

```
              FARM INPUT
                  │
                  ▼
       ┌─────────────────────┐
       │ Data Validation     │
       └──────────┬──────────┘
                  ▼
       ┌─────────────────────┐
       │ Recommendation      │
       │ Engine              │
       │                     │
       │ Soil       25%      │
       │ Season     20%      │
       │ Water      20%      │
       │ pH         10%      │
       │ Rotation   10%      │
       │ Temp       10%      │
       │ Rainfall    5%      │
       └──────────┬──────────┘
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
CROP RECOMMENDATION     WATER PLANNER
       │                     │
       ▼                     ▼
ROTATION PLANNER       RESOURCE PLANNER
       │                     │
       └──────────┬──────────┘
                  ▼
           FINAL FARM PLAN
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, Tailwind CSS 4, React Router 6, Recharts, Lucide React, Axios |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB 7 (with Mongoose ODM) |
| Caching | Redis (optional) |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |
| Testing | Jest |

---

## 📁 Folder Structure

```
smart-crop-advisory/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # ProtectedRoute, DemoModeBanner
│   │   │   ├── Dashboard/      # StatsGrid, Charts
│   │   │   ├── Irrigation/     # IrrigationSchedule, WaterBalance
│   │   │   ├── Layout/         # MainLayout, Sidebar, Header
│   │   │   ├── Recommendation/ # CropCard, ScoreDisplay, ReasoningList, ComparisonTable
│   │   │   ├── Resource/       # ResourceCard, CostBreakdown
│   │   │   ├── Rotation/       # RotationFlow
│   │   │   └── UI/             # Card, Button, Input, Select, Modal, DataTable, etc.
│   │   ├── hooks/              # useAuth, useForm
│   │   ├── pages/              # Dashboard, RecommendationForm, Results, etc.
│   │   ├── services/           # API service modules
│   │   ├── utils/              # Constants, formatters, validators
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/                 # db.js, redis.js, scoring.js
│   ├── controllers/            # Auth, Recommendation, Crop, Region, etc.
│   ├── data/                   # JSON datasets (crops, soils, regions, etc.)
│   ├── jobs/                   # Background jobs
│   ├── middleware/             # auth, adminAuth, errorHandler, validateRequest
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Express routes
│   ├── services/               # Core business logic
│   │   ├── RecommendationService.js  # ⭐ Core scoring engine
│   │   ├── IrrigationService.js
│   │   ├── RotationService.js
│   │   ├── ResourceService.js
│   │   └── DemoDataService.js
│   ├── tests/                  # Jest tests
│   ├── utils/                  # Helpers, seed script
│   ├── package.json
│   └── server.js
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- MongoDB 7+ (optional - Demo mode works without it)
- Redis (optional - caching is disabled without it)

### Steps

1. **Clone the repository**
```bash
git clone <repo-url>
cd smart-crop-advisory
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**
```bash
cd ../
cp .env.example backend/.env
```

Edit `backend/.env` with your settings.

5. **Seed the Database** (optional - only if using MongoDB)
```bash
cd backend
npm run seed
```

6. **Start the Backend**
```bash
cd backend
npm run dev
```

7. **Start the Frontend** (in a new terminal)
```bash
cd frontend
npm run dev
```

8. Open `http://localhost:3000` in your browser.

---

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-crop-advisory` |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DEMO_MODE` | Enable demo mode | `false` |

---

## 🗄️ Database Setup

### Using MongoDB
1. Install and start MongoDB
2. Set `MONGO_URI` in `.env`
3. Run `npm run seed` to populate sample data

### Without MongoDB (Demo Mode)
Set `DEMO_MODE=true` in `.env` or simply don't configure MongoDB. The application will automatically fall back to demo mode using JSON datasets.

---

## 🔴 Redis Setup

### With Redis
1. Install and start Redis
2. Set `REDIS_URL` in `.env`
3. Caching will be automatically enabled

### Without Redis
No setup needed. The application gracefully operates without Redis - caching is simply disabled.

---

## 🎮 Demo Mode

Demo mode allows the application to run fully without MongoDB or Redis.

When active:
- Data is loaded from JSON files in `backend/data/`
- Recommendations are stored in-memory
- Authentication uses pre-configured demo users
- A yellow banner indicates "Demo Mode — Using Offline Dataset"

To enable: Set `DEMO_MODE=true` in `.env` or let MongoDB connection fail (automatic fallback).

---

## 📡 API Documentation

### Authentication

#### POST /api/auth/register
Register a new user.
```json
// Request
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer"
}
// Response
{
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "John Farmer", "email": "john@example.com", "role": "farmer" }
}
```

#### POST /api/auth/login
```json
// Request
{ "email": "farmer@demo.com", "password": "password" }
// Response
{ "token": "eyJhbGciOi...", "user": { ... } }
```

#### GET /api/auth/me
Get current user profile. Requires Bearer token.

### Recommendations

#### POST /api/recommendations
Generate crop recommendations.
```json
// Request
{
  "soilType": "Loamy",
  "soilPH": 6.8,
  "previousCrop": "Rice",
  "waterAvailability": "Medium",
  "season": "Rabi",
  "landArea": 5,
  "landUnit": "acres",
  "irrigationMethod": "Flood",
  "state": "Punjab",
  "district": "Ludhiana",
  "temperature": 20,
  "rainfall": "Medium"
}
// Response
{
  "recommendations": [
    {
      "crop_name": "Wheat",
      "suitability_score": 89,
      "suitability_label": "Highly Suitable",
      "risk_level": "Low",
      "water_requirement": "Medium",
      "crop_duration": 120,
      "expected_yield": 45,
      "reasoning": [
        { "factor": "Soil Type", "score": 100, "weight": 0.25, "status": "positive", "message": "Loamy soil is suitable for Wheat" },
        { "factor": "Season", "score": 100, "weight": 0.20, "status": "positive", "message": "Rabi season is suitable for Wheat" },
        ...
      ],
      "warnings": [],
      "status": "recommended"
    },
    ...
  ],
  "total_crops_analyzed": 14,
  "generated_at": "2024-01-15T10:30:00Z"
}
```

#### GET /api/recommendations
Get user's recommendation history.

#### GET /api/recommendations/:id
Get specific recommendation.

### Crops

#### GET /api/crops
Get all crops.

#### GET /api/crops/:id
Get specific crop.

#### POST /api/crops (Admin)
Add new crop.

#### PUT /api/crops/:id (Admin)
Update crop.

#### DELETE /api/crops/:id (Admin)
Delete crop.

### Regions

#### GET /api/regions
Get all regions.

#### GET /api/regions/:state
Get regions by state.

### Irrigation

#### POST /api/irrigation/calculate
```json
// Request
{
  "crop_name": "Wheat",
  "landArea": 5,
  "landUnit": "acres",
  "waterAvailability": "Medium",
  "irrigationMethod": "Flood",
  "season": "Rabi"
}
// Response
{
  "crop_name": "Wheat",
  "total_water_required_liters": 320000,
  "water_available_liters": 300000,
  "water_status": "Slight Deficit",
  "schedule": [...],
  "critical_stages": ["Crown Root Initiation", "Flowering"],
  "warnings": []
}
```

### Rotation

#### POST /api/rotation/recommend
```json
// Request
{ "currentCrop": "Wheat", "previousCrop": "Rice", "season": "Rabi", "soilType": "Loamy" }
// Response
{
  "rotation_sequence": ["Rice", "Wheat", "Chickpea"],
  "suggested_next": [...],
  "compatibility": "Excellent"
}
```

### Dashboard

#### GET /api/dashboard/statistics
Get dashboard statistics.

#### GET /api/dashboard/recent
Get recent recommendations.

### Admin

#### GET /api/admin/statistics
Detailed admin statistics.

#### GET /api/admin/scoring-weights
Get current recommendation scoring weights.

#### PUT /api/admin/scoring-weights
Update scoring weights.

---

## 🧮 Recommendation Algorithm

The recommendation engine calculates a weighted suitability score for each crop:

| Factor | Weight | Description |
|--------|--------|-------------|
| Soil Type | 25% | Compatibility of input soil with crop's suitable soils |
| Season | 20% | Match between current season and crop's growing seasons |
| Water | 20% | Available water vs. crop's water requirement |
| Soil pH | 10% | Input pH within crop's optimal pH range |
| Crop Rotation | 10% | Compatibility with previously grown crop |
| Temperature | 10% | Temperature within crop's optimal range |
| Rainfall | 5% | Rainfall adequacy for the crop |

**Score Formula:**
```
total_score = (soil × 0.25) + (season × 0.20) + (water × 0.20) + (ph × 0.10) + (rotation × 0.10) + (temp × 0.10) + (rainfall × 0.05)
```

Each factor is scored 0-100, then weighted. The final score determines the recommendation label:
- **≥ 70%**: Recommended (Highly Suitable / Suitable)
- **50-69%**: Possible (Moderately Suitable)
- **< 50%**: Not Recommended

---

## 📊 Dataset Structure

### crops.json
14 Indian crops with attributes: name, seasons, suitable soils, pH range, water requirement, irrigation stages, temperature range, rainfall needs, rotation compatibility, yield, fertilizer, labour, cost, risk level.

### soils.json
7 soil types: Sandy, Loamy, Clay, Sandy Loam, Clay Loam, Black Soil, Alluvial Soil.

### regions.json
15+ Indian agricultural regions with climate data, soil types, major crops.

### irrigation.json
5 irrigation methods with efficiency ratings and suitability.

### crop_rotation.json
Rotation rules for all 14 crops with good/bad predecessors and successors.

---

## 💧 Irrigation Planner

Calculates stage-wise irrigation schedule based on:
- Crop's irrigation stages
- Land area
- Irrigation method efficiency
- Water availability

Shows water balance (surplus/deficit), critical stages, and alternative crops if water is insufficient.

---

## 🔄 Crop Rotation Engine

Recommends next crops considering:
- Previous crop compatibility
- Soil health impact
- Nitrogen fixation benefit
- Season compatibility
- Category diversity (cereal → legume → oilseed)

---

## 📦 Resource Planner

Estimates requirements per land area:
- Seeds (kg)
- Water (liters)
- Fertilizer (kg by type)
- Labour (worker-days)
- Total cost (₹)
- Expected yield (quintals)

---

## ⏰ Background Jobs

### Seasonal Recalculation
Recalculates regional recommendations when seasons change.

### Statistics Update
Aggregates system-wide analytics and caches results.

---

## ⚡ Caching Strategy

- **Cache Key**: `recommendation:<region>:<soil>:<season>:<water>`
- **TTL**: 1 hour for recommendations, 30 minutes for statistics
- **Invalidation**: On crop data changes, seasonal recalculation, admin updates
- **Fallback**: System operates normally without Redis

---

## 🧪 Testing

Run tests:
```bash
cd backend
npm test
```

Test cases:
1. Suitable soil + season → high score
2. Wrong soil → lower score
3. Insufficient water → warnings
4. Incompatible previous crop → rotation penalty
5. Invalid pH → pH penalty
6. No matching crop → graceful handling
7. Same input → deterministic results
8. Reasoning generated for all crops
9. Temperature affects scoring
10. Scores bounded 0-100

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Farmer | farmer@demo.com | password |
| Admin | admin@demo.com | password |

---

## 🚶 Sample User Flow

1. Login as `farmer@demo.com`
2. Click "Get Crop Recommendation"
3. Enter: Punjab, Loamy, pH 6.8, Previous: Rice, Water: Medium, 5 acres, Rabi
4. Submit → See Wheat (89%), Mustard (82%), Chickpea (78%)
5. Click Wheat → See detailed reasoning
6. View irrigation schedule
7. View resource plan
8. See rotation: Rice → Wheat → Chickpea

---

## 🚀 Deployment Instructions

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
# Serve them with Express or a static file server
```

### Environment
- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Configure production MongoDB URI
- Configure Redis for caching

---

## ⚠️ Known Limitations

1. Dataset is focused on Indian agriculture — may not be accurate for other regions
2. Recommendation engine uses rule-based scoring, not machine learning
3. Weather data is user-input, not from live weather APIs
4. Demo mode stores data in-memory (lost on server restart)
5. Background jobs use simple timers, not a production job queue
6. Crop data is sample data — should be validated by agricultural experts

---

## 🔮 Future Improvements

1. **Live Weather Integration** - OpenWeatherMap API for real-time data
2. **Machine Learning** - Train models on historical yield data
3. **Market Prices** - Integrate crop market prices for ROI analysis
4. **Multilingual Support** - Hindi, Tamil, Telugu, Punjabi, etc.
5. **SMS Notifications** - Irrigation reminders via SMS
6. **Satellite Imagery** - NDVI analysis for soil health
7. **Government Schemes** - Link relevant subsidy/scheme information
8. **Community Features** - Farmer forums and knowledge sharing
9. **Mobile App** - React Native companion app
10. **Offline PWA** - Progressive Web App for no-connectivity areas

---

## 📄 License

MIT License

---

**Built as a Capstone Project** — Demonstrating full-stack development, scoring-based recommendation engine, resource planning, and agricultural technology.
