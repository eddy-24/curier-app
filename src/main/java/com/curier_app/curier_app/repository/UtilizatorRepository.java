package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilizatorRepository extends JpaRepository<Utilizator, Long> {

    Optional<Utilizator> findByUsername(String username);
}
