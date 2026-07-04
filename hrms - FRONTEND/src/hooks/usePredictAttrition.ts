import { useMutation } from '@tanstack/react-query';
import type { EmployeeFeatures, RiskPrediction } from '../types/attrition';

const API_BASE_URL = 'http://localhost:8000';

export function usePredictAttrition() {
  return useMutation<RiskPrediction, Error, EmployeeFeatures>({
    mutationFn: async (data) => {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to calculate attrition risk: ${response.statusText}`);
      }

      return response.json();
    },
  });
}
