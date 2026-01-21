package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Vehicul;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VehiculRepository extends JpaRepository<Vehicul, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM vehicul WHERE id_vehicul = :id", nativeQuery = true)
    Optional<Vehicul> findVehiculById(@Param("id") Long id);

    @Query(value = "SELECT * FROM vehicul", nativeQuery = true)
    List<Vehicul> findAllVehicule();

    @Query(value = "SELECT * FROM vehicul WHERE numar_inmatriculare = :numar", nativeQuery = true)
    Optional<Vehicul> findByNumarInmatriculare(@Param("numar") String numar);

    @Query(value = "SELECT * FROM vehicul WHERE tip_vehicul = :tip", nativeQuery = true)
    List<Vehicul> findByTipVehicul(@Param("tip") String tip);

    @Query(value = "SELECT * FROM vehicul WHERE status_vehicul = :status", nativeQuery = true)
    List<Vehicul> findByStatus(@Param("status") String status);

    List<Vehicul> findByStatusVehicul(String status);

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
