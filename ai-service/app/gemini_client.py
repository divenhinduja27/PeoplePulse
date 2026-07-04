import google.generativeai as genai
from app.config import Config

def generate_local_insight(
    employee_name: str,
    risk_score: float,
    risk_category: str,
    top_factors: list[str],
    overtime_flag: int,
    years_at_company: float,
    monthly_income: float
) -> str:
    """
    Local fallback logic that generates a customized HR suggestion using rule-based templates.
    Used when the Google Gemini API is rate-limited or fails.
    """
    factor_phrases = {
        "MonthlyIncome": "below-average compensation relative to peers",
        "YearsAtCompany": "relatively short tenure at the company",
        "DistanceFromHome": "a long commute distance",
        "OverTime": "frequent overtime hours"
    }
    reasons = [factor_phrases.get(f, f) for f in top_factors]
    reason_text = " and ".join(reasons)

    if risk_category == "HIGH":
        action = "Consider a retention conversation and reviewing their compensation or workload soon."
    elif risk_category == "MEDIUM":
        action = "Worth a periodic check-in to catch any early signs before this escalates."
    else:
        action = "No immediate action needed, but keep monitoring as tenure/role changes."

    return (f"{employee_name} shows a {risk_category.lower()} attrition risk "
            f"({risk_score:.0f}/100), primarily driven by {reason_text}. {action}")

def generate_insight(
    employee_name: str,
    risk_score: float,
    risk_category: str,
    top_factors: list[str],
    overtime_flag: int,
    years_at_company: float,
    monthly_income: float
) -> str:
    """
    Constructs a contextual prompt describing the employee's features, 
    risk metrics, and global feature importance factors, then uses the 
    Gemini API to compile a plain-English HR explanation and retention suggestion.
    
    Includes robust fallback to local rule-based generation if internet connectivity, 
    credentials, or rate limits cause the API request to fail.
    """
    try:
        # 1. Verify key is configured (throws ValueError if missing)
        Config.verify_api_key()

        # 2. Configure the SDK
        genai.configure(api_key=Config.GEMINI_API_KEY)

        # 3. Initialize model (gemini-2.0-flash)
        model = genai.GenerativeModel("gemini-2.0-flash")

        # 4. Formulate the prompt
        prompt = (
            f"You are a professional HR intelligence analyst. Review the following employee retention risk data:\n\n"
            f"Employee Name: {employee_name}\n"
            f"Calculated Attrition Risk: {risk_score}% ({risk_category} risk range)\n"
            f"Key Company-Wide Attrition Drivers: {', '.join(top_factors)}\n"
            f"Employee-Specific Details: Overtime = {'Yes' if overtime_flag == 1 else 'No'}, "
            f"Years at Company = {years_at_company} years\n\n"
            f"Please generate a response following this structure:\n"
            f"- A short plain-English explanation (maximum 2 sentences) describing why this employee "
            f"might be an attrition risk based on these facts.\n"
            f"- One concrete, actionable retention suggestion for the HR department.\n\n"
            f"Write the output as a single cohesive paragraph of plain text. Avoid bullet points, headers, or markdown styling."
        )

        # 5. Call API
        response = model.generate_content(prompt)
        
        if response and response.text:
            return response.text.strip()
        else:
            raise ValueError("Empty generation text returned by the API.")

    except Exception as e:
        print(f"[GEMINI ERROR] {type(e).__name__}: {e}")
        return generate_local_insight(
            employee_name=employee_name,
            risk_score=risk_score,
            risk_category=risk_category,
            top_factors=top_factors,
            overtime_flag=overtime_flag,
            years_at_company=years_at_company,
            monthly_income=monthly_income
        )
