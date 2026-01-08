# 🌦️ Fidenz Weather App

A full-stack weather dashboard application that allows authenticated users to view weather analytics. Built with React (Vite) for the frontend and Node.js for the backend.

**Live Demo:** [ https://weather-analytics-application-1.onrender.com/ ]

## 🚀 Features

* **Secure Authentication:** User login and signup powered by **Auth0**.
* **Weather Dashboard:** View real-time weather data (City, Temperature, Humidity, Pressure).
* **Responsive Design:** Fully responsive UI built with Tailwind CSS.
* **Backend API:** Custom Node.js/Express server to handle data requests.

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Auth0 React SDK
* **Backend:** Node.js, Express.js
* **Deployment:** Render (Web Service & Static Site)

---

## ⚙️ Local Setup Instructions

Prerequisites: Ensure you have **Node.js** and **npm** installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/chithraka-kal/weather-analytics-application.git
cd weather-analytics-application
```

### 2. Backend Setup
Navigate to the server folder, install dependencies, and configure environment variables.

```bash
cd server
npm install
```

**Create a `.env` file in the `server` directory:**
You need your Auth0 credentials here.
```env
PORT=5000
AUTH0_AUDIENCE=https://weather-api.fidenz
AUTH0_ISSUER_BASE_URL=https://dev-s4ymymaa2dllrk3o.us.auth0.com/
OPENWEATHER_API_KEY="add OpenWeatherMap API key here"

```

**Start the Server:**
```bash
node index.js
# The server should run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the client folder, and install dependencies.

```bash
cd client
npm install
```

**Start the Frontend:**
```bash
npm run dev
# The app should be running at http://localhost:5173
```



---

## 📂 Project Structure

```text
├── client/         # React Frontend (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/         # Node.js Backend
│   ├── data/
│   ├── services/
│   ├── utils/
│   └── index.js
│   └── package.json
│
└── README.md
```
---

## 📐 Architecture & Design Decisions

### 1. Explanation of Comfort Index Formula
The application utilizes a **Penalty-Based Algorithm** to determine the "Comfort Index." 
The system assumes a "perfect" weather day starts with a score of **100**. Points are subtracted based on how far the current conditions deviate from defined ideal values. The final score is clamped between 0 and 100.

**The Formula:**
**Index = 100 – (P_temp + P_humidity + P_wind)**

**Where:**

* **P_temp** (Temperature Penalty): `|T_current – 24| × 2.0`
* **P_humidity** (Humidity Penalty): `|H_current – 50| × 0.5`
* **P_wind** (Wind Penalty): `|W_current – 3| × 0.2`

_The final result is clamped between 0 and 100._
### 2. Selection of Ideal Baselines
The "Ideal" values were selected based on standard human physiological comfort zones:

* **Ideal Temperature (24°C):** * *Target Range:* 22°C – 26°C.
    * *Justification:* 24°C represents the median of the standard "Thermal Comfort Zone" for a person in light clothing (common in tropical/temperate climates). Deviations from this midpoint trigger the highest penalties.
* **Ideal Humidity (50%):** * *Target Range:* 40% – 60%.
    * *Justification:* This is the optimal range for human health. Levels below 40% cause dryness/irritation, while levels above 60% inhibit sweat evaporation, making heat feel more oppressive.
* **Ideal Wind Speed (3.0 m/s):** * *Target Range:* 1 m/s – 5 m/s.
    * *Justification:* 3.0 m/s corresponds to a "Light Breeze" on the Beaufort scale. This provides sufficient air circulation for cooling without being disruptive or requiring protective clothing.

### 3. Reasoning Behind Variable Weights
The weights reflect the sensitivity of human comfort to each variable:

* **Temperature (Weight: 2.0):** Humans are endotherms; ambient temperature is the primary driver of physical comfort. A 5°C deviation (e.g., 29°C) is immediately noticeable and uncomfortable. This high weight ensures the score degrades rapidly if the temperature is unsafe.
* **Humidity (Weight: 0.5):** Humidity acts as a modifier. While high humidity makes heat worse, humans are generally tolerant of a wider range (30%-70%). A lower weight ensures humidity adjusts the score but doesn't dominate it unless extreme.
* **Wind Speed (Weight: 0.2):** Wind is secondary. Unless it is gale-force or dead calm in high heat, it has a minor impact on overall comfort compared to temperature.


### 3. Cache Design Strategy
To handle API rate limits and ensure fast response times for the leaderboard, I implemented a **Time-Based In-Memory Cache** using the `node-cache` library.

* **Caching Strategy:** "Cache-Aside" with Post-Processing.
* **TTL (Time-to-Live):** 5 minutes (300 seconds).
* **Mechanism:**
    1.  The server checks for a valid `weather_data_sorted` key in memory.
    2.  **If Hit:** Returns the pre-sorted, pre-ranked data immediately.
    3.  **If Miss:**
        * Fetches weather data for *all* cities in parallel (`Promise.all`).
        * Calculates the Comfort Index for every city.
        * Sorts the list by Comfort Index (descending).
        * Assigns ranks (1st, 2nd, etc.).
        * Stores this final processed list in the cache before returning it.

**Why this approach?**
By caching the *final processed list* rather than raw API responses, we eliminate the need to re-calculate scores and re-sort the array for every user request, significantly reducing CPU load and latency.

### 4. Trade-offs Considered

**1. In-Memory Cache (`node-cache`) vs. Distributed Cache (Redis)**
* **Decision:** I chose an in-memory solution using `node-cache`.
* **Trade-off:**
    * *Pros:* Zero latency (data is in RAM), no external infrastructure dependencies, and simplifies deployment on free-tier platforms like Render.
    * *Cons:* The cache is volatile (lost on server restart). If the application scales to multiple server instances, the caches would be out of sync.
* **Verdict:** Given the scope of this assignment and the single-instance deployment, `node-cache` is the most efficient and cost-effective choice.

**2. Bulk Fetching vs. Lazy Loading**
* **Decision:** The system fetches data for all cities defined in `cities.json` simultaneously using `Promise.all`.
* **Trade-off:**
    * *Pros:* Essential for generating an accurate "Leaderboard." We cannot rank cities correctly unless we have data for *all* of them at the same moment.
    * *Cons:* As the number of cities grows, this could hit OpenWeatherMap's rate limits or increase the initial "Cache Miss" latency.
* **Verdict:** Since the dataset is limited to a specific list of cities, bulk fetching ensures rank accuracy.

**3. Server-Side vs. Client-Side Sorting**
* **Decision:** Sorting and ranking are performed on the backend.
* **Trade-off:**
    * *Pros:* Ensures business logic consistency. Every client (web, mobile, API consumer) sees exactly the same ranking without implementing their own sort logic.
    * *Cons:* Increases server CPU usage slightly.
* **Verdict:** Centralizing the logic on the server reduces complexity on the frontend and ensures a "Single Source of Truth."

### 5. Known Limitations

* **Volatile Cache:** Since the application uses in-memory caching (`node-cache`), restarting the server or deploying a new version will clear all cached weather data. The first request after a restart will always trigger a fresh API fetch.
* **Scalability of "Bulk Fetching":** The current implementation fetches weather for all cities simultaneously (`Promise.all`). If the city list grows significantly (e.g., to 100+ cities), this approach might hit OpenWeatherMap's concurrency limits or cause timeouts. Pagination or batching would be required for a larger dataset.
* **API Rate Limits:** The application is strictly bound by the OpenWeatherMap Free Tier limits (60 calls/minute). High traffic combined with a cache expiry lower than 5 minutes could lead to `429 Too Many Requests` errors.

---

## 🔍 Debugging & Verification

To assist with testing and verification of the caching mechanism, a dedicated debug endpoint is available.

**Endpoint:** `GET /api/weather/debug`

**Response:**
This endpoint returns the current status of the internal cache, including hits, misses, and the number of keys stored.

```json
{
  "status": "Cache Active",
  "stats": {
    "hits": 12,
    "misses": 4,
    "keys": 1,
    "ksize": 1500,
    "vsize": 4200
  }
}
```



## 🧪 Running Tests - Unit tests for the Comfort Index function (Jest)

To run the test suite:

```bash
# Navigate to the relevant folder (client or server)
cd server
npm test
```

---
## 👥 Authors

* **Chithraka Kalanamith** - *Developer* 