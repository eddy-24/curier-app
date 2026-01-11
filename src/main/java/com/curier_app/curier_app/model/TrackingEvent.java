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
@Table(name = "tracking_event")
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_event")
    private Long idEvent;

    @ManyToOne
    @JoinColumn(name = "id_colet", nullable = false)
    private Colet colet;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "locatie", length = 100)
    private String locatie;

    @Column(name = "descriere", length = 255)
    private String descriere;

    @Column(name = "data_event", nullable = false)
    private LocalDateTime dataEvent = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_utilizator")
    private Utilizator utilizator; // Cine a făcut update-ul (curier/sofer)
}
