package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "depozite")
public class Depozit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nume;

    @Column(length = 500)
    private String adresa;

    @Column(length = 100)
    private String oras;

    @Column(length = 50)
    private String judet;

    @Column(length = 20)
    private String telefon;

    @Column(length = 100)
    private String email;

    @Column(name = "capacitate_maxima")
    private Integer capacitateMaxima;

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
    public Depozit() {}

    public Depozit(String nume, String adresa, String oras, String judet) {
        this.nume = nume;
        this.adresa = adresa;
        this.oras = oras;
        this.judet = judet;
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

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public String getOras() {
        return oras;
    }

    public void setOras(String oras) {
        this.oras = oras;
    }

    public String getJudet() {
        return judet;
    }

    public void setJudet(String judet) {
        this.judet = judet;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getCapacitateMaxima() {
        return capacitateMaxima;
    }

    public void setCapacitateMaxima(Integer capacitateMaxima) {
        this.capacitateMaxima = capacitateMaxima;
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
