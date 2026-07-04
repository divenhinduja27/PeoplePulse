package com.ydgr.hrms.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeRequest {

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private String department;

    private String designation;

    private LocalDate dateOfJoining;

    private String profilePictureUrl;
}