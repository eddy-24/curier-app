package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "utilizator")
public class Utilizator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilizator")
    private Long idUtilizator;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String parola;

    @Column(length = 50)
    private String nume;

    @Column(length = 50)
    private String prenume;

    @Column(length = 15)
    private String telefon;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String rol; // client, curier, sofer, admin
}
