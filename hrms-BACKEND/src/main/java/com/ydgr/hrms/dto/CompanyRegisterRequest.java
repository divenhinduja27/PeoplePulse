package com.ydgr.hrms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyRegisterRequest {

    private String companyName;

    private String adminName;

    private String email;

    private String phone;

    private String password;

    private String confirmPassword;

    private String companyLogoUrl;
}