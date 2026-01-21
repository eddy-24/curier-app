package com.curier_app.curier_app.controller;

import com.curier_app.curier_app.model.*;
import com.curier_app.curier_app.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5174")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ==================== DASHBOARD ====================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/dashboard/activitate")
    public ResponseEntity<List<Map<String, Object>>> getActivitateRecenta(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(adminService.getActivitateRecenta(limit));
    }

    // ==================== UTILIZATORI ====================

    @GetMapping("/utilizatori")
    public ResponseEntity<List<Utilizator>> getAllUtilizatori() {
        return ResponseEntity.ok(adminService.getAllUtilizatori());
    }

    @GetMapping("/utilizatori/{id}")
    public ResponseEntity<Utilizator> getUtilizatorById(@PathVariable Long id) {
        return adminService.getUtilizatorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/utilizatori/rol/{rol}")
    public ResponseEntity<List<Utilizator>> getUtilizatoriByRol(@PathVariable String rol) {
        return ResponseEntity.ok(adminService.getUtilizatoriByRol(rol));
    }

    @PostMapping("/utilizatori")
    public ResponseEntity<Utilizator> createUtilizator(@RequestBody Utilizator utilizator) {
        return ResponseEntity.ok(adminService.createUtilizator(utilizator));
    }

    @PutMapping("/utilizatori/{id}")
    public ResponseEntity<Utilizator> updateUtilizator(
            @PathVariable Long id, 
            @RequestBody Utilizator utilizator) {
        try {
            return ResponseEntity.ok(adminService.updateUtilizator(id, utilizator));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/utilizatori/{id}")
    public ResponseEntity<Void> deleteUtilizator(@PathVariable Long id) {
        adminService.deleteUtilizator(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/utilizatori/{id}/toggle-activ")
    public ResponseEntity<Utilizator> toggleActivUtilizator(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.toggleActivUtilizator(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== SERVICII ====================

    @GetMapping("/servicii")
    public ResponseEntity<List<Serviciu>> getAllServicii() {
        return ResponseEntity.ok(adminService.getAllServicii());
    }

    @GetMapping("/servicii/active")
    public ResponseEntity<List<Serviciu>> getServiciiActive() {
        return ResponseEntity.ok(adminService.getServiciiActive());
    }

    @GetMapping("/servicii/{id}")
    public ResponseEntity<Serviciu> getServiciuById(@PathVariable Long id) {
        return adminService.getServiciuById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/servicii")
    public ResponseEntity<Serviciu> createServiciu(@RequestBody Serviciu serviciu) {
        return ResponseEntity.ok(adminService.createServiciu(serviciu));
    }

    @PutMapping("/servicii/{id}")
    public ResponseEntity<Serviciu> updateServiciu(
            @PathVariable Long id, 
            @RequestBody Serviciu serviciu) {
        try {
            return ResponseEntity.ok(adminService.updateServiciu(id, serviciu));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/servicii/{id}")
    public ResponseEntity<Void> deleteServiciu(@PathVariable Long id) {
        adminService.deleteServiciu(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/servicii/{id}/toggle-activ")
    public ResponseEntity<Serviciu> toggleActivServiciu(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.toggleActivServiciu(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== RAPOARTE KPI ====================

    @GetMapping("/rapoarte/kpi")
    public ResponseEntity<Map<String, Object>> getRapoarteKPI(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "luna") String perioada) {
        
        // Dacă nu sunt specificate datele, le calculăm pe baza perioadei
        if (startDate == null || endDate == null) {
            endDate = LocalDate.now();
            switch (perioada) {
                case "saptamana":
                    startDate = endDate.minusWeeks(1);
                    break;
                case "trimestru":
                    startDate = endDate.minusMonths(3);
                    break;
                case "an":
                    startDate = endDate.minusYears(1);
                    break;
                case "luna":
                default:
                    startDate = endDate.minusMonths(1);
                    break;
            }
        }
        
        return ResponseEntity.ok(adminService.getRapoarteKPI(startDate, endDate));
    }

    @GetMapping("/rapoarte/lunar")
    public ResponseEntity<List<Map<String, Object>>> getRapoarteLunare(
            @RequestParam(required = false) Integer an) {
        if (an == null) {
            an = LocalDate.now().getYear();
        }
        return ResponseEntity.ok(adminService.getRapoarteLunare(an));
    }

    @GetMapping("/rapoarte/curieri")
    public ResponseEntity<List<Map<String, Object>>> getPerformantaCurieri(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(adminService.getPerformantaCurieri(startDate, endDate));
    }

    @GetMapping("/rapoarte/export")
    public ResponseEntity<byte[]> exportRapoarteCSV(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "luna") String perioada) {
        
        // Dacă nu sunt specificate datele, le calculăm pe baza perioadei
        if (startDate == null || endDate == null) {
            endDate = LocalDate.now();
            switch (perioada) {
                case "saptamana":
                    startDate = endDate.minusWeeks(1);
                    break;
                case "trimestru":
                    startDate = endDate.minusMonths(3);
                    break;
                case "an":
                    startDate = endDate.minusYears(1);
                    break;
                case "luna":
                default:
                    startDate = endDate.minusMonths(1);
                    break;
            }
        }
        
        Map<String, Object> kpi = adminService.getRapoarteKPI(startDate, endDate);
        
        StringBuilder csv = new StringBuilder();
        csv.append("RAPORT KPI - BEAK COURIER\n");
        csv.append("Perioada:,").append(startDate).append(" - ").append(endDate).append("\n\n");
        
        csv.append("METRICA,VALOARE\n");
        csv.append("Total Colete,").append(kpi.getOrDefault("totalColete", 0)).append("\n");
        csv.append("Colete Livrate,").append(kpi.getOrDefault("coleteLivrate", 0)).append("\n");
        csv.append("Colete Returnate,").append(kpi.getOrDefault("coleteReturnat", 0)).append("\n");
        csv.append("Colete Esuate,").append(kpi.getOrDefault("coleteEsuat", 0)).append("\n");
        csv.append("Rata Livrare (%),").append(kpi.getOrDefault("rataLivrare", 0)).append("\n");
        csv.append("Timp Mediu Livrare (ore),").append(kpi.getOrDefault("timpMediuLivrare", 0)).append("\n");
        csv.append("Venituri Totale (RON),").append(kpi.getOrDefault("venituriTotale", 0)).append("\n");
        csv.append("Ramburs Incasat (RON),").append(kpi.getOrDefault("rambursIncasat", 0)).append("\n");
        csv.append("Curieri Activi,").append(kpi.getOrDefault("curieriActivi", 0)).append("\n");
        csv.append("Clienti Activi,").append(kpi.getOrDefault("clientiActivi", 0)).append("\n");
        
        byte[] csvBytes = csv.toString().getBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "raport_kpi_" + startDate + "_" + endDate + ".csv");
        headers.setContentLength(csvBytes.length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}
