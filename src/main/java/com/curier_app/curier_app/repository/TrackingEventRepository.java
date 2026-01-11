package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // INSERT, UPDATE, DELETE - automat de Spring (save(), delete())
}
