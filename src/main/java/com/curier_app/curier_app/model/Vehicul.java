package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicul")
public class Vehicul {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vehicul")
    private Long idVehicul;

    @Column(name = "numar_inmatriculare", length = 15, nullable = false, unique = true)
    private String numarInmatriculare;

    @Column(length = 50)
    private String marca;

    @Column(length = 50)
    private String model;

    @Column(name = "tip_vehicul", length = 30, nullable = false)
    private String tipVehicul;  // duba, camion, scuter

    @Column(name = "capacitate_kg", precision = 8, scale = 2)
    private BigDecimal capacitateKg;

    @Column(name = "capacitate_volum_m3", precision = 8, scale = 2)
    private BigDecimal capacitateVolumM3;

    @Column(name = "status_vehicul", length = 20, nullable = false)
    private String statusVehicul = "activ"; // activ, in_service, retras
}
