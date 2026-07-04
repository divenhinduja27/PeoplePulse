package com.ydgr.hrms.service;

import com.ydgr.hrms.dto.EmployeeRequest;
import com.ydgr.hrms.dto.EmployeeResponse;
import com.ydgr.hrms.enums.Role;
import com.ydgr.hrms.model.Company;
import com.ydgr.hrms.model.EmployeeProfile;
import com.ydgr.hrms.model.User;
import com.ydgr.hrms.repository.AuthRepository;
import com.ydgr.hrms.repository.EmployeeProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final AuthRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final PasswordEncoder passwordEncoder;

    private String generateEmployeeCode(Company company, String fullName) {

        String companyCode = company.getCompanyCode();

        String initials = Arrays.stream(fullName.trim().split("\\s+"))
                .map(name -> String.valueOf(Character.toUpperCase(name.charAt(0))))
                .collect(Collectors.joining());

        int count = userRepository.countByCompany(company) + 1;

        String year = String.valueOf(LocalDate.now().getYear());

        return companyCode
                + initials
                + year
                + String.format("%04d", count);
    }

    private String generatePassword() {

        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

        Random random = new Random();

        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        return password.toString();
    }

    public EmployeeResponse addEmployee(Long adminId, EmployeeRequest request) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admins can add employees");
        }

        Company company = admin.getCompany();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String employeeCode = generateEmployeeCode(company, request.getFullName());

        String tempPassword = generatePassword();

        User employee = new User();
        employee.setCompany(company);
        employee.setEmployeeCode(employeeCode);
        employee.setEmail(request.getEmail());
        employee.setPasswordHash(passwordEncoder.encode(tempPassword));
        employee.setRole(Role.EMPLOYEE);
        employee.setActiveYN(true);

        userRepository.save(employee);

        EmployeeProfile profile = new EmployeeProfile();
        profile.setUser(employee);
        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setDepartment(request.getDepartment());
        profile.setDesignation(request.getDesignation());
        profile.setDateOfJoining(request.getDateOfJoining());
        profile.setProfilePictureUrl(request.getProfilePictureUrl());

        employeeProfileRepository.save(profile);

        return new EmployeeResponse(
                employeeCode,
                tempPassword,
                "Employee Created Successfully");
    }
}