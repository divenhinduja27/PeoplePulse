package com.ydgr.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmployeeResponse {

    private String employeeCode;

    private String temporaryPassword;

    private String message;
}