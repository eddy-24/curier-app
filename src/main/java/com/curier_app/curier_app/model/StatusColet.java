package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "statusuri_colet")
public class StatusColet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String cod;

    @Column(nullable = false, length = 100)
    private String nume;

    @Column(length = 7)
    private String culoare;

    @Column(name = "ordine_afisare")
    private Integer ordineAfisare;

    @Column(nullable = false)
    private Boolean activ = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public StatusColet() {}

    public StatusColet(String cod, String nume, String culoare, Integer ordineAfisare) {
        this.cod = cod;
        this.nume = nume;
        this.culoare = culoare;
        this.ordineAfisare = ordineAfisare;
        this.activ = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCod() {
        return cod;
    }

    public void setCod(String cod) {
        this.cod = cod;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getCuloare() {
        return culoare;
    }

    public void setCuloare(String culoare) {
        this.culoare = culoare;
    }

    public Integer getOrdineAfisare() {
        return ordineAfisare;
    }

    public void setOrdineAfisare(Integer ordineAfisare) {
        this.ordineAfisare = ordineAfisare;
    }

    public Boolean getActiv() {
        return activ;
    }

    public void setActiv(Boolean activ) {
        this.activ = activ;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
