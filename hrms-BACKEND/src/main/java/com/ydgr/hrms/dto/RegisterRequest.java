package com.ydgr.hrms.dto;

import com.ydgr.hrms.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String employeeCode;


    private String email;


    private String password;

    private Role role;


    private String fullName;

    private String phone;

    private String address;

    private String department;

    private String designation;

    private LocalDate dateOfJoining;

    private String profilePictureUrl;
}
