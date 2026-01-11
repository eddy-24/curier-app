package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.RutaCurier;
import com.curier_app.curier_app.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutaCurierRepository extends JpaRepository<RutaCurier, Long> {

    // Găsește toate rutele unui curier
    List<RutaCurier> findByCurierAndActivaTrue(Utilizator curier);
    
    List<RutaCurier> findByCurier_IdUtilizator(Long curierId);

    // Găsește curierii care au rută către o anumită destinație
    @Query("SELECT DISTINCT r.curier FROM RutaCurier r WHERE r.activa = true AND " +
           "(LOWER(r.orasDestinatie) = LOWER(:orasDestinatie) OR LOWER(r.judetDestinatie) = LOWER(:judetDestinatie))")
    List<Utilizator> findCurieriByDestinatie(@Param("orasDestinatie") String orasDestinatie, 
                                              @Param("judetDestinatie") String judetDestinatie);

    // Găsește curierii care acoperă traseul origine -> destinație
    @Query("SELECT DISTINCT r.curier FROM RutaCurier r WHERE r.activa = true AND " +
           "(LOWER(r.orasOrigine) = LOWER(:orasOrigine) OR LOWER(r.judetOrigine) = LOWER(:judetOrigine)) AND " +
           "(LOWER(r.orasDestinatie) = LOWER(:orasDestinatie) OR LOWER(r.judetDestinatie) = LOWER(:judetDestinatie))")
    List<Utilizator> findCurieriByTraseu(@Param("orasOrigine") String orasOrigine,
                                          @Param("judetOrigine") String judetOrigine,
                                          @Param("orasDestinatie") String orasDestinatie,
                                          @Param("judetDestinatie") String judetDestinatie);

    // Găsește toate rutele active
    List<RutaCurier> findByActivaTrue();

    // Verifică dacă există o rută pentru un curier și destinație
    @Query("SELECT COUNT(r) > 0 FROM RutaCurier r WHERE r.curier.idUtilizator = :curierId AND r.activa = true AND " +
           "(LOWER(r.orasDestinatie) = LOWER(:orasDestinatie) OR LOWER(r.judetDestinatie) = LOWER(:judetDestinatie))")
    boolean existsRutaForCurierAndDestinatie(@Param("curierId") Long curierId,
                                              @Param("orasDestinatie") String orasDestinatie,
                                              @Param("judetDestinatie") String judetDestinatie);
}
