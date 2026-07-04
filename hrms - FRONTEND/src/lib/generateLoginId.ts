/**
 * Generates a unique Login ID for employees in the HRMS.
 * Format: [Company Initials][First 2 of First Name][First 2 of Last Name][Join Year][4-digit Serial]
 * e.g., generateLoginId("OI", "John", "Doe", 2022, 1) -> "OIJODO20220001"
 */
export function generateLoginId(
  companyInitials: string,
  firstName: string,
  lastName: string,
  joinYear: number | string,
  serialNumber: number
): string {
  const company = companyInitials.substring(0, 2).toUpperCase().padEnd(2, 'X');
  const first = firstName.trim().substring(0, 2).toUpperCase().padEnd(2, 'X');
  const last = lastName.trim().substring(0, 2).toUpperCase().padEnd(2, 'X');
  const year = String(joinYear).substring(0, 4);
  const serial = String(serialNumber).padStart(4, '0');

  return `${company}${first}${last}${year}${serial}`;
}
