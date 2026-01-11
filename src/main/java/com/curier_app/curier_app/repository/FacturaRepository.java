package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FacturaRepository extends JpaRepository<Factura, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM factura WHERE id_factura = :id", nativeQuery = true)
    Optional<Factura> findFacturaById(@Param("id") Long id);

    @Query(value = "SELECT * FROM factura", nativeQuery = true)
    List<Factura> findAllFacturi();

    @Query(value = "SELECT * FROM factura WHERE id_comanda = :idComanda", nativeQuery = true)
    Optional<Factura> findByComandaId(@Param("idComanda") Long idComanda);

    @Query(value = "SELECT * FROM factura WHERE status_plata = :status", nativeQuery = true)
    List<Factura> findByStatusPlata(@Param("status") String status);

    @Query(value = "SELECT * FROM factura WHERE serie_numar = :serieNumar", nativeQuery = true)
    Optional<Factura> findBySerieNumar(@Param("serieNumar") String serieNumar);

    @Modifying
    @Transactional
    @Query(value = "UPDATE factura SET status_plata = :status WHERE id_factura = :id", nativeQuery = true)
    void updateStatusPlata(@Param("id") Long id, @Param("status") String status);

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
