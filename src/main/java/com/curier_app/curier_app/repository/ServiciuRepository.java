package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Serviciu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiciuRepository extends JpaRepository<Serviciu, Long> {
    List<Serviciu> findByActivTrue();
    List<Serviciu> findAllByOrderByNumeAsc();
}
