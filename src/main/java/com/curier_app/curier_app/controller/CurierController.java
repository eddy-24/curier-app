package com.curier_app.curier_app.controller;

import com.curier_app.curier_app.model.*;
import com.curier_app.curier_app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/curier")
@CrossOrigin(origins = "*")
public class CurierController {

    @Autowired
    private ColetRepository coletRepository;
    
    @Autowired
    private ComandaRepository comandaRepository;
    
    @Autowired
    private UtilizatorRepository utilizatorRepository;
    
    @Autowired
    private TrackingEventRepository trackingEventRepository;
    
    @Autowired
    private AdresaRepository adresaRepository;

    // ==================== DASHBOARD ====================
    
    /**
     * GET /api/curier/{curierId}/dashboard
     * Statistici pentru dashboard curier
     */
    @GetMapping("/{curierId}/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@PathVariable Long curierId) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate azi = LocalDate.now();
        
        // Comenzile asignate curierului
        List<Comanda> comenziCurier = comandaRepository.findAll().stream()
                .filter(c -> c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId))
                .collect(Collectors.toList());
        
        // Coletele din comenzile curierului
        List<Colet> coleteCurier = coletRepository.findAll().stream()
                .filter(c -> comenziCurier.stream()
                        .anyMatch(cmd -> cmd.getIdComanda().equals(c.getComanda().getIdComanda())))
                .collect(Collectors.toList());
        
        // Pickup-uri azi (colete in_asteptare sau ridicat)
        long pickupuriAzi = coleteCurier.stream()
                .filter(c -> c.getStatusColet().equals("in_asteptare") || c.getStatusColet().equals("ridicat"))
                .count();
        
        // Livrări azi (colete in_tranzit sau in_livrare)
        long livrariAzi = coleteCurier.stream()
                .filter(c -> c.getStatusColet().equals("in_tranzit") || c.getStatusColet().equals("in_livrare"))
                .count();
        
        // Colete livrate azi
        long livrateAzi = trackingEventRepository.findAll().stream()
                .filter(te -> te.getStatus().equals("livrat"))
                .filter(te -> te.getDataEvent().toLocalDate().equals(azi))
                .filter(te -> te.getUtilizator() != null && te.getUtilizator().getIdUtilizator().equals(curierId))
                .count();
        
        // Ramburs de încasat (total valoare colete nelivrate cu ramburs)
        BigDecimal rambursDeIncasat = coleteCurier.stream()
                .filter(c -> !c.getStatusColet().equals("livrat"))
                .filter(c -> c.getPretDeclarat() != null && c.getPretDeclarat().compareTo(BigDecimal.ZERO) > 0)
                .map(Colet::getPretDeclarat)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Ramburs încasat azi (colete livrate azi cu valoare)
        BigDecimal rambursIncasatAzi = coleteCurier.stream()
                .filter(c -> c.getStatusColet().equals("livrat"))
                .filter(c -> c.getPretDeclarat() != null && c.getPretDeclarat().compareTo(BigDecimal.ZERO) > 0)
                .map(Colet::getPretDeclarat)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("pickupuriAzi", pickupuriAzi);
        stats.put("livrariAzi", livrariAzi);
        stats.put("livrateAzi", livrateAzi);
        stats.put("totalColete", coleteCurier.size());
        stats.put("rambursDeIncasat", rambursDeIncasat);
        stats.put("rambursIncasatAzi", rambursIncasatAzi);
        
        return ResponseEntity.ok(stats);
    }

    // ==================== PICKUP-URI AZI ====================
    
    /**
     * GET /api/curier/{curierId}/pickups
     * Lista coletelor de ridicat azi
     */
    @GetMapping("/{curierId}/pickups")
    public ResponseEntity<List<Map<String, Object>>> getPickups(@PathVariable Long curierId) {
        List<Comanda> comenziCurier = comandaRepository.findAll().stream()
                .filter(c -> c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId))
                .collect(Collectors.toList());
        
        List<Colet> pickups = coletRepository.findAll().stream()
                .filter(c -> comenziCurier.stream()
                        .anyMatch(cmd -> cmd.getIdComanda().equals(c.getComanda().getIdComanda())))
                .filter(c -> c.getStatusColet().equals("in_asteptare") || c.getStatusColet().equals("ridicat"))
                .collect(Collectors.toList());
        
        List<Map<String, Object>> result = pickups.stream()
                .map(this::mapColetToPickup)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    // ==================== LIVRĂRI AZI ====================
    
    /**
     * GET /api/curier/{curierId}/livrari
     * Lista coletelor de livrat azi
     */
    @GetMapping("/{curierId}/livrari")
    public ResponseEntity<List<Map<String, Object>>> getLivrari(@PathVariable Long curierId) {
        List<Comanda> comenziCurier = comandaRepository.findAll().stream()
                .filter(c -> c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId))
                .collect(Collectors.toList());
        
        List<Colet> livrari = coletRepository.findAll().stream()
                .filter(c -> comenziCurier.stream()
                        .anyMatch(cmd -> cmd.getIdComanda().equals(c.getComanda().getIdComanda())))
                .filter(c -> c.getStatusColet().equals("in_tranzit") || c.getStatusColet().equals("in_livrare"))
                .collect(Collectors.toList());
        
        List<Map<String, Object>> result = livrari.stream()
                .map(this::mapColetToLivrare)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    // ==================== SCAN AWB ====================
    
    /**
     * GET /api/curier/scan/{awb}
     * Caută colet după AWB
     */
    @GetMapping("/scan/{awb}")
    public ResponseEntity<?> scanAwb(@PathVariable String awb) {
        Optional<Colet> coletOpt = coletRepository.findByCodAwb(awb);
        
        if (coletOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Colet negăsit pentru AWB: " + awb));
        }
        
        Colet colet = coletOpt.get();
        Map<String, Object> result = new HashMap<>();
        result.put("idColet", colet.getIdColet());
        result.put("codAwb", colet.getCodAwb());
        result.put("status", colet.getStatusColet());
        result.put("greutate", colet.getGreutateKg());
        result.put("tipServiciu", colet.getTipServiciu());
        result.put("pretDeclarat", colet.getPretDeclarat());
        
        // Adresa expeditor
        if (colet.getAdresaExpeditor() != null) {
            Adresa exp = colet.getAdresaExpeditor();
            result.put("expeditor", Map.of(
                "oras", exp.getOras(),
                "strada", exp.getStrada(),
                "numar", exp.getNumar(),
                "codPostal", exp.getCodPostal() != null ? exp.getCodPostal() : "",
                "detalii", exp.getDetaliiSuplimentare() != null ? exp.getDetaliiSuplimentare() : "",
                "numeClient", exp.getUtilizator() != null ? 
                    exp.getUtilizator().getNume() + " " + exp.getUtilizator().getPrenume() : "N/A",
                "telefon", exp.getUtilizator() != null ? exp.getUtilizator().getTelefon() : "N/A"
            ));
        }
        
        // Adresa destinatar
        if (colet.getAdresaDestinatar() != null) {
            Adresa dest = colet.getAdresaDestinatar();
            result.put("destinatar", Map.of(
                "oras", dest.getOras(),
                "strada", dest.getStrada(),
                "numar", dest.getNumar(),
                "codPostal", dest.getCodPostal() != null ? dest.getCodPostal() : "",
                "detalii", dest.getDetaliiSuplimentare() != null ? dest.getDetaliiSuplimentare() : "",
                "numeClient", dest.getUtilizator() != null ? 
                    dest.getUtilizator().getNume() + " " + dest.getUtilizator().getPrenume() : "N/A",
                "telefon", dest.getUtilizator() != null ? dest.getUtilizator().getTelefon() : "N/A"
            ));
        }
        
        // Istoric tracking
        List<TrackingEvent> tracking = trackingEventRepository.findByColetOrderByDataEventDesc(colet.getIdColet());
        result.put("tracking", tracking.stream().map(te -> Map.of(
            "status", te.getStatus(),
            "locatie", te.getLocatie() != null ? te.getLocatie() : "",
            "descriere", te.getDescriere() != null ? te.getDescriere() : "",
            "dataEvent", te.getDataEvent().toString()
        )).collect(Collectors.toList()));
        
        return ResponseEntity.ok(result);
    }

    // ==================== UPDATE STATUS ====================
    
    /**
     * PUT /api/curier/colet/{coletId}/status
     * Actualizează statusul coletului + tracking event
     */
    @PutMapping("/colet/{coletId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long coletId,
            @RequestBody UpdateStatusRequest request) {
        
        Optional<Colet> coletOpt = coletRepository.findById(coletId);
        if (coletOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Colet negăsit"));
        }
        
        Optional<Utilizator> curierOpt = utilizatorRepository.findById(request.curierId);
        if (curierOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Curier negăsit"));
        }
        
        Colet colet = coletOpt.get();
        Utilizator curier = curierOpt.get();
        
        // Actualizăm statusul coletului
        colet.setStatusColet(request.status);
        coletRepository.save(colet);
        
        // Creăm tracking event
        TrackingEvent event = new TrackingEvent();
        event.setColet(colet);
        event.setStatus(request.status);
        event.setLocatie(request.locatie);
        event.setDescriere(buildDescriere(request));
        event.setDataEvent(LocalDateTime.now());
        event.setUtilizator(curier);
        trackingEventRepository.save(event);
        
        // Dacă e livrat, actualizăm și comanda
        if (request.status.equals("livrat")) {
            Comanda comanda = colet.getComanda();
            // Verificăm dacă toate coletele din comandă sunt livrate
            boolean toateLivrate = coletRepository.findByComanda(comanda.getIdComanda()).stream()
                    .allMatch(c -> c.getStatusColet().equals("livrat"));
            if (toateLivrate) {
                comanda.setStatusComanda("livrat");
                comandaRepository.save(comanda);
            }
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Status actualizat cu succes",
            "coletId", coletId,
            "newStatus", request.status
        ));
    }

    // ==================== RAMBURS ====================
    
    /**
     * GET /api/curier/{curierId}/ramburs
     * Lista coletelor cu ramburs de încasat
     */
    @GetMapping("/{curierId}/ramburs")
    public ResponseEntity<Map<String, Object>> getRamburs(@PathVariable Long curierId) {
        List<Comanda> comenziCurier = comandaRepository.findAll().stream()
                .filter(c -> c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId))
                .collect(Collectors.toList());
        
        List<Colet> coleteRamburs = coletRepository.findAll().stream()
                .filter(c -> comenziCurier.stream()
                        .anyMatch(cmd -> cmd.getIdComanda().equals(c.getComanda().getIdComanda())))
                .filter(c -> c.getPretDeclarat() != null && c.getPretDeclarat().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());
        
        // Neîncasate (nelivrate)
        List<Map<String, Object>> neincasate = coleteRamburs.stream()
                .filter(c -> !c.getStatusColet().equals("livrat"))
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("idColet", c.getIdColet());
                    m.put("codAwb", c.getCodAwb());
                    m.put("suma", c.getPretDeclarat());
                    m.put("status", c.getStatusColet());
                    if (c.getAdresaDestinatar() != null) {
                        m.put("destinatar", c.getAdresaDestinatar().getOras() + ", " + 
                            c.getAdresaDestinatar().getStrada() + " " + c.getAdresaDestinatar().getNumar());
                    }
                    return m;
                })
                .collect(Collectors.toList());
        
        // Încasate (livrate)
        List<Map<String, Object>> incasate = coleteRamburs.stream()
                .filter(c -> c.getStatusColet().equals("livrat"))
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("idColet", c.getIdColet());
                    m.put("codAwb", c.getCodAwb());
                    m.put("suma", c.getPretDeclarat());
                    m.put("status", c.getStatusColet());
                    return m;
                })
                .collect(Collectors.toList());
        
        BigDecimal totalNeincasat = neincasate.stream()
                .map(m -> (BigDecimal) m.get("suma"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalIncasat = incasate.stream()
                .map(m -> (BigDecimal) m.get("suma"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> result = new HashMap<>();
        result.put("neincasate", neincasate);
        result.put("incasate", incasate);
        result.put("totalNeincasat", totalNeincasat);
        result.put("totalIncasat", totalIncasat);
        
        return ResponseEntity.ok(result);
    }

    // ==================== HELPER METHODS ====================
    
    private Map<String, Object> mapColetToPickup(Colet colet) {
        Map<String, Object> m = new HashMap<>();
        m.put("idColet", colet.getIdColet());
        m.put("codAwb", colet.getCodAwb());
        m.put("status", colet.getStatusColet());
        m.put("greutate", colet.getGreutateKg());
        m.put("tipServiciu", colet.getTipServiciu());
        
        if (colet.getAdresaExpeditor() != null) {
            Adresa exp = colet.getAdresaExpeditor();
            m.put("adresaPickup", exp.getOras() + ", " + exp.getStrada() + " " + exp.getNumar());
            m.put("detaliiAdresa", exp.getDetaliiSuplimentare());
            if (exp.getUtilizator() != null) {
                m.put("numeExpeditor", exp.getUtilizator().getNume() + " " + exp.getUtilizator().getPrenume());
                m.put("telefonExpeditor", exp.getUtilizator().getTelefon());
            }
        }
        
        return m;
    }
    
    private Map<String, Object> mapColetToLivrare(Colet colet) {
        Map<String, Object> m = new HashMap<>();
        m.put("idColet", colet.getIdColet());
        m.put("codAwb", colet.getCodAwb());
        m.put("status", colet.getStatusColet());
        m.put("greutate", colet.getGreutateKg());
        m.put("tipServiciu", colet.getTipServiciu());
        m.put("pretDeclarat", colet.getPretDeclarat());
        m.put("areRamburs", colet.getPretDeclarat() != null && colet.getPretDeclarat().compareTo(BigDecimal.ZERO) > 0);
        
        if (colet.getAdresaDestinatar() != null) {
            Adresa dest = colet.getAdresaDestinatar();
            m.put("adresaLivrare", dest.getOras() + ", " + dest.getStrada() + " " + dest.getNumar());
            m.put("detaliiAdresa", dest.getDetaliiSuplimentare());
            if (dest.getUtilizator() != null) {
                m.put("numeDestinatar", dest.getUtilizator().getNume() + " " + dest.getUtilizator().getPrenume());
                m.put("telefonDestinatar", dest.getUtilizator().getTelefon());
            }
        }
        
        return m;
    }
    
    private String buildDescriere(UpdateStatusRequest request) {
        StringBuilder sb = new StringBuilder();
        
        switch (request.status) {
            case "ridicat":
                sb.append("Colet preluat de la expeditor");
                break;
            case "in_tranzit":
                sb.append("Colet în tranzit");
                break;
            case "in_livrare":
                sb.append("Colet în curs de livrare");
                break;
            case "livrat":
                sb.append("Colet livrat cu succes");
                if (request.semnatura != null && !request.semnatura.isEmpty()) {
                    sb.append(". Semnătură: ").append(request.semnatura);
                }
                if (request.rambursIncasat != null && request.rambursIncasat) {
                    sb.append(". Ramburs încasat.");
                }
                break;
            case "respins":
                sb.append("Livrare eșuată - destinatar refuză");
                if (request.motivRespingere != null) {
                    sb.append(": ").append(request.motivRespingere);
                }
                break;
            case "returnat":
                sb.append("Colet returnat la expeditor");
                break;
            default:
                sb.append("Status actualizat: ").append(request.status);
        }
        
        if (request.nota != null && !request.nota.isEmpty()) {
            sb.append(". Notă: ").append(request.nota);
        }
        
        return sb.toString();
    }

    // ==================== REQUEST CLASSES ====================
    
    public static class UpdateStatusRequest {
        public Long curierId;
        public String status;
        public String locatie;
        public String semnatura;
        public String pozaUrl;
        public Boolean rambursIncasat;
        public String motivRespingere;
        public String nota;
    }
}
