package com.curier_app.curier_app.controller;

import com.curier_app.curier_app.model.*;
import com.curier_app.curier_app.repository.ColetRepository;
import com.curier_app.curier_app.service.ClientService;
import com.curier_app.curier_app.service.ClientService.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private ColetRepository coletRepository;

    // ==================== DASHBOARD ====================

    /**
     * GET /api/client/{clientId}/dashboard
     * Obține statistici pentru dashboard
     */
    @GetMapping("/{clientId}/dashboard")
    public ResponseEntity<DashboardStats> getDashboard(@PathVariable Long clientId) {
        DashboardStats stats = clientService.getDashboardStats(clientId);
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/client/{clientId}/expedieri/recente
     * Obține expedierile recente (ultimele 10)
     */
    @GetMapping("/{clientId}/expedieri/recente")
    public ResponseEntity<List<Comanda>> getExpedieriRecente(@PathVariable Long clientId) {
        List<Comanda> expedieri = clientService.getExpedieriRecente(clientId);
        return ResponseEntity.ok(expedieri);
    }

    // ==================== EXPEDIERI ====================

    /**
     * GET /api/client/{clientId}/expedieri
     * Obține toate expedierile clientului
     */
    @GetMapping("/{clientId}/expedieri")
    public ResponseEntity<List<Comanda>> getExpedieri(@PathVariable Long clientId) {
        List<Comanda> expedieri = clientService.getExpedieriClient(clientId);
        return ResponseEntity.ok(expedieri);
    }

    /**
     * GET /api/client/expedieri/{comandaId}
     * Obține detaliile unei expedieri
     */
    @GetMapping("/expedieri/{comandaId}")
    public ResponseEntity<Comanda> getExpediere(@PathVariable Long comandaId) {
        return clientService.getExpediereById(comandaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/client/{clientId}/expedieri
     * Creează o nouă expediere (wizard)
     */
    @PostMapping("/{clientId}/expedieri")
    public ResponseEntity<?> creeazaExpediere(
            @PathVariable Long clientId,
            @RequestBody ExpediereRequest request) {
        try {
            Comanda comanda = clientService.creeazaExpediere(clientId, request);
            // Obține AWB-urile coletelor create
            List<Colet> colete = coletRepository.findByComandaId(comanda.getIdComanda());
            List<String> awbCoduri = colete.stream()
                    .map(Colet::getCodAwb)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Expediere creată cu succes!",
                "comandaId", comanda.getIdComanda(),
                "awbCoduri", awbCoduri
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // ==================== TRACKING ====================

    /**
     * GET /api/client/tracking/{codAwb}
     * Obține tracking-ul unui colet după AWB
     */
    @GetMapping("/tracking/{codAwb}")
    public ResponseEntity<?> getTracking(@PathVariable String codAwb) {
        var coletOpt = clientService.getColetByAwb(codAwb);
        if (coletOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Colet colet = coletOpt.get();
        List<TrackingEvent> events = clientService.getTrackingByAwb(codAwb);
        
        // Extrage informații despre comandă pentru restituire bani
        var comanda = colet.getComanda();
        String metodaPlata = comanda != null ? comanda.getModalitatePlata() : null;
        
        // Calculează costul (din factura asociată sau 0)
        var facturi = comanda != null && comanda.getClient() != null 
            ? clientService.getFacturiClient(comanda.getClient().getIdUtilizator())
            : java.util.Collections.<Factura>emptyList();
        
        Double costCalculat = facturi.stream()
            .filter(f -> f.getComanda() != null && f.getComanda().getIdComanda().equals(comanda.getIdComanda()))
            .findFirst()
            .map(f -> f.getSumaTotala() != null ? f.getSumaTotala().doubleValue() : 0.0)
            .orElse(0.0);
        
        // Construiește răspunsul cu toate datele
        java.util.Map<String, Object> coletData = new java.util.HashMap<>();
        coletData.put("idColet", colet.getIdColet());
        coletData.put("codAwb", colet.getCodAwb());
        coletData.put("statusColet", colet.getStatusColet());
        coletData.put("tipServiciu", colet.getTipServiciu());
        coletData.put("greutateKg", colet.getGreutateKg());
        coletData.put("pretDeclarat", colet.getPretDeclarat());
        coletData.put("rambursIncasat", colet.getRambursIncasat());
        coletData.put("adresaExpeditor", colet.getAdresaExpeditor());
        coletData.put("adresaDestinatar", colet.getAdresaDestinatar());
        coletData.put("metodaPlata", metodaPlata);
        coletData.put("costCalculat", costCalculat);
        
        return ResponseEntity.ok(Map.of(
            "colet", coletData,
            "events", events
        ));
    }

    /**
     * GET /api/client/tracking/colet/{coletId}
     * Obține tracking-ul unui colet după ID
     */
    @GetMapping("/tracking/colet/{coletId}")
    public ResponseEntity<List<TrackingEvent>> getTrackingByColetId(@PathVariable Long coletId) {
        List<TrackingEvent> events = clientService.getTrackingByColetId(coletId);
        return ResponseEntity.ok(events);
    }

    // ==================== FACTURI ====================

    /**
     * GET /api/client/{clientId}/facturi
     * Obține toate facturile clientului
     */
    @GetMapping("/{clientId}/facturi")
    public ResponseEntity<List<Factura>> getFacturi(@PathVariable Long clientId) {
        List<Factura> facturi = clientService.getFacturiClient(clientId);
        return ResponseEntity.ok(facturi);
    }

    /**
     * GET /api/client/facturi/{facturaId}
     * Obține detaliile unei facturi
     */
    @GetMapping("/facturi/{facturaId}")
    public ResponseEntity<Factura> getFactura(@PathVariable Long facturaId) {
        return clientService.getFacturaById(facturaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/client/{clientId}/facturi/{facturaId}/plateste
     * Marchează o factură ca plătită
     */
    @PostMapping("/{clientId}/facturi/{facturaId}/plateste")
    public ResponseEntity<?> platesteFactura(@PathVariable Long clientId, @PathVariable Long facturaId) {
        try {
            clientService.platesteFactura(facturaId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Factura a fost plătită cu succes!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * GET /api/client/{clientId}/facturi/{facturaId}/pdf
     * Descarcă PDF-ul unei facturi
     */
    @GetMapping("/{clientId}/facturi/{facturaId}/pdf")
    public ResponseEntity<byte[]> downloadFacturaPDF(@PathVariable Long clientId, @PathVariable Long facturaId) {
        try {
            byte[] pdfBytes = clientService.generateFacturaPDF(facturaId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "factura_" + facturaId + ".pdf");
            headers.setContentLength(pdfBytes.length);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== ADRESE ====================

    /**
     * GET /api/client/{clientId}/adrese
     * Obține toate adresele clientului
     */
    @GetMapping("/{clientId}/adrese")
    public ResponseEntity<List<Adresa>> getAdrese(@PathVariable Long clientId) {
        List<Adresa> adrese = clientService.getAdreseClient(clientId);
        return ResponseEntity.ok(adrese);
    }

    /**
     * POST /api/client/{clientId}/adrese
     * Adaugă o adresă nouă
     */
    @PostMapping("/{clientId}/adrese")
    public ResponseEntity<?> adaugaAdresa(
            @PathVariable Long clientId,
            @RequestBody Adresa adresa) {
        try {
            Adresa saved = clientService.adaugaAdresa(clientId, adresa);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Adresă adăugată cu succes!",
                "adresa", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * PUT /api/client/{clientId}/adrese/{adresaId}
     * Actualizează o adresă
     */
    @PutMapping("/{clientId}/adrese/{adresaId}")
    public ResponseEntity<?> actualizeazaAdresa(
            @PathVariable Long clientId,
            @PathVariable Long adresaId,
            @RequestBody Adresa adresa) {
        try {
            Adresa updated = clientService.actualizeazaAdresa(adresaId, adresa);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Adresă actualizată!",
                "adresa", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * DELETE /api/client/{clientId}/adrese/{adresaId}
     * Șterge o adresă
     */
    @DeleteMapping("/{clientId}/adrese/{adresaId}")
    public ResponseEntity<?> stergeAdresa(@PathVariable Long clientId, @PathVariable Long adresaId) {
        try {
            clientService.stergeAdresa(adresaId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Adresă ștearsă!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
