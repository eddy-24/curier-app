package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.MotivEsec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MotivEsecRepository extends JpaRepository<MotivEsec, Long> {
    List<MotivEsec> findByActivTrue();
    List<MotivEsec> findAllByOrderByDescriereAsc();
    Optional<MotivEsec> findByCod(String cod);
}
