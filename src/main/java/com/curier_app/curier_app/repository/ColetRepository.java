package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Colet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

    @Query(value = "SELECT * FROM colet WHERE id_curier = :curierId", nativeQuery = true)
    List<Colet> findByCurier_IdUtilizator(@Param("curierId") Long curierId);

    @Query(value = "SELECT * FROM colet WHERE id_curier IS NULL", nativeQuery = true)
    List<Colet> findColeteNeasignate();

    // Interogari JOIN
    
    // JOIN 1: Colete cu detalii comandă și client
    @Query(value = "SELECT c.* FROM colet c " +
           "INNER JOIN comanda cmd ON c.id_comanda = cmd.id_comanda " +
           "INNER JOIN utilizator u ON cmd.id_client = u.id_utilizator " +
           "WHERE u.id_utilizator = :clientId", nativeQuery = true)
    List<Colet> findColeteByClientWithJoin(@Param("clientId") Long clientId);
    
    // JOIN 2: Colete cu curier și statusul acestuia
    @Query(value = "SELECT c.* FROM colet c " +
           "INNER JOIN utilizator cur ON c.id_curier = cur.id_utilizator " +
           "WHERE cur.rol = :rol AND cur.activ = true", nativeQuery = true)
    List<Colet> findColeteByCurierRolWithJoin(@Param("rol") String rol);
    
    // JOIN 3: Colete cu tracking events și adresa de livrare
    @Query(value = "SELECT DISTINCT c.* FROM colet c " +
           "INNER JOIN tracking_event te ON c.id_colet = te.id_colet " +
           "INNER JOIN adresa a ON c.id_adresa_destinatar = a.id_adresa " +
           "WHERE a.oras = :oras AND te.status = :status", nativeQuery = true)
    List<Colet> findColeteByOrasAndStatusWithJoin(@Param("oras") String oras, @Param("status") String status);
    
    // JOIN 4: Colete cu factura asociată comenzii
    @Query(value = "SELECT c.* FROM colet c " +
           "INNER JOIN comanda cmd ON c.id_comanda = cmd.id_comanda " +
           "INNER JOIN factura f ON cmd.id_comanda = f.id_comanda " +
           "WHERE f.status_plata = :statusPlata", nativeQuery = true)
    List<Colet> findColeteByStatusPlataFacturaWithJoin(@Param("statusPlata") String statusPlata);

    // Interogari cu subcereri
    
    // SUBCERERE 1: Colete care au tracking events cu un anumit status
    @Query(value = "SELECT * FROM colet c WHERE c.id_colet IN " +
           "(SELECT te.id_colet FROM tracking_event te WHERE te.status = :status)", nativeQuery = true)
    List<Colet> findColeteWithStatusInTracking(@Param("status") String status);
    
    // SUBCERERE 2: Colete cu greutate mai mare decât media
    @Query(value = "SELECT * FROM colet WHERE greutate_kg > " +
           "(SELECT AVG(greutate_kg) FROM colet WHERE greutate_kg IS NOT NULL)", nativeQuery = true)
    List<Colet> findColetePesteGreutateMedie();

    // INSERT, UPDATE, DELETE
    
    // UPDATE 1: Actualizează statusul unui colet
    @Modifying
    @Transactional
    @Query(value = "UPDATE colet SET status_colet = :status WHERE id_colet = :id", nativeQuery = true)
    void updateStatusColet(@Param("id") Long id, @Param("status") String status);
    
    // UPDATE 2: Asignează curier la colet
    @Modifying
    @Transactional
    @Query(value = "UPDATE colet SET id_curier = :curierId WHERE id_colet = :id", nativeQuery = true)
    void updateCurierColet(@Param("id") Long id, @Param("curierId") Long curierId);
    
    // DELETE 1: Șterge colet după ID
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM colet WHERE id_colet = :id", nativeQuery = true)
    void deleteColetById(@Param("id") Long id);
}
