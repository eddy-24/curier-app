package com.curier_app.curier_app.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comanda")
public class Comanda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comanda")
    private Long idComanda;

    // CLIENTUL
    @ManyToOne
    @JoinColumn(name = "id_client", nullable = false)
    private Utilizator client;

    // CURIERUL (poate fi null)
    @ManyToOne
    @JoinColumn(name = "id_curier_alocat")
    private Utilizator curier;

    @Column(name = "data_creare")
    private LocalDateTime dataCreare = LocalDateTime.now();

    @Column(name = "modalitate_plata", length = 20)
    private String modalitatePlata;

    @Column(name = "status_comanda", length = 20, nullable = false)
    private String statusComanda = "noua";

    // RELAȚIE 1 LA MULTE COLETE
    @OneToMany(mappedBy = "comanda", cascade = CascadeType.ALL)
    @JsonManagedReference("comanda-colete")
    private List<Colet> colete;
}
