package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM tracking_event WHERE id_colet = :idColet ORDER BY data_event DESC", nativeQuery = true)
    List<TrackingEvent> findByColetId(@Param("idColet") Long idColet);

    @Query(value = "SELECT * FROM tracking_event WHERE id_colet = :idColet ORDER BY data_event ASC", nativeQuery = true)
    List<TrackingEvent> findByColetIdOrderByDataEventAsc(@Param("idColet") Long idColet);

    @Query(value = "SELECT * FROM tracking_event WHERE id_event = :id", nativeQuery = true)
    TrackingEvent findTrackingEventById(@Param("id") Long id);

    @Query(value = "SELECT * FROM tracking_event WHERE id_colet = :idColet ORDER BY data_event DESC", nativeQuery = true)
    List<TrackingEvent> findByColetOrderByDataEventDesc(@Param("idColet") Long idColet);

    @Query(value = "SELECT * FROM tracking_event ORDER BY data_event DESC", nativeQuery = true)
    List<TrackingEvent> findAllTrackingEvents();

    // Interogari JOIN
    
    // JOIN 6: Tracking events cu detalii colet și comandă
    @Query(value = "SELECT te.* FROM tracking_event te " +
           "INNER JOIN colet c ON te.id_colet = c.id_colet " +
           "INNER JOIN comanda cmd ON c.id_comanda = cmd.id_comanda " +
           "WHERE cmd.id_comanda = :comandaId ORDER BY te.data_event DESC", nativeQuery = true)
    List<TrackingEvent> findTrackingByComandaWithJoin(@Param("comandaId") Long comandaId);

    // Interogari cu subcereri
    
    // SUBCERERE 6: Tracking events pentru coletele unui client specific
    @Query(value = "SELECT * FROM tracking_event WHERE id_colet IN " +
           "(SELECT c.id_colet FROM colet c INNER JOIN comanda cmd ON c.id_comanda = cmd.id_comanda " +
           "WHERE cmd.id_client = :clientId)", nativeQuery = true)
    List<TrackingEvent> findTrackingEventsByClientId(@Param("clientId") Long clientId);

    // INSERT, UPDATE, DELETE
    
    // INSERT 4: Adaugă tracking event nou
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO tracking_event (id_colet, status, descriere, locatie, data_event) " +
           "VALUES (:idColet, :status, :descriere, :locatie, :dataEvent)", nativeQuery = true)
    void insertTrackingEvent(@Param("idColet") Long idColet, @Param("status") String status,
                            @Param("descriere") String descriere, @Param("locatie") String locatie,
                            @Param("dataEvent") String dataEvent);
    
    // UPDATE 7: Actualizează descrierea unui tracking event
    @Modifying
    @Transactional
    @Query(value = "UPDATE tracking_event SET descriere = :descriere WHERE id_event = :id", nativeQuery = true)
    void updateDescriereTrackingEvent(@Param("id") Long id, @Param("descriere") String descriere);
    
    // DELETE 6: Șterge tracking event după ID
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tracking_event WHERE id_event = :id", nativeQuery = true)
    void deleteTrackingEventById(@Param("id") Long id);
}
