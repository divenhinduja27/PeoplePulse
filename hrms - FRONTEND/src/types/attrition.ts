export interface EmployeeFeatures {
  employee_name: string;
  overtime_flag: number; // 0 = No, 1 = Yes
  years_at_company: number;
  distance_from_home: number;
  monthly_income: number;
}

export interface RiskPrediction {
  risk_score: number;       // Risk percentage (0-100)
  risk_category: 'LOW' | 'MEDIUM' | 'HIGH';
  top_factors: string[];    // Array of key risk drivers
  ai_insight: string;       // HR qualitative context & suggestion
}
