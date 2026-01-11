package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM comanda WHERE id_comanda = :id", nativeQuery = true)
    Optional<Comanda> findComandaById(@Param("id") Long id);

    @Query(value = "SELECT * FROM comanda", nativeQuery = true)
    List<Comanda> findAllComenzi();

    @Query(value = "SELECT * FROM comanda WHERE id_client = :idClient", nativeQuery = true)
    List<Comanda> findByClientId(@Param("idClient") Long idClient);

    @Query(value = "SELECT * FROM comanda WHERE id_curier_alocat = :idCurier", nativeQuery = true)
    List<Comanda> findByCurierId(@Param("idCurier") Long idCurier);

    @Query(value = "SELECT * FROM comanda WHERE status_comanda = :status", nativeQuery = true)
    List<Comanda> findByStatus(@Param("status") String status);

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
