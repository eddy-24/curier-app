package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {

    // SELECT cu query native
    @Query(value = "SELECT * FROM comanda WHERE id_comanda = :id", nativeQuery = true)
    Optional<Comanda> findComandaById(@Param("id") Long id);

    @Query(value = "SELECT * FROM comanda", nativeQuery = true)
    List<Comanda> findAllComenzi();

    @Query(value = "SELECT * FROM comanda WHERE id_client = :idClient", nativeQuery = true)
    List<Comanda> findByClientId(@Param("idClient") Long idClient);

    @Query(value = "SELECT * FROM comanda WHERE id_curier_alocat = :idCurier", nativeQuery = true)
    List<Comanda> findByCurierId(@Param("idCurier") Long idCurier);

    @Query(value = "SELECT * FROM comanda WHERE status_comanda = :status", nativeQuery = true)
    List<Comanda> findByStatus(@Param("status") String status);

    // Interogari cu subcereri
    
    // SUBCERERE 3: Comenzi care au facturi neachitate
    @Query(value = "SELECT * FROM comanda c WHERE c.id_comanda IN " +
           "(SELECT f.id_comanda FROM factura f WHERE f.status_plata = 'neachitat')", nativeQuery = true)
    List<Comanda> findComenziCuFacturiNeachitate();

    // INSERT, UPDATE, DELETE
    
    // UPDATE 3: Actualizează statusul comenzii
    @Modifying
    @Transactional
    @Query(value = "UPDATE comanda SET status_comanda = :status WHERE id_comanda = :id", nativeQuery = true)
    void updateStatusComanda(@Param("id") Long id, @Param("status") String status);
    
    // UPDATE 4: Actualizează modalitatea de plată
    @Modifying
    @Transactional
    @Query(value = "UPDATE comanda SET modalitate_plata = :modalitate WHERE id_comanda = :id", nativeQuery = true)
    void updateModalitateComanda(@Param("id") Long id, @Param("modalitate") String modalitate);
    
    // DELETE 2: Șterge comandă după ID
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM comanda WHERE id_comanda = :id", nativeQuery = true)
    void deleteComandaById(@Param("id") Long id);
}
