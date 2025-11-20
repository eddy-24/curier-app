package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "factura")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura")
    private Long idFactura;

    @OneToOne
    @JoinColumn(name = "id_comanda", nullable = false, unique = true)
    private Comanda comanda;

    @Column(name = "serie_numar", length = 50, nullable = false, unique = true)
    private String serieNumar;

    @Column(name = "suma_totala", precision = 8, scale = 2, nullable = false)
    private BigDecimal sumaTotala;

    @Column(name = "data_emitere", nullable = false)
    private LocalDate dataEmitere;

    @Column(name = "data_scadenta")
    private LocalDate dataScadenta;

    @Column(name = "status_plata", length = 20, nullable = false)
    private String statusPlata = "neachitat";
}
