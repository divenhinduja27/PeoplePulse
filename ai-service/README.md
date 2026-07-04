# PeoplePulse Attrition Prediction AI Microservice

This directory contains a standalone, self-contained Python microservice that calculates employee attrition risk using a Random Forest classification model and generates qualitative recommendations using Google's Gemini API.

---

## 🚀 Setup & Execution Guide

Follow these quick steps to set up and run the service locally:

### 1. Install Dependencies
Ensure you have Python 3.9+ installed, then install the pinned libraries:
* `pip install -r requirements.txt`

### 2. Configure Environment Variables
* Copy the example environment template: `cp .env.example .env` (or copy/rename manually on Windows).
* Open the `.env` file and replace `your_key_here` with a valid Google AI Studio key:
  ```env
  GEMINI_API_KEY=AIzaSyD...
  ```
  *(Note: You can still test the ML prediction logic alone without setting this key, as the service handles fallback responses gracefully).*

### 3. Place the Dataset
* Place your Kaggle IBM HR Attrition CSV file under: `data/hr_attrition.csv`

### 4. Train the Model (Run Once)
Before booting the API, you must train and save the machine learning model:
* `python model/train_model.py`
* This script will load the CSV, train a `RandomForestClassifier` on select columns, print accuracy & sorted feature importances, and output the model binary to `model/attrition_model.pkl`.

### 5. Run the FastAPI Server
* Start the server locally: `uvicorn app.main:app --reload --port 8000`
* The API will now be listening on: `http://localhost:8000`

---

## 🧪 Testing the Service

### Verify Server Health
You can check if the API is active by making a GET request to `/health`:
```bash
curl http://localhost:8000/health
```
**Response:**
```json
{"status":"ok"}
```

### Run Attrition Prediction
Make a POST request to `/predict` with your employee's details:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "employee_name": "Jane Doe",
    "overtime_flag": 1,
    "years_at_company": 4.5,
    "distance_from_home": 12.0,
    "monthly_income": 4500.0
  }'
```
**Response:**
```json
{
  "risk_score": 68.3,
  "risk_category": "HIGH",
  "top_factors": ["OverTime", "MonthlyIncome"],
  "ai_insight": "Jane Doe shows high attrition risk primarily driven by high overtime hours and lower relative monthly income. We suggest schedule rebalancing or reviewing standard compensation structure to increase retention likelihood."
}
```

---

## 💡 How the Flow Works (Plain English)

Our service starts by loading the **IBM HR Attrition CSV** from the local files. Using this data, we select four highly relevant employee indicators (Overtime status, tenure at the company, commute distance, and monthly salary) to train a **Random Forest classifier**. This classifier evaluates historical patterns to map how these indicators correspond to employee attrition. Once trained, the model is serialized into a `.pkl` file. When the live FastAPI server receives a POST request containing an active employee's details, it feeds the values into the loaded model to predict the **probability of attrition** (risk score) and decides a risk category (LOW, MEDIUM, HIGH). Finally, the server gathers the top overall risk factors and passes this context to Google's **Gemini API** (`gemini-2.0-flash`), which returns a tailored, plain-English HR explanation and actionable suggestion to keep the employee engaged and retained.
