package com.ydgr.hrms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employee_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    private String address;

    private String department;

    private String designation;

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;
}