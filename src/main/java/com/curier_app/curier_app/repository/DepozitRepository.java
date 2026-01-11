package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Depozit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepozitRepository extends JpaRepository<Depozit, Long> {
    List<Depozit> findByActivTrue();
    List<Depozit> findAllByOrderByNumeAsc();
    List<Depozit> findByOras(String oras);
    List<Depozit> findByJudet(String judet);
}
