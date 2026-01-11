package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UtilizatorRepository extends JpaRepository<Utilizator, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM utilizator WHERE username = :username", nativeQuery = true)
    Optional<Utilizator> findByUsername(@Param("username") String username);

    @Query(value = "SELECT * FROM utilizator WHERE rol = :rol", nativeQuery = true)
    List<Utilizator> findByRol(@Param("rol") String rol);

    @Query(value = "SELECT * FROM utilizator WHERE id_utilizator = :id", nativeQuery = true)
    Optional<Utilizator> findUtilizatorById(@Param("id") Long id);

    @Query(value = "SELECT * FROM utilizator", nativeQuery = true)
    List<Utilizator> findAllUtilizatori();

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
