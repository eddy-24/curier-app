package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "servicii")
public class Serviciu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nume;

    @Column(length = 500)
    private String descriere;

    @Column(name = "pret_baza", precision = 10, scale = 2)
    private BigDecimal pretBaza;

    @Column(name = "pret_per_kg", precision = 10, scale = 2)
    private BigDecimal pretPerKg;

    @Column(name = "timp_livrare", length = 50)
    private String timpLivrare;

    @Column(nullable = false)
    private Boolean activ = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Serviciu() {}

    public Serviciu(String nume, String descriere, BigDecimal pretBaza, BigDecimal pretPerKg, String timpLivrare) {
        this.nume = nume;
        this.descriere = descriere;
        this.pretBaza = pretBaza;
        this.pretPerKg = pretPerKg;
        this.timpLivrare = timpLivrare;
        this.activ = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getDescriere() {
        return descriere;
    }

    public void setDescriere(String descriere) {
        this.descriere = descriere;
    }

    public BigDecimal getPretBaza() {
        return pretBaza;
    }

    public void setPretBaza(BigDecimal pretBaza) {
        this.pretBaza = pretBaza;
    }

    public BigDecimal getPretPerKg() {
        return pretPerKg;
    }

    public void setPretPerKg(BigDecimal pretPerKg) {
        this.pretPerKg = pretPerKg;
    }

    public String getTimpLivrare() {
        return timpLivrare;
    }

    public void setTimpLivrare(String timpLivrare) {
        this.timpLivrare = timpLivrare;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
