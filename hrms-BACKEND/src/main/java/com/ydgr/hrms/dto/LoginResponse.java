package com.ydgr.hrms.dto;

import com.ydgr.hrms.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private Long userId;

    private Long companyId;

    private Role role;

    private String message;
}