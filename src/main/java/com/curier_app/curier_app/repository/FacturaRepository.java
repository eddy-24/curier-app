package com.curier_app.curier_app.repository;

import com.curier_app.curier_app.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacturaRepository extends JpaRepository<Factura, Long> {
}
