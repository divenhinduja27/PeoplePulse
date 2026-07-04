package com.ydgr.hrms.repository;

import com.ydgr.hrms.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByCompanyCode(String companyCode);

    boolean existsByCompanyCode(String companyCode);

}