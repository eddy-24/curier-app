package com.curier_app.curier_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
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

    // Câmpuri adiționale pentru adresă completă
    @Column(length = 10)
    private String bloc;

    @Column(length = 10)
    private String scara;

    @Column(length = 10)
    private String apartament;

    @Column(length = 50)
    private String judet;

    @Column(length = 50)
    private String tara;

    @Column(name = "persoana_contact", length = 100)
    private String persoanaContact;

    @Column(name = "telefon_contact", length = 20)
    private String telefonContact;
}
