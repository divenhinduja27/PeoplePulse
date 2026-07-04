import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

def train():
    """
    Loads HR employee attrition data, pre-processes it, trains a 
    RandomForestClassifier, and saves the trained model artifact.
    """
    # Define file paths relative to script location to ensure it runs correctly from anywhere
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "hr_attrition.csv")
    model_dir = os.path.join(base_dir, "model")
    model_output_path = os.path.join(model_dir, "attrition_model.pkl")

    print(f"[*] Loading data from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(
            f"Dataset not found at {data_path}. Please place the Kaggle IBM HR Attrition CSV there first."
        )

    # 1. Load the dataset
    df = pd.read_csv(data_path)

    # 2. Map Categorical Binary columns to 1/0
    # OverTime mapping: Yes -> 1, No -> 0
    if "OverTime" in df.columns:
        df["OverTime"] = df["OverTime"].map({"Yes": 1, "No": 0})
    else:
        raise KeyError("Required feature column 'OverTime' is missing from the dataset.")

    # Attrition mapping: Yes -> 1, No -> 0
    if "Attrition" in df.columns:
        df["Attrition"] = df["Attrition"].map({"Yes": 1, "No": 0})
    else:
        raise KeyError("Target column 'Attrition' is missing from the dataset.")

    # 3. Select designated features and target
    features = ["OverTime", "YearsAtCompany", "DistanceFromHome", "MonthlyIncome"]
    target = "Attrition"

    X = df[features]
    y = df[target]

    print(f"[*] Selected features: {features}")
    print(f"[*] Selected target: {target}")
    print(f"[*] Dataset shape: {X.shape}")

    # 4. Split data into train/test split (80/20, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"[*] Train set shape: {X_train.shape}, Test set shape: {X_test.shape}")

    # Baseline check — what accuracy would "always predict No" get?
    baseline_acc = (y_test == 0).mean()
    print(f"[*] Baseline accuracy (always predict 'No'): {baseline_acc*100:.2f}%")

    # 5. Train RandomForestClassifier (n_estimators=150, max_depth=6, random_state=42)
    print("[*] Training RandomForestClassifier model...")
    model = RandomForestClassifier(
        n_estimators=150, max_depth=6, random_state=42,
        class_weight="balanced"
    )
    model.fit(X_train, y_train)

    # 6. Evaluate and print model accuracy
    accuracy = model.score(X_test, y_test)
    print(f"[+] Model test set accuracy: {accuracy * 100:.2f}%")

    y_pred = model.predict(X_test)
    print("\n[+] Classification report:")
    print(classification_report(y_test, y_pred, target_names=["Stayed", "Left"]))

    # 7. Print sorted feature importances
    print("\n[+] Feature Importances (descending):")
    importances = model.feature_importances_
    feature_importance_list = sorted(
        zip(features, importances), key=lambda x: x[1], reverse=True
    )
    for feat, imp in feature_importance_list:
        print(f"    - {feat}: {imp:.4f}")

    # 8. Save the model artifact
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, model_output_path)
    print(f"\n[+] Successfully saved trained model to: {model_output_path}")

if __name__ == "__main__":
    train()
