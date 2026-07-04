package com.ydgr.hrms.controller;

import com.ydgr.hrms.dto.EmployeeRequest;
import com.ydgr.hrms.dto.EmployeeResponse;
import com.ydgr.hrms.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/{adminId}")
    public ResponseEntity<EmployeeResponse> addEmployee(
            @PathVariable Long adminId,
            @RequestBody EmployeeRequest request) {

        return ResponseEntity.ok(
                employeeService.addEmployee(adminId, request));
    }
}