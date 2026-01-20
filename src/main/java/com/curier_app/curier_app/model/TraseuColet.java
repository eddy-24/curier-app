package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "traseu_colet")
public class TraseuColet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_traseu")
    private Long idTraseu;

    // FK către COLET
    @ManyToOne
    @JoinColumn(name = "id_colet", nullable = false)
    private Colet colet;

    // FK către VEHICUL
    @ManyToOne
    @JoinColumn(name = "id_vehicul", nullable = false)
    private Vehicul vehicul;

    // FK către CURIER (Utilizator cu rol=curier)
    @ManyToOne
    @JoinColumn(name = "id_sofer", nullable = false)
    private Utilizator curier;

    @Column(name = "data_incarcare", nullable = false)
    private LocalDateTime dataIncarcare;

    @Column(name = "data_descarcare")
    private LocalDateTime dataDescarcare;

    @Column(name = "locatie_start", length = 100)
    private String locatieStart;

    @Column(name = "locatie_stop", length = 100)
    private String locatieStop;

    @Column(name = "status_segment", length = 20)
    private String statusSegment; // planificat, in_curs, finalizat
}
