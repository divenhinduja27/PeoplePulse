from contextlib import asynccontextmanager
import os
import joblib
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import EmployeeFeatures, RiskPrediction
from app.gemini_client import generate_insight

# Global reference variables loaded at startup
model = None
top_factors = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan manager. Handles server startup and shutdown hooks.
    Loads the Random Forest model artifact and calculates global feature importances once.
    """
    global model, top_factors
    
    # Construct absolute model path relative to app folder
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "model", "attrition_model.pkl")
    
    print(f"[*] Lifespan startup: Loading model from {model_path}")
    if os.path.exists(model_path):
        try:
            model = joblib.load(model_path)
            
            # Feature order in training: ["OverTime", "YearsAtCompany", "DistanceFromHome", "MonthlyIncome"]
            features = ["OverTime", "YearsAtCompany", "DistanceFromHome", "MonthlyIncome"]
            importances = model.feature_importances_
            
            # Zip and sort features in descending order of importance
            feature_importance_list = sorted(
                zip(features, importances), key=lambda x: x[1], reverse=True
            )
            # Select top 2 factors
            top_factors = [feat for feat, _ in feature_importance_list[:2]]
            
            print(f"[+] Model loaded successfully.")
            print(f"[+] Top factors calculated: {top_factors}")
        except Exception as e:
            print(f"[!] Error loading model artifact: {e}")
    else:
        print("[!] Warning: attrition_model.pkl not found. Please train the model using 'python model/train_model.py' first.")
        
    yield
    print("[*] Lifespan shutdown: Cleaning up resources.")


# Initialize FastAPI app with lifespan handler
app = FastAPI(
    title="PeoplePulse AI Prediction Service",
    description="Standalone Python microservice predicting employee attrition risk using scikit-learn and Google Gemini.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for cross-origin frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """
    Simple health check endpoint used by the Spring Boot backend 
    to confirm service status before invoking predictions.
    """
    return {"status": "ok"}


@app.post("/predict", response_model=RiskPrediction, status_code=status.HTTP_200_OK)
def predict_attrition_risk(employee: EmployeeFeatures):
    """
    Evaluates attrition risk for a given employee profile.
    
    Steps:
    1. Verify model is loaded.
    2. Build feature vector matching training order.
    3. Generate attrition probability using RandomForest.
    4. Categorize risk range (LOW, MEDIUM, HIGH).
    5. Query Gemini LLM to create plain-English qualitative suggestions.
    """
    global model, top_factors
    
    # Ensure model exists in memory before execution
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Attrition prediction model is currently not available. Please ensure model/train_model.py has been run."
        )
        
    try:
        # Build feature vector in the exact training sequence:
        # Index 0: OverTime (0 or 1)
        # Index 1: YearsAtCompany (float)
        # Index 2: DistanceFromHome (float)
        # Index 3: MonthlyIncome (float)
        feature_vector = [[
            float(employee.overtime_flag),
            float(employee.years_at_company),
            float(employee.distance_from_home),
            float(employee.monthly_income)
        ]]
        
        # Predict probability for both classes [p_no, p_yes]
        probabilities = model.predict_proba(feature_vector)[0]
        
        # Probability of class 1 (attrition) mapped to percentage
        raw_score = float(probabilities[1]) * 100
        risk_score = round(raw_score, 1)
        
        # Categorize score into ranges
        if risk_score <= 35:
            risk_category = "LOW"
        elif 35 < risk_score <= 65:
            risk_category = "MEDIUM"
        else:
            risk_category = "HIGH"
            
        # Get qualitative generative AI suggestions
        ai_insight = generate_insight(
            employee_name=employee.employee_name,
            risk_score=risk_score,
            risk_category=risk_category,
            top_factors=top_factors,
            overtime_flag=employee.overtime_flag,
            years_at_company=employee.years_at_company,
            monthly_income=employee.monthly_income
        )
        
        return RiskPrediction(
            risk_score=risk_score,
            risk_category=risk_category,
            top_factors=top_factors,
            ai_insight=ai_insight
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred during risk scoring: {str(e)}"
        )
