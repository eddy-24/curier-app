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
    
    @Autowired
    private FacturaRepository facturaRepository;
    
    @Autowired
    private RutaCurierRepository rutaCurierRepository;

    // ==================== DASHBOARD ====================
    
    /**
     * GET /api/curier/{curierId}/dashboard
     * Statistici pentru dashboard curier
     */
    @GetMapping("/{curierId}/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@PathVariable Long curierId) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate azi = LocalDate.now();
        
        // Coletele asignate curierului (fie direct pe colet, fie prin comandă)
        List<Colet> coleteCurier = coletRepository.findAll().stream()
                .filter(c -> {
                    // Verifică dacă curierul e asignat direct pe colet
                    if (c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    // Sau dacă curierul e asignat pe comandă
                    if (c.getComanda() != null && c.getComanda().getCurier() != null 
                            && c.getComanda().getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        
        // Pickup-uri azi (colete in_asteptare, asteptare_plata sau preluat_curier)
        long pickupuriAzi = coleteCurier.stream()
                .filter(c -> c.getStatusColet().equals("in_asteptare") 
                        || c.getStatusColet().equals("asteptare_plata")
                        || c.getStatusColet().equals("preluat_curier"))
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
        
        // Ramburs încasat azi (colete livrate azi cu valoare + plăți cash încasate de la pickup-uri)
        BigDecimal rambursIncasatAzi = coleteCurier.stream()
                .filter(c -> c.getStatusColet().equals("livrat"))
                .filter(c -> c.getPretDeclarat() != null && c.getPretDeclarat().compareTo(BigDecimal.ZERO) > 0)
                .map(Colet::getPretDeclarat)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Adaugă plățile cash încasate de la pickup-uri (dacă coletul nu mai e în asteptare_plata)
        for (Colet colet : coleteCurier) {
            if (colet.getComanda() != null && "cash".equals(colet.getComanda().getModalitatePlata())) {
                // Dacă nu mai e în asteptare_plata, înseamnă că plata a fost încasată
                if (!"asteptare_plata".equals(colet.getStatusColet())) {
                    Optional<Factura> facturaOpt = facturaRepository.findByComandaId(colet.getComanda().getIdComanda());
                    if (facturaOpt.isPresent()) {
                        rambursIncasatAzi = rambursIncasatAzi.add(facturaOpt.get().getSumaTotala());
                    }
                }
            }
        }
        
        // Sumă de încasat de la pickup-uri (doar colete în asteptare_plata)
        BigDecimal sumaDeIncasatPickup = BigDecimal.ZERO;
        for (Colet colet : coleteCurier) {
            // Doar coletele care așteaptă plata
            if (colet.getStatusColet().equals("asteptare_plata")) {
                // Verifică dacă e plată cash
                if (colet.getComanda() != null && "cash".equals(colet.getComanda().getModalitatePlata())) {
                    Optional<Factura> facturaOpt = facturaRepository.findByComandaId(colet.getComanda().getIdComanda());
                    if (facturaOpt.isPresent()) {
                        sumaDeIncasatPickup = sumaDeIncasatPickup.add(facturaOpt.get().getSumaTotala());
                    }
                }
            }
        }
        
        stats.put("pickupuriAzi", pickupuriAzi);
        stats.put("livrariAzi", livrariAzi);
        stats.put("livrateAzi", livrateAzi);
        stats.put("totalColete", coleteCurier.size());
        stats.put("rambursDeIncasat", rambursDeIncasat);
        stats.put("rambursIncasatAzi", rambursIncasatAzi);
        stats.put("sumaDeIncasatPickup", sumaDeIncasatPickup);
        
        return ResponseEntity.ok(stats);
    }

    // ==================== PICKUP-URI AZI ====================
    
    /**
     * GET /api/curier/{curierId}/pickups
     * Lista coletelor de ridicat azi
     */
    @GetMapping("/{curierId}/pickups")
    public ResponseEntity<List<Map<String, Object>>> getPickups(@PathVariable Long curierId) {
        // Găsește coletele asignate curierului (fie direct pe colet, fie prin comandă)
        List<Colet> pickups = coletRepository.findAll().stream()
                .filter(c -> {
                    // Verifică dacă curierul e asignat direct pe colet
                    if (c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    // Sau dacă curierul e asignat pe comandă
                    if (c.getComanda() != null && c.getComanda().getCurier() != null 
                            && c.getComanda().getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    return false;
                })
                .filter(c -> c.getStatusColet().equals("in_asteptare") 
                        || c.getStatusColet().equals("asteptare_plata")
                        || c.getStatusColet().equals("preluat_curier"))
                .collect(Collectors.toList());
        
        List<Map<String, Object>> result = pickups.stream()
                .map(this::mapColetToPickup)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * POST /api/curier/{curierId}/colet/{coletId}/incaseaza-plata
     * Curierul încasează plata numerar și coletul devine gata de ridicare
     */
    @PostMapping("/{curierId}/colet/{coletId}/incaseaza-plata")
    public ResponseEntity<Map<String, Object>> incasarePlata(
            @PathVariable Long curierId,
            @PathVariable Long coletId) {
        
        Map<String, Object> response = new HashMap<>();
        
        // Găsește coletul
        Optional<Colet> coletOpt = coletRepository.findById(coletId);
        if (coletOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Coletul nu a fost găsit");
            return ResponseEntity.badRequest().body(response);
        }
        
        Colet colet = coletOpt.get();
        
        // Verifică că statusul este "asteptare_plata"
        if (!"asteptare_plata".equals(colet.getStatusColet())) {
            response.put("success", false);
            response.put("message", "Coletul nu este în așteptare plată");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Actualizează statusul coletului la "in_asteptare" (gata de ridicare)
        colet.setStatusColet("in_asteptare");
        coletRepository.save(colet);
        
        // Marchează factura ca achitată
        Comanda comanda = colet.getComanda();
        if (comanda != null) {
            Optional<Factura> facturaOpt = facturaRepository.findByComandaId(comanda.getIdComanda());
            if (facturaOpt.isPresent()) {
                Factura factura = facturaOpt.get();
                factura.setStatusPlata("achitat");
                facturaRepository.save(factura);
            }
        }
        
        // Adaugă eveniment de tracking
        TrackingEvent event = new TrackingEvent();
        event.setColet(colet);
        event.setDataEvent(LocalDateTime.now());
        event.setStatus("plata_incasata");
        event.setDescriere("Plata în numerar a fost încasată de curier. Coletul este gata de ridicare.");
        trackingEventRepository.save(event);
        
        response.put("success", true);
        response.put("message", "Plata a fost încasată cu succes");
        response.put("newStatus", "in_asteptare");
        
        return ResponseEntity.ok(response);
    }

    // ==================== LIVRĂRI AZI ====================
    
    /**
     * GET /api/curier/{curierId}/livrari
     * Lista coletelor de livrat azi
     */
    @GetMapping("/{curierId}/livrari")
    public ResponseEntity<List<Map<String, Object>>> getLivrari(@PathVariable Long curierId) {
        // Găsește coletele asignate curierului (fie direct pe colet, fie prin comandă)
        List<Colet> livrari = coletRepository.findAll().stream()
                .filter(c -> {
                    // Verifică dacă curierul e asignat direct pe colet
                    if (c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    // Sau dacă curierul e asignat pe comandă
                    if (c.getComanda() != null && c.getComanda().getCurier() != null 
                            && c.getComanda().getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    return false;
                })
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
     * Lista coletelor cu ramburs de încasat + plăți cash de la pickup-uri
     */
    @GetMapping("/{curierId}/ramburs")
    public ResponseEntity<Map<String, Object>> getRamburs(@PathVariable Long curierId) {
        // Găsește toate coletele asignate curierului (fie direct, fie prin comandă)
        List<Colet> coleteCurier = coletRepository.findAll().stream()
                .filter(c -> {
                    if (c.getCurier() != null && c.getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    if (c.getComanda() != null && c.getComanda().getCurier() != null 
                            && c.getComanda().getCurier().getIdUtilizator().equals(curierId)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        
        List<Map<String, Object>> neincasate = new ArrayList<>();
        List<Map<String, Object>> incasate = new ArrayList<>();
        
        for (Colet colet : coleteCurier) {
            // 1. Verifică ramburs (pretDeclarat > 0)
            if (colet.getPretDeclarat() != null && colet.getPretDeclarat().compareTo(BigDecimal.ZERO) > 0) {
                Map<String, Object> m = new HashMap<>();
                m.put("idColet", colet.getIdColet());
                m.put("codAwb", colet.getCodAwb());
                m.put("suma", colet.getPretDeclarat());
                m.put("status", colet.getStatusColet());
                m.put("tip", "ramburs");
                if (colet.getAdresaDestinatar() != null) {
                    m.put("destinatar", colet.getAdresaDestinatar().getOras() + ", " + 
                        colet.getAdresaDestinatar().getStrada() + " " + colet.getAdresaDestinatar().getNumar());
                }
                
                if (colet.getStatusColet().equals("livrat")) {
                    incasate.add(m);
                } else {
                    neincasate.add(m);
                }
            }
            
            // 2. Verifică plată cash de la pickup-uri
            if (colet.getComanda() != null && "cash".equals(colet.getComanda().getModalitatePlata())) {
                Optional<Factura> facturaOpt = facturaRepository.findByComandaId(colet.getComanda().getIdComanda());
                if (facturaOpt.isPresent()) {
                    Factura factura = facturaOpt.get();
                    Map<String, Object> m = new HashMap<>();
                    m.put("idColet", colet.getIdColet());
                    m.put("codAwb", colet.getCodAwb());
                    m.put("suma", factura.getSumaTotala());
                    m.put("status", colet.getStatusColet());
                    m.put("tip", "plata_pickup");
                    if (colet.getAdresaExpeditor() != null) {
                        m.put("expeditor", colet.getAdresaExpeditor().getOras() + ", " + 
                            colet.getAdresaExpeditor().getStrada() + " " + colet.getAdresaExpeditor().getNumar());
                    }
                    
                    // Dacă coletul nu mai e în asteptare_plata, înseamnă că plata a fost încasată
                    // (curierul nu poate ridica fără să încaseze)
                    if (!"asteptare_plata".equals(colet.getStatusColet())) {
                        incasate.add(m);
                    } else {
                        neincasate.add(m);
                    }
                }
            }
        }
        
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
    
    /**
     * POST /api/curier/{curierId}/ramburs/{coletId}/incaseaza
     * Marchează un ramburs ca fiind încasat
     */
    @PostMapping("/{curierId}/ramburs/{coletId}/incaseaza")
    public ResponseEntity<Map<String, Object>> incaseazaRamburs(
            @PathVariable Long curierId,
            @PathVariable Long coletId,
            @RequestBody(required = false) Map<String, Object> requestBody) {
        
        Optional<Colet> optColet = coletRepository.findById(coletId);
        if (!optColet.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Colet colet = optColet.get();
        
        // Verifică dacă coletul este asignat curierului
        if (colet.getComanda() == null || colet.getComanda().getCurier() == null || 
            !colet.getComanda().getCurier().getIdUtilizator().equals(curierId)) {
            return ResponseEntity.badRequest().build();
        }
        
        // Marchează coletul ca livrat și rambursul ca încasat
        colet.setStatusColet("livrat");
        colet.setRambursIncasat(true);
        colet.setDataLivrare(LocalDateTime.now());
        coletRepository.save(colet);

        // Actualizează statusul comenzii dacă toate coletele sunt livrate
        Comanda comanda = colet.getComanda();
        if (comanda != null) {
            List<Colet> coleteComenzi = coletRepository.findAll().stream()
                    .filter(c -> c.getComanda() != null && 
                                c.getComanda().getIdComanda().equals(comanda.getIdComanda()))
                    .collect(Collectors.toList());
            
            boolean toateColeteLivrate = coleteComenzi.stream()
                    .allMatch(c -> "livrat".equals(c.getStatusColet()));
            
            if (toateColeteLivrate && !"livrata".equals(comanda.getStatusComanda())) {
                comanda.setStatusComanda("livrata");
                comandaRepository.save(comanda);
            }
        }

        // Adaugă tracking event
        TrackingEvent trackingEvent = new TrackingEvent();
        trackingEvent.setColet(colet);
        trackingEvent.setStatus("livrat");
        trackingEvent.setDataEvent(LocalDateTime.now());
        trackingEvent.setDescriere("Colet livrat cu ramburs încasat - suma " + colet.getPretDeclarat() + " RON");
        trackingEvent.setUtilizator(colet.getComanda().getCurier());
        trackingEventRepository.save(trackingEvent);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Ramburs încasat cu succes");
        response.put("coletId", coletId);
        response.put("suma", colet.getPretDeclarat());
        
        return ResponseEntity.ok(response);
    }

    // ==================== HELPER METHODS ====================
    
    private Map<String, Object> mapColetToPickup(Colet colet) {
        Map<String, Object> m = new HashMap<>();
        m.put("idColet", colet.getIdColet());
        m.put("codAwb", colet.getCodAwb());
        m.put("status", colet.getStatusColet());
        m.put("greutate", colet.getGreutateKg());
        m.put("tipServiciu", colet.getTipServiciu());
        
        // Informații despre plată
        Comanda comanda = colet.getComanda();
        if (comanda != null) {
            m.put("modalitatePlata", comanda.getModalitatePlata());
            
            // Obține suma de plată din factură
            Optional<Factura> facturaOpt = facturaRepository.findByComandaId(comanda.getIdComanda());
            if (facturaOpt.isPresent()) {
                Factura factura = facturaOpt.get();
                m.put("sumaDePlata", factura.getSumaTotala());
                m.put("statusPlata", factura.getStatusPlata());
            }
        }
        
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
    
    public static class RutaRequest {
        public String orasOrigine;
        public String orasDestinatie;
        public String judetOrigine;
        public String judetDestinatie;
        public Integer prioritate;
        public String descriere;
        public Boolean activa;
    }
    
    // ==================== RUTE CURIER ====================
    
    /**
     * GET /api/curier/{curierId}/rute
     * Lista rutelor curierului
     */
    @GetMapping("/{curierId}/rute")
    public ResponseEntity<List<Map<String, Object>>> getRuteCurier(@PathVariable Long curierId) {
        List<RutaCurier> rute = rutaCurierRepository.findByCurier_IdUtilizator(curierId);
        
        List<Map<String, Object>> result = rute.stream()
                .map(ruta -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("idRuta", ruta.getIdRuta());
                    map.put("orasOrigine", ruta.getOrasOrigine());
                    map.put("orasDestinatie", ruta.getOrasDestinatie());
                    map.put("judetOrigine", ruta.getJudetOrigine());
                    map.put("judetDestinatie", ruta.getJudetDestinatie());
                    map.put("prioritate", ruta.getPrioritate());
                    map.put("descriere", ruta.getDescriere());
                    map.put("activa", ruta.getActiva());
                    return map;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * POST /api/curier/{curierId}/rute
     * Adaugă o rută nouă pentru curier
     */
    @PostMapping("/{curierId}/rute")
    public ResponseEntity<Map<String, Object>> adaugaRuta(
            @PathVariable Long curierId,
            @RequestBody RutaRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<Utilizator> curierOpt = utilizatorRepository.findById(curierId);
        if (curierOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Curierul nu a fost găsit");
            return ResponseEntity.badRequest().body(response);
        }
        
        RutaCurier ruta = new RutaCurier();
        ruta.setCurier(curierOpt.get());
        ruta.setOrasOrigine(request.orasOrigine);
        ruta.setOrasDestinatie(request.orasDestinatie);
        ruta.setJudetOrigine(request.judetOrigine);
        ruta.setJudetDestinatie(request.judetDestinatie);
        ruta.setPrioritate(request.prioritate != null ? request.prioritate : 0);
        ruta.setDescriere(request.descriere);
        ruta.setActiva(request.activa != null ? request.activa : true);
        
        rutaCurierRepository.save(ruta);
        
        response.put("success", true);
        response.put("message", "Ruta a fost adăugată cu succes");
        response.put("idRuta", ruta.getIdRuta());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * PUT /api/curier/{curierId}/rute/{rutaId}
     * Actualizează o rută existentă
     */
    @PutMapping("/{curierId}/rute/{rutaId}")
    public ResponseEntity<Map<String, Object>> actualizeazaRuta(
            @PathVariable Long curierId,
            @PathVariable Long rutaId,
            @RequestBody RutaRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<RutaCurier> rutaOpt = rutaCurierRepository.findById(rutaId);
        if (rutaOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Ruta nu a fost găsită");
            return ResponseEntity.badRequest().body(response);
        }
        
        RutaCurier ruta = rutaOpt.get();
        
        // Verifică că ruta aparține curierului
        if (!ruta.getCurier().getIdUtilizator().equals(curierId)) {
            response.put("success", false);
            response.put("message", "Nu aveți permisiunea să editați această rută");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (request.orasOrigine != null) ruta.setOrasOrigine(request.orasOrigine);
        if (request.orasDestinatie != null) ruta.setOrasDestinatie(request.orasDestinatie);
        if (request.judetOrigine != null) ruta.setJudetOrigine(request.judetOrigine);
        if (request.judetDestinatie != null) ruta.setJudetDestinatie(request.judetDestinatie);
        if (request.prioritate != null) ruta.setPrioritate(request.prioritate);
        if (request.descriere != null) ruta.setDescriere(request.descriere);
        if (request.activa != null) ruta.setActiva(request.activa);
        
        rutaCurierRepository.save(ruta);
        
        response.put("success", true);
        response.put("message", "Ruta a fost actualizată cu succes");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * DELETE /api/curier/{curierId}/rute/{rutaId}
     * Șterge o rută
     */
    @DeleteMapping("/{curierId}/rute/{rutaId}")
    public ResponseEntity<Map<String, Object>> stergeRuta(
            @PathVariable Long curierId,
            @PathVariable Long rutaId) {
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<RutaCurier> rutaOpt = rutaCurierRepository.findById(rutaId);
        if (rutaOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Ruta nu a fost găsită");
            return ResponseEntity.badRequest().body(response);
        }
        
        RutaCurier ruta = rutaOpt.get();
        
        // Verifică că ruta aparține curierului
        if (!ruta.getCurier().getIdUtilizator().equals(curierId)) {
            response.put("success", false);
            response.put("message", "Nu aveți permisiunea să ștergeți această rută");
            return ResponseEntity.badRequest().body(response);
        }
        
        rutaCurierRepository.delete(ruta);
        
        response.put("success", true);
        response.put("message", "Ruta a fost ștearsă cu succes");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * PATCH /api/curier/{curierId}/rute/{rutaId}/toggle
     * Activează/dezactivează o rută
     */
    @PatchMapping("/{curierId}/rute/{rutaId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleRuta(
            @PathVariable Long curierId,
            @PathVariable Long rutaId) {
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<RutaCurier> rutaOpt = rutaCurierRepository.findById(rutaId);
        if (rutaOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Ruta nu a fost găsită");
            return ResponseEntity.badRequest().body(response);
        }
        
        RutaCurier ruta = rutaOpt.get();
        
        // Verifică că ruta aparține curierului
        if (!ruta.getCurier().getIdUtilizator().equals(curierId)) {
            response.put("success", false);
            response.put("message", "Nu aveți permisiunea să modificați această rută");
            return ResponseEntity.badRequest().body(response);
        }
        
        ruta.setActiva(!ruta.getActiva());
        rutaCurierRepository.save(ruta);
        
        response.put("success", true);
        response.put("activa", ruta.getActiva());
        response.put("message", ruta.getActiva() ? "Ruta a fost activată" : "Ruta a fost dezactivată");
        
        return ResponseEntity.ok(response);
    }
}
