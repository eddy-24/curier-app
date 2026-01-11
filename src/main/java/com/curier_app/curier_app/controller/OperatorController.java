package com.curier_app.curier_app.controller;

import com.curier_app.curier_app.model.*;
import com.curier_app.curier_app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/operator")
@CrossOrigin(origins = "*")
public class OperatorController {

    @Autowired
    private ComandaRepository comandaRepository;

    @Autowired
    private ColetRepository coletRepository;

    @Autowired
    private UtilizatorRepository utilizatorRepository;

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private TrackingEventRepository trackingEventRepository;

    @Autowired
    private AdresaRepository adresaRepository;

    @Autowired
    private RutaCurierRepository rutaCurierRepository;

    // ==================== DASHBOARD ====================

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Comenzi pe status
        List<Comanda> toateComenzi = comandaRepository.findAllComenzi();
        long noi = toateComenzi.stream().filter(c -> "noua".equals(c.getStatusComanda())).count();
        long inLucru = toateComenzi.stream().filter(c -> "in_procesare".equals(c.getStatusComanda())).count();
        long probleme = toateComenzi.stream().filter(c -> "problema".equals(c.getStatusComanda())).count();
        long finalizate = toateComenzi.stream().filter(c -> "finalizata".equals(c.getStatusComanda())).count();

        stats.put("comenziNoi", noi);
        stats.put("comenziInLucru", inLucru);
        stats.put("comenziProbleme", probleme);
        stats.put("comenziFinalizate", finalizate);
        stats.put("totalComenzi", toateComenzi.size());

        // Colete pe status
        List<Colet> toateColete = coletRepository.findAllColete();
        long coleteInTranzit = toateColete.stream()
                .filter(c -> "in_tranzit".equals(c.getStatusColet()))
                .count();
        long coleteLivrate = toateColete.stream()
                .filter(c -> "livrat".equals(c.getStatusColet()))
                .count();

        stats.put("coleteInTranzit", coleteInTranzit);
        stats.put("coleteLivrate", coleteLivrate);
        stats.put("totalColete", toateColete.size());

        // Curieri disponibili
        List<Utilizator> curieri = utilizatorRepository.findByRol("curier");
        stats.put("curieriDisponibili", curieri.size());

        return ResponseEntity.ok(stats);
    }

    // ==================== COMENZI ====================

    @GetMapping("/comenzi")
    public ResponseEntity<?> getComenzi(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        List<Comanda> comenzi;

        if (status != null && !status.isEmpty() && !status.equals("toate")) {
            comenzi = comandaRepository.findByStatus(status);
        } else {
            comenzi = comandaRepository.findAllComenzi();
        }

        // Sortare descrescătoare după dată
        comenzi.sort((a, b) -> b.getDataCreare().compareTo(a.getDataCreare()));

        return ResponseEntity.ok(comenzi);
    }

    @GetMapping("/comenzi/{id}")
    public ResponseEntity<?> getComandaById(@PathVariable Long id) {
        Optional<Comanda> comanda = comandaRepository.findById(id);
        if (comanda.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(comanda.get());
    }

    @PutMapping("/comenzi/{id}")
    public ResponseEntity<?> updateComanda(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Comanda> optComanda = comandaRepository.findById(id);
        if (optComanda.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comanda comanda = optComanda.get();

        if (updates.containsKey("statusComanda")) {
            comanda.setStatusComanda((String) updates.get("statusComanda"));
        }
        if (updates.containsKey("modalitatePlata")) {
            comanda.setModalitatePlata((String) updates.get("modalitatePlata"));
        }

        comandaRepository.save(comanda);
        return ResponseEntity.ok(comanda);
    }

    @PutMapping("/comenzi/{id}/status")
    public ResponseEntity<?> updateComandaStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Comanda> optComanda = comandaRepository.findById(id);
        if (optComanda.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comanda comanda = optComanda.get();
        String newStatus = body.get("status");
        comanda.setStatusComanda(newStatus);
        comandaRepository.save(comanda);

        return ResponseEntity.ok(Map.of("message", "Status actualizat", "comanda", comanda));
    }

    // ==================== COLETE ====================

    @GetMapping("/colete")
    public ResponseEntity<?> getColete(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long curierId) {
        List<Colet> colete;

        if (curierId != null) {
            // Filtrare după curier
            colete = coletRepository.findByCurier_IdUtilizator(curierId);
        } else if (status != null && !status.isEmpty() && !status.equals("toate")) {
            colete = coletRepository.findByStatus(status);
        } else {
            colete = coletRepository.findAllColete();
        }

        return ResponseEntity.ok(colete);
    }

    @GetMapping("/colete/neasignate")
    public ResponseEntity<?> getColeteNeasignate() {
        List<Colet> colete = coletRepository.findColeteNeasignate();
        return ResponseEntity.ok(colete);
    }

    @GetMapping("/colete/{id}")
    public ResponseEntity<?> getColetById(@PathVariable Long id) {
        Optional<Colet> colet = coletRepository.findById(id);
        if (colet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(colet.get());
    }

    @PutMapping("/colete/{id}")
    public ResponseEntity<?> updateColet(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Colet> optColet = coletRepository.findById(id);
        if (optColet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Colet colet = optColet.get();

        if (updates.containsKey("statusColet")) {
            String newStatus = (String) updates.get("statusColet");
            colet.setStatusColet(newStatus);

            // Adaugă tracking event
            TrackingEvent event = new TrackingEvent();
            event.setColet(colet);
            event.setStatus(newStatus);
            event.setDescriere("Status actualizat de operator");
            event.setDataEvent(LocalDateTime.now());
            trackingEventRepository.save(event);
        }

        if (updates.containsKey("tipServiciu")) {
            colet.setTipServiciu((String) updates.get("tipServiciu"));
        }

        coletRepository.save(colet);
        return ResponseEntity.ok(colet);
    }

    // ==================== ASIGNARE CURIER ====================

    @GetMapping("/curieri")
    public ResponseEntity<?> getCurieri(
            @RequestParam(required = false) String orasDestinatie,
            @RequestParam(required = false) String judetDestinatie) {
        
        List<Utilizator> curieri;
        
        // Dacă avem destinație, filtrăm după rute
        if (orasDestinatie != null && !orasDestinatie.isEmpty()) {
            curieri = rutaCurierRepository.findCurieriByDestinatie(orasDestinatie, judetDestinatie);
            
            // Dacă nu găsim curieri cu rută exactă, returnăm toți (fallback)
            if (curieri.isEmpty()) {
                curieri = utilizatorRepository.findByRol("curier");
            }
        } else {
            curieri = utilizatorRepository.findByRol("curier");
        }
        
        // Returnăm doar datele necesare (fără parolă) + rutele
        List<Map<String, Object>> curieriList = new ArrayList<>();
        for (Utilizator curier : curieri) {
            Map<String, Object> c = new HashMap<>();
            c.put("id", curier.getIdUtilizator());
            c.put("username", curier.getUsername());
            c.put("nume", curier.getNume());
            c.put("prenume", curier.getPrenume());
            c.put("telefon", curier.getTelefon());
            c.put("email", curier.getEmail());
            
            // Adăugăm rutele curierului
            List<RutaCurier> rute = rutaCurierRepository.findByCurier_IdUtilizator(curier.getIdUtilizator());
            List<Map<String, String>> ruteList = new ArrayList<>();
            for (RutaCurier ruta : rute) {
                if (ruta.getActiva()) {
                    Map<String, String> r = new HashMap<>();
                    r.put("origine", ruta.getOrasOrigine());
                    r.put("destinatie", ruta.getOrasDestinatie());
                    ruteList.add(r);
                }
            }
            c.put("rute", ruteList);
            
            // Verificăm dacă curierul are rută pentru destinația cerută
            if (orasDestinatie != null && !orasDestinatie.isEmpty()) {
                boolean areRuta = rutaCurierRepository.existsRutaForCurierAndDestinatie(
                    curier.getIdUtilizator(), orasDestinatie, judetDestinatie
                );
                c.put("areRutaCompatibila", areRuta);
            }
            
            curieriList.add(c);
        }

        return ResponseEntity.ok(curieriList);
    }

    // ==================== GESTIONARE RUTE CURIERI ====================

    @GetMapping("/rute")
    public ResponseEntity<?> getAllRute() {
        List<RutaCurier> rute = rutaCurierRepository.findByActivaTrue();
        return ResponseEntity.ok(rute);
    }

    @GetMapping("/curieri/{curierId}/rute")
    public ResponseEntity<?> getRuteCurier(@PathVariable Long curierId) {
        List<RutaCurier> rute = rutaCurierRepository.findByCurier_IdUtilizator(curierId);
        return ResponseEntity.ok(rute);
    }

    @PostMapping("/curieri/{curierId}/rute")
    public ResponseEntity<?> addRutaCurier(
            @PathVariable Long curierId,
            @RequestBody Map<String, String> body) {
        
        Optional<Utilizator> optCurier = utilizatorRepository.findById(curierId);
        if (optCurier.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        RutaCurier ruta = new RutaCurier();
        ruta.setCurier(optCurier.get());
        ruta.setOrasOrigine(body.get("orasOrigine"));
        ruta.setOrasDestinatie(body.get("orasDestinatie"));
        ruta.setJudetOrigine(body.get("judetOrigine"));
        ruta.setJudetDestinatie(body.get("judetDestinatie"));
        ruta.setDescriere(body.get("descriere"));
        ruta.setActiva(true);

        rutaCurierRepository.save(ruta);
        return ResponseEntity.ok(ruta);
    }

    @DeleteMapping("/rute/{rutaId}")
    public ResponseEntity<?> deleteRuta(@PathVariable Long rutaId) {
        Optional<RutaCurier> optRuta = rutaCurierRepository.findById(rutaId);
        if (optRuta.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Soft delete - doar dezactivăm
        RutaCurier ruta = optRuta.get();
        ruta.setActiva(false);
        rutaCurierRepository.save(ruta);
        
        return ResponseEntity.ok(Map.of("message", "Ruta dezactivată"));
    }

    @PostMapping("/colete/{coletId}/asigneaza-curier")
    public ResponseEntity<?> asigneazaCurier(
            @PathVariable Long coletId,
            @RequestBody Map<String, Long> body) {

        Long curierId = body.get("curierId");

        Optional<Colet> optColet = coletRepository.findById(coletId);
        if (optColet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Utilizator> optCurier = utilizatorRepository.findById(curierId);
        if (optCurier.isEmpty()) {
            return ResponseEntity.badRequest().body("Curier negăsit");
        }


        Colet colet = optColet.get();
        Utilizator curier = optCurier.get();

        // Setează curierul pe colet
        colet.setCurier(curier);
        // Actualizează statusul coletului
        colet.setStatusColet("preluat_curier");
        coletRepository.save(colet);

        // Adaugă tracking event
        TrackingEvent event = new TrackingEvent();
        event.setColet(colet);
        event.setStatus("preluat_curier");
        event.setDescriere("Colet asignat curierului " + curier.getPrenume() + " " + curier.getNume());
        event.setDataEvent(LocalDateTime.now());
        event.setUtilizator(curier);
        trackingEventRepository.save(event);

        return ResponseEntity.ok(Map.of(
                "message", "Curier asignat cu succes",
                "colet", colet,
                "curier", curier.getPrenume() + " " + curier.getNume()
        ));
    }

    @PostMapping("/colete/assign")
    public ResponseEntity<?> assignMultipleToCourrrier(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Integer> coletIds = (List<Integer>) body.get("coletIds");
        Long curierId = Long.valueOf(body.get("curierId").toString());

        if (coletIds == null || coletIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Lista de colete este goală");
        }

        Optional<Utilizator> optCurier = utilizatorRepository.findById(curierId);
        if (optCurier.isEmpty()) {
            return ResponseEntity.badRequest().body("Curier negăsit");
        }

        Utilizator curier = optCurier.get();
        int assigned = 0;

        for (Integer coletIdInt : coletIds) {
            Long coletId = coletIdInt.longValue();
            Optional<Colet> optColet = coletRepository.findById(coletId);
            if (optColet.isPresent()) {
                Colet colet = optColet.get();
                colet.setStatusColet("preluat");
                colet.setCurier(curier); // Setăm curierul
                coletRepository.save(colet);

                // Adaugă tracking event
                TrackingEvent event = new TrackingEvent();
                event.setColet(colet);
                event.setStatus("preluat");
                event.setDescriere("Colet asignat curierului " + curier.getPrenume() + " " + curier.getNume());
                event.setDataEvent(LocalDateTime.now());
                event.setUtilizator(curier);
                trackingEventRepository.save(event);

                assigned++;
            }
        }

        Map<String, Object> curierData = new HashMap<>();
        curierData.put("idUtilizator", curier.getIdUtilizator());
        curierData.put("nume", curier.getNume());
        curierData.put("prenume", curier.getPrenume());

        return ResponseEntity.ok(Map.of(
                "message", assigned + " colete asignate cu succes",
                "curier", curierData,
                "count", assigned
        ));
    }

    @PutMapping("/colete/{id}/status")
    public ResponseEntity<?> updateColetStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Colet> optColet = coletRepository.findById(id);
        if (optColet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Colet colet = optColet.get();
        String newStatus = body.get("status");
        colet.setStatusColet(newStatus);
        coletRepository.save(colet);

        // Adaugă tracking event
        TrackingEvent event = new TrackingEvent();
        event.setColet(colet);
        event.setStatus(newStatus);
        event.setDescriere("Status actualizat de operator");
        event.setDataEvent(LocalDateTime.now());
        trackingEventRepository.save(event);

        return ResponseEntity.ok(Map.of("message", "Status actualizat", "colet", colet));
    }

    // ==================== GENERARE DOCUMENTE ====================

    @GetMapping("/colete/{id}/awb")
    public ResponseEntity<?> generateAwb(@PathVariable Long id) {
        Optional<Colet> optColet = coletRepository.findById(id);
        if (optColet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Colet colet = optColet.get();

        // Generăm un document AWB (în practică ar fi PDF)
        Map<String, Object> awbData = new HashMap<>();
        awbData.put("codAwb", colet.getCodAwb());
        awbData.put("dataGenerare", LocalDateTime.now());
        awbData.put("expeditor", Map.of(
                "adresa", formatAdresa(colet.getAdresaExpeditor())
        ));
        awbData.put("destinatar", Map.of(
                "adresa", formatAdresa(colet.getAdresaDestinatar())
        ));
        awbData.put("greutate", colet.getGreutateKg());
        awbData.put("volum", colet.getVolumM3());
        awbData.put("tipServiciu", colet.getTipServiciu());
        awbData.put("pretDeclarat", colet.getPretDeclarat());
        awbData.put("status", colet.getStatusColet());

        return ResponseEntity.ok(awbData);
    }

    @GetMapping("/comenzi/{id}/factura")
    public ResponseEntity<?> getFacturaByComanda(@PathVariable Long id) {
        Optional<Factura> optFactura = facturaRepository.findByComandaId(id);
        if (optFactura.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Factura nu există pentru această comandă"));
        }
        return ResponseEntity.ok(optFactura.get());
    }

    @PostMapping("/comenzi/{id}/genereaza-factura")
    public ResponseEntity<?> genereazaFactura(@PathVariable Long id) {
        Optional<Comanda> optComanda = comandaRepository.findById(id);
        if (optComanda.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Verifică dacă există deja factură
        Optional<Factura> existingFactura = facturaRepository.findByComandaId(id);
        if (existingFactura.isPresent()) {
            return ResponseEntity.ok(existingFactura.get());
        }

        Comanda comanda = optComanda.get();

        // Calculează suma totală din colete
        BigDecimal sumaTotala = BigDecimal.ZERO;
        for (Colet colet : comanda.getColete()) {
            BigDecimal pretBaza = switch (colet.getTipServiciu()) {
                case "express" -> new BigDecimal("25.00");
                case "overnight" -> new BigDecimal("35.00");
                default -> new BigDecimal("15.00");
            };
            BigDecimal greutate = colet.getGreutateKg() != null ? colet.getGreutateKg() : BigDecimal.ZERO;
            sumaTotala = sumaTotala.add(pretBaza).add(greutate.multiply(new BigDecimal("2")));
        }

        // Creează factura
        Factura factura = new Factura();
        factura.setComanda(comanda);
        factura.setSerieNumar("CUR-" + System.currentTimeMillis());
        factura.setSumaTotala(sumaTotala);
        factura.setDataEmitere(LocalDate.now());
        factura.setDataScadenta(LocalDate.now().plusDays(30));
        factura.setStatusPlata("neachitat");

        facturaRepository.save(factura);

        return ResponseEntity.ok(factura);
    }

    // ==================== INCIDENTE / RECLAMAȚII ====================

    @PostMapping("/colete/{id}/incident")
    public ResponseEntity<?> raportareIncident(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Optional<Colet> optColet = coletRepository.findById(id);
        if (optColet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Colet colet = optColet.get();
        String tipIncident = body.get("tip"); // "incident" sau "reclamatie"
        String descriere = body.get("descriere");

        // Actualizează statusul comenzii
        if (colet.getComanda() != null) {
            colet.getComanda().setStatusComanda("problema");
            comandaRepository.save(colet.getComanda());
        }

        // Adaugă tracking event
        TrackingEvent event = new TrackingEvent();
        event.setColet(colet);
        event.setStatus("incident");
        event.setDescriere("[" + tipIncident.toUpperCase() + "] " + descriere);
        event.setDataEvent(LocalDateTime.now());
        trackingEventRepository.save(event);

        return ResponseEntity.ok(Map.of("message", "Incident raportat cu succes"));
    }

    // ==================== HELPER ====================

    private String formatAdresa(Adresa adresa) {
        if (adresa == null) return "N/A";
        return adresa.getStrada() + " " + adresa.getNumar() + ", " +
                adresa.getOras() + (adresa.getCodPostal() != null ? ", " + adresa.getCodPostal() : "");
    }
}
