package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.StatusColet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StatusColetRepository extends JpaRepository<StatusColet, Long> {
    List<StatusColet> findByActivTrue();
    List<StatusColet> findAllByOrderByOrdineAfisareAsc();
    Optional<StatusColet> findByCod(String cod);
}
