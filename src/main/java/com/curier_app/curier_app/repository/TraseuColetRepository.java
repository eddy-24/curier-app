package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.TraseuColet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TraseuColetRepository extends JpaRepository<TraseuColet, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM traseu_colet WHERE id_traseu = :id", nativeQuery = true)
    Optional<TraseuColet> findTraseuById(@Param("id") Long id);

    @Query(value = "SELECT * FROM traseu_colet", nativeQuery = true)
    List<TraseuColet> findAllTrasee();

    @Query(value = "SELECT * FROM traseu_colet WHERE id_colet = :idColet", nativeQuery = true)
    List<TraseuColet> findByColetId(@Param("idColet") Long idColet);

    @Query(value = "SELECT * FROM traseu_colet WHERE id_sofer = :idCurier", nativeQuery = true)
    List<TraseuColet> findByCurierId(@Param("idCurier") Long idCurier);

    @Query(value = "SELECT * FROM traseu_colet WHERE id_vehicul = :idVehicul", nativeQuery = true)
    List<TraseuColet> findByVehiculId(@Param("idVehicul") Long idVehicul);

    @Query(value = "SELECT * FROM traseu_colet WHERE status_segment = :status", nativeQuery = true)
    List<TraseuColet> findByStatus(@Param("status") String status);

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
