package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Adresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AdresaRepository extends JpaRepository<Adresa, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM adresa WHERE id_utilizator = :idUtilizator", nativeQuery = true)
    List<Adresa> findByUtilizatorId(@Param("idUtilizator") Long idUtilizator);

    @Query(value = "SELECT * FROM adresa WHERE id_adresa = :id", nativeQuery = true)
    Optional<Adresa> findAdresaById(@Param("id") Long id);

    @Query(value = "SELECT * FROM adresa", nativeQuery = true)
    List<Adresa> findAllAdrese();

    @Query(value = "SELECT * FROM adresa WHERE oras = :oras", nativeQuery = true)
    List<Adresa> findByOras(@Param("oras") String oras);

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
