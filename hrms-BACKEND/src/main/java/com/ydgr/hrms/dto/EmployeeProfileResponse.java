package com.ydgr.hrms.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeProfileResponse {
    private Long id;
    private Long userId;
    private String employeeCode;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String department;
    private String designation;
    private LocalDate dateOfJoining;
    private String profilePictureUrl;
}
