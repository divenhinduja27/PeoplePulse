package com.ydgr.hrms.controller;

import com.ydgr.hrms.dto.ApiResponse;
import com.ydgr.hrms.dto.CompanyRegisterRequest;
import com.ydgr.hrms.dto.LoginRequest;
import com.ydgr.hrms.dto.LoginResponse;
import com.ydgr.hrms.service.AuthService;
//import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-company")
    public ResponseEntity<ApiResponse> registerCompany(
             @RequestBody CompanyRegisterRequest request) {

        String message = authService.registerCompany(request);

        return ResponseEntity.ok(new ApiResponse(true, message));
    }



    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }
}