package com.curier_app.curier_app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "motive_esec")
public class MotivEsec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String cod;

    @Column(nullable = false, length = 200)
    private String descriere;

    @Column(name = "necesita_reprogramare")
    private Boolean necesitaReprogramare = false;

    @Column(nullable = false)
    private Boolean activ = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public MotivEsec() {}

    public MotivEsec(String cod, String descriere, Boolean necesitaReprogramare) {
        this.cod = cod;
        this.descriere = descriere;
        this.necesitaReprogramare = necesitaReprogramare;
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

    public String getDescriere() {
        return descriere;
    }

    public void setDescriere(String descriere) {
        this.descriere = descriere;
    }

    public Boolean getNecesitaReprogramare() {
        return necesitaReprogramare;
    }

    public void setNecesitaReprogramare(Boolean necesitaReprogramare) {
        this.necesitaReprogramare = necesitaReprogramare;
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
