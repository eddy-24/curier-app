package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Colet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ColetRepository extends JpaRepository<Colet, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM colet WHERE id_colet = :id", nativeQuery = true)
    Optional<Colet> findColetById(@Param("id") Long id);

    @Query(value = "SELECT * FROM colet", nativeQuery = true)
    List<Colet> findAllColete();

    @Query(value = "SELECT * FROM colet WHERE id_comanda = :idComanda", nativeQuery = true)
    List<Colet> findByComandaId(@Param("idComanda") Long idComanda);

    @Query(value = "SELECT * FROM colet WHERE cod_awb = :codAwb", nativeQuery = true)
    Optional<Colet> findByCodAwb(@Param("codAwb") String codAwb);

    @Query(value = "SELECT * FROM colet WHERE status_colet = :status", nativeQuery = true)
    List<Colet> findByStatus(@Param("status") String status);

    @Query(value = "SELECT * FROM colet WHERE id_comanda = :idComanda", nativeQuery = true)
    List<Colet> findByComanda(@Param("idComanda") Long idComanda);

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
