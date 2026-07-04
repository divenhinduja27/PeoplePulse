import joblib
import pandas as pd
import os

# Define path to trained model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "model", "attrition_model.pkl")

if not os.path.exists(model_path):
    print(f"[!] Error: Model file not found at: {model_path}")
    print("[!] Please run 'python model/train_model.py' first to train and generate the model.")
    exit(1)

print(f"[*] Loading model from: {model_path}")
model = joblib.load(model_path)

# Columns must match training order exactly:
# ["OverTime", "YearsAtCompany", "DistanceFromHome", "MonthlyIncome"]
samples = pd.DataFrame([
    {
        "OverTime": 1, 
        "YearsAtCompany": 1.0, 
        "DistanceFromHome": 20.0, 
        "MonthlyIncome": 2500.0
    },  # High risk employee profile (Overtime, low tenure, far commute, low salary)
    {
        "OverTime": 0, 
        "YearsAtCompany": 10.0, 
        "DistanceFromHome": 3.0, 
        "MonthlyIncome": 9000.0
    },  # Low risk employee profile (No overtime, high tenure, close commute, high salary)
])

# Generate probabilities for attrition class (1)
probs = model.predict_proba(samples)[:, 1]

print("\n[+] Prediction Test Results:")
for i, p in enumerate(probs):
    risk_score = p * 100
    if risk_score <= 35:
        category = "LOW"
    elif 35 < risk_score <= 65:
        category = "MEDIUM"
    else:
        category = "HIGH"
        
    print(f"    Employee {i+1} Profile: risk_score={risk_score:.1f}%, category={category}")
