package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UtilizatorRepository extends JpaRepository<Utilizator, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM utilizator WHERE username = :username", nativeQuery = true)
    Optional<Utilizator> findByUsername(@Param("username") String username);

    @Query(value = "SELECT * FROM utilizator WHERE rol = :rol", nativeQuery = true)
    List<Utilizator> findByRol(@Param("rol") String rol);

    @Query(value = "SELECT * FROM utilizator WHERE id_utilizator = :id", nativeQuery = true)
    Optional<Utilizator> findUtilizatorById(@Param("id") Long id);

    @Query(value = "SELECT * FROM utilizator", nativeQuery = true)
    List<Utilizator> findAllUtilizatori();

    // Interogari cu subcereri
    
    // SUBCERERE 4: Curieri care au livrat colete
    @Query(value = "SELECT * FROM utilizator u WHERE u.id_utilizator IN " +
           "(SELECT DISTINCT c.id_curier FROM colet c WHERE c.status_colet = 'livrat' AND c.id_curier IS NOT NULL)", nativeQuery = true)
    List<Utilizator> findCurieriCuLivrari();

    // INSERT, UPDATE, DELETE
    
    // INSERT 1: Adaugă utilizator nou
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO utilizator (username, parola, email, nume, prenume, telefon, rol, activ) " +
           "VALUES (:username, :parola, :email, :nume, :prenume, :telefon, :rol, :activ)", nativeQuery = true)
    void insertUtilizator(@Param("username") String username, @Param("parola") String parola,
                         @Param("email") String email, @Param("nume") String nume,
                         @Param("prenume") String prenume, @Param("telefon") String telefon,
                         @Param("rol") String rol, @Param("activ") Boolean activ);
    
    // UPDATE 5: Actualizează email utilizator
    @Modifying
    @Transactional
    @Query(value = "UPDATE utilizator SET email = :email WHERE id_utilizator = :id", nativeQuery = true)
    void updateEmailUtilizator(@Param("id") Long id, @Param("email") String email);
    
    // DELETE 3: Șterge utilizator după ID
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM utilizator WHERE id_utilizator = :id", nativeQuery = true)
    void deleteUtilizatorById(@Param("id") Long id);
}
