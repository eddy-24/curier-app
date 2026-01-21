package com.curier_app.curier_app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "colet")
public class Colet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_colet")
    private Long idColet;

    @ManyToOne
    @JoinColumn(name = "id_comanda", nullable = false)
    @JsonBackReference("comanda-colete")
    private Comanda comanda;

    @Column(name = "cod_awb", length = 30, nullable = false, unique = true)
    private String codAwb;

    @Column(name = "greutate_kg", precision = 6, scale = 2)
    private BigDecimal greutateKg;

    @Column(name = "lungime_cm", precision = 6, scale = 2)
    private BigDecimal lungimeCm;

    @Column(name = "latime_cm", precision = 6, scale = 2)
    private BigDecimal latimeCm;

    @Column(name = "inaltime_cm", precision = 6, scale = 2)
    private BigDecimal inaltimeCm;

    @ManyToOne
    @JoinColumn(name = "id_serviciu")
    private Serviciu serviciu;

    @Column(name = "pret_declarat", precision = 8, scale = 2)
    private BigDecimal pretDeclarat;

    @Column(name = "ramburs_incasat")
    private Boolean rambursIncasat = false;

    @Column(name = "status_colet", length = 20, nullable = false)
    private String statusColet = "in_asteptare";

    @Column(name = "data_livrare")
    private LocalDateTime dataLivrare;

    @ManyToOne
    @JoinColumn(name = "id_adresa_expeditor", nullable = false)
    private Adresa adresaExpeditor;

    @ManyToOne
    @JoinColumn(name = "id_adresa_destinatar", nullable = false)
    private Adresa adresaDestinatar;

    @ManyToOne
    @JoinColumn(name = "id_curier")
    private Utilizator curier;
}
