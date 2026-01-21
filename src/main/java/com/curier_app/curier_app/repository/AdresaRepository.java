package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Adresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface AdresaRepository extends JpaRepository<Adresa, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM adresa WHERE id_utilizator = :idUtilizator", nativeQuery = true)
    List<Adresa> findByUtilizatorId(@Param("idUtilizator") Long idUtilizator);

    @Query(value = "SELECT * FROM adresa WHERE id_adresa = :id", nativeQuery = true)
    Optional<Adresa> findAdresaById(@Param("id") Long id);

    @Query(value = "SELECT * FROM adresa", nativeQuery = true)
    List<Adresa> findAllAdrese();

    @Query(value = "SELECT * FROM adresa WHERE oras = :oras", nativeQuery = true)
    List<Adresa> findByOras(@Param("oras") String oras);

    // Interogari cu subcereri
    
    // SUBCERERE 5: Adrese nefolosite (care nu sunt expeditor sau destinatar pentru niciun colet)
    @Query(value = "SELECT * FROM adresa a WHERE a.id_adresa NOT IN " +
           "(SELECT DISTINCT id_adresa_expeditor FROM colet WHERE id_adresa_expeditor IS NOT NULL " +
           "UNION SELECT DISTINCT id_adresa_destinatar FROM colet WHERE id_adresa_destinatar IS NOT NULL)", nativeQuery = true)
    List<Adresa> findAdreseNefolosite();

    // INSERT, UPDATE, DELETE
    
    // INSERT 2: Adaugă adresă nouă
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO adresa (oras, strada, numar, cod_postal, judet, tara, id_utilizator) " +
           "VALUES (:oras, :strada, :numar, :codPostal, :judet, :tara, :idUtilizator)", nativeQuery = true)
    void insertAdresa(@Param("oras") String oras, @Param("strada") String strada,
                     @Param("numar") String numar, @Param("codPostal") String codPostal,
                     @Param("judet") String judet, @Param("tara") String tara,
                     @Param("idUtilizator") Long idUtilizator);
    
    // UPDATE 6: Actualizează orașul unei adrese
    @Modifying
    @Transactional
    @Query(value = "UPDATE adresa SET oras = :oras WHERE id_adresa = :id", nativeQuery = true)
    void updateOrasAdresa(@Param("id") Long id, @Param("oras") String oras);
    
    // DELETE 4: Șterge adresă după ID
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM adresa WHERE id_adresa = :id", nativeQuery = true)
    void deleteAdresaById(@Param("id") Long id);
}
