package com.curier_app.curier_app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ruta_curier")
public class RutaCurier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Long idRuta;

    @ManyToOne
    @JoinColumn(name = "id_curier", nullable = false)
    @JsonBackReference("curier-rute")
    private Utilizator curier;

    @Column(name = "oras_origine", length = 100, nullable = false)
    private String orasOrigine;

    @Column(name = "oras_destinatie", length = 100, nullable = false)
    private String orasDestinatie;

    @Column(name = "judet_origine", length = 50)
    private String judetOrigine;

    @Column(name = "judet_destinatie", length = 50)
    private String judetDestinatie;

    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

    @Column(name = "prioritate")
    private Integer prioritate = 0; // Pentru a ordona rutele unui curier

    @Column(name = "descriere", length = 255)
    private String descriere;
}
