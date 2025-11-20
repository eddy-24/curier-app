package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "adresa")
public class Adresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_adresa")
    private Long idAdresa;

    @ManyToOne
    @JoinColumn(name = "id_utilizator") // FK către utilizator
    private Utilizator utilizator;

    @Column(nullable = false, length = 50)
    private String oras;

    @Column(nullable = false, length = 100)
    private String strada;

    @Column(length = 10)
    private String numar;

    @Column(length = 10)
    private String codPostal;

    @Column(name = "detalii_suplimentare", length = 100)
    private String detaliiSuplimentare;
}
