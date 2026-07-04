import { useState, useMemo } from 'react';
import type { Employee } from '../types';

export function useEmployeeSearch(employees: Employee[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((emp) => {
      const name = emp.name ? emp.name.toLowerCase() : '';
      const id = emp.id ? emp.id.toLowerCase() : '';
      const email = emp.email ? emp.email.toLowerCase() : '';
      const location = emp.location ? emp.location.toLowerCase() : '';
      const manager = emp.manager ? emp.manager.toLowerCase() : '';
      
      const empCode = (emp.privateInfo && emp.privateInfo.empCode) 
        ? emp.privateInfo.empCode.toLowerCase() 
        : '';
        
      const skills = Array.isArray(emp.skills) 
        ? emp.skills.map(s => s.toLowerCase()) 
        : [];
      
      return (
        name.includes(query) ||
        id.includes(query) ||
        email.includes(query) ||
        location.includes(query) ||
        manager.includes(query) ||
        empCode.includes(query) ||
        skills.some(skill => skill.includes(query))
      );
    });
  }, [employees, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredEmployees,
  };
}
