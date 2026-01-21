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

    // Interogari JOIN
    
    // JOIN 5: Facturi cu detalii comandă și client
    @Query(value = "SELECT f.* FROM factura f " +
           "INNER JOIN comanda c ON f.id_comanda = c.id_comanda " +
           "INNER JOIN utilizator u ON c.id_client = u.id_utilizator " +
           "WHERE u.email = :email", nativeQuery = true)
    List<Factura> findFacturiByClientEmailWithJoin(@Param("email") String email);

    // INSERT, UPDATE, DELETE
    // Nota: updateStatusPlata deja există mai sus
    
    // INSERT 3: Adaugă factură nouă
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO factura (id_comanda, serie_numar, suma_totala, data_emitere, data_scadenta, status_plata) " +
           "VALUES (:idComanda, :serieNumar, :sumaTotala, :dataEmitere, :dataScadenta, :statusPlata)", nativeQuery = true)
    void insertFactura(@Param("idComanda") Long idComanda, @Param("serieNumar") String serieNumar,
                      @Param("sumaTotala") Double sumaTotala, @Param("dataEmitere") String dataEmitere,
                      @Param("dataScadenta") String dataScadenta, @Param("statusPlata") String statusPlata);
    
    // DELETE 5: Șterge factură după ID
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM factura WHERE id_factura = :id", nativeQuery = true)
    void deleteFacturaById(@Param("id") Long id);
}
