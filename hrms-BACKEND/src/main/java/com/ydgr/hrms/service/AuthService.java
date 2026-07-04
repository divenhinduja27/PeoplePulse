package com.ydgr.hrms.service;

import com.ydgr.hrms.dto.CompanyRegisterRequest;
import com.ydgr.hrms.dto.LoginRequest;
import com.ydgr.hrms.dto.LoginResponse;
import com.ydgr.hrms.dto.RegisterRequest;
import com.ydgr.hrms.enums.Role;
import com.ydgr.hrms.model.Company;
import com.ydgr.hrms.model.EmployeeProfile;
import com.ydgr.hrms.model.User;
import com.ydgr.hrms.repository.AuthRepository;
import com.ydgr.hrms.repository.CompanyRepository;
import com.ydgr.hrms.repository.EmployeeProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    CompanyRepository companyRepository;

    private final AuthRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        if (userRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            return "Employee code already exists";
        }

        User user = new User();
        user.setEmployeeCode(request.getEmployeeCode());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null ? Role.EMPLOYEE : request.getRole());
        user.setIsVerified(true);

        userRepository.save(user);

        EmployeeProfile profile = new EmployeeProfile();
        profile.setUser(user);
        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setDepartment(request.getDepartment());
        profile.setDesignation(request.getDesignation());
        profile.setDateOfJoining(request.getDateOfJoining());
        profile.setProfilePictureUrl(request.getProfilePictureUrl());

        employeeProfileRepository.save(profile);

        return "User Registered Successfully";
    }



    public String registerCompany(CompanyRegisterRequest request) {

        // 1. Check password
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return "Passwords do not match";
        }

        // 2. Check email
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        // 3. Generate company code
        String companyCode = generateCompanyCode(request.getCompanyName());

        // 4. Create company
        Company company = new Company();
        company.setCompanyName(request.getCompanyName());
        company.setCompanyCode(companyCode);
        company.setCompanyLogoUrl(request.getCompanyLogoUrl());

        companyRepository.save(company);

        // 5. Create admin user
        User admin = new User();
        admin.setCompany(company);
        admin.setEmployeeCode("ADMIN");
        admin.setEmail(request.getEmail());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setRole(Role.ADMIN);
        admin.setIsVerified(true);

        userRepository.save(admin);

        // 6. Create admin profile
        EmployeeProfile profile = new EmployeeProfile();
        profile.setUser(admin);
        profile.setFullName(request.getAdminName());
        profile.setPhone(request.getPhone());

        employeeProfileRepository.save(profile);

        return "Company Registered Successfully";
    }

    private String generateCompanyCode(String companyName) {

        String[] words = companyName.trim().split("\\s+");

        StringBuilder code = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                code.append(Character.toUpperCase(word.charAt(0)));
            }
        }

        return code.toString();
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email or Password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            throw new RuntimeException("Invalid Email or Password");
        }

        return new LoginResponse(
                user.getId(),
                user.getCompany().getId(),
                user.getRole(),
                "Login Successful"
        );
    }
}