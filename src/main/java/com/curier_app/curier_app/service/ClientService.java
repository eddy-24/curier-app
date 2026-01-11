package com.curier_app.curier_app.service;

import com.curier_app.curier_app.model.*;
import com.curier_app.curier_app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClientService {

    @Autowired
    private ComandaRepository comandaRepository;

    @Autowired
    private ColetRepository coletRepository;

    @Autowired
    private AdresaRepository adresaRepository;

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private TrackingEventRepository trackingEventRepository;

    @Autowired
    private UtilizatorRepository utilizatorRepository;

    // ==================== DASHBOARD ====================

    /**
     * Obține expedierile recente ale clientului (ultimele 10)
     */
    public List<Comanda> getExpedieriRecente(Long clientId) {
        return comandaRepository.findByClientId(clientId);
    }

    /**
     * Obține statistici pentru dashboard
     */
    public DashboardStats getDashboardStats(Long clientId) {
        List<Comanda> comenzi = comandaRepository.findByClientId(clientId);
        List<Factura> facturi = facturaRepository.findAllFacturi();
        
        long totalExpedieri = comenzi.size();
        long inCurs = comenzi.stream().filter(c -> "in_procesare".equals(c.getStatusComanda())).count();
        long livrate = comenzi.stream().filter(c -> "finalizata".equals(c.getStatusComanda())).count();
        
        BigDecimal totalFacturi = facturi.stream()
                .filter(f -> comenzi.stream().anyMatch(c -> c.getIdComanda().equals(f.getComanda().getIdComanda())))
                .map(Factura::getSumaTotala)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardStats(totalExpedieri, inCurs, livrate, totalFacturi);
    }

    // ==================== EXPEDIERI (COMENZI + COLETE) ====================

    /**
     * Creează o nouă expediere (comandă cu colete)
     */
    @Transactional
    public Comanda creeazaExpediere(Long clientId, ExpediereRequest request) {
        // 1. Găsim clientul
        Utilizator client = utilizatorRepository.findUtilizatorById(clientId)
                .orElseThrow(() -> new RuntimeException("Client negăsit"));

        // 2. Creăm comanda
        Comanda comanda = new Comanda();
        comanda.setClient(client);
        comanda.setDataCreare(LocalDateTime.now());
        comanda.setModalitatePlata(request.getModalitatePlata());
        comanda.setStatusComanda("noua");
        comanda = comandaRepository.save(comanda);

        // 3. Creăm coletul/coletele
        for (ColetRequest coletReq : request.getColete()) {
            Colet colet = new Colet();
            colet.setComanda(comanda);
            colet.setCodAwb(generateAwb());
            colet.setGreutateKg(coletReq.getGreutateKg());
            colet.setVolumM3(coletReq.getVolumM3());
            colet.setTipServiciu(coletReq.getTipServiciu());
            colet.setPretDeclarat(coletReq.getPretDeclarat());
            colet.setStatusColet("in_asteptare");

            // Adrese
            Adresa expeditor = adresaRepository.findById(coletReq.getIdAdresaExpeditor())
                    .orElseThrow(() -> new RuntimeException("Adresa expeditor negăsită"));
            Adresa destinatar = adresaRepository.findById(coletReq.getIdAdresaDestinatar())
                    .orElseThrow(() -> new RuntimeException("Adresa destinatar negăsită"));

            colet.setAdresaExpeditor(expeditor);
            colet.setAdresaDestinatar(destinatar);
            coletRepository.save(colet);

            // 4. Creăm primul event de tracking
            TrackingEvent event = new TrackingEvent();
            event.setColet(colet);
            event.setStatus("Comandă plasată");
            event.setLocatie(expeditor.getOras());
            event.setDescriere("Comanda a fost înregistrată și așteaptă preluarea");
            event.setDataEvent(LocalDateTime.now());
            trackingEventRepository.save(event);
        }

        // 5. Generăm factura
        generareFactura(comanda, request.getColete());

        return comanda;
    }

    /**
     * Obține toate expedierile unui client
     */
    public List<Comanda> getExpedieriClient(Long clientId) {
        return comandaRepository.findByClientId(clientId);
    }

    /**
     * Obține detaliile unei expedieri
     */
    public Optional<Comanda> getExpediereById(Long comandaId) {
        return comandaRepository.findComandaById(comandaId);
    }

    // ==================== TRACKING ====================

    /**
     * Obține tracking-ul unui colet după AWB
     */
    public List<TrackingEvent> getTrackingByAwb(String codAwb) {
        Optional<Colet> colet = coletRepository.findByCodAwb(codAwb);
        if (colet.isPresent()) {
            return trackingEventRepository.findByColetIdOrderByDataEventAsc(colet.get().getIdColet());
        }
        return List.of();
    }

    /**
     * Obține tracking-ul unui colet după ID
     */
    public List<TrackingEvent> getTrackingByColetId(Long coletId) {
        return trackingEventRepository.findByColetIdOrderByDataEventAsc(coletId);
    }

    /**
     * Obține coletul după AWB
     */
    public Optional<Colet> getColetByAwb(String codAwb) {
        return coletRepository.findByCodAwb(codAwb);
    }

    // ==================== FACTURI ====================

    /**
     * Obține facturile unui client
     */
    public List<Factura> getFacturiClient(Long clientId) {
        List<Comanda> comenzi = comandaRepository.findByClientId(clientId);
        return facturaRepository.findAllFacturi().stream()
                .filter(f -> comenzi.stream()
                        .anyMatch(c -> c.getIdComanda().equals(f.getComanda().getIdComanda())))
                .toList();
    }

    /**
     * Obține o factură după ID
     */
    public Optional<Factura> getFacturaById(Long facturaId) {
        return facturaRepository.findFacturaById(facturaId);
    }

    // ==================== ADRESE ====================

    /**
     * Obține adresele unui client
     */
    public List<Adresa> getAdreseClient(Long clientId) {
        return adresaRepository.findByUtilizatorId(clientId);
    }

    /**
     * Adaugă o adresă nouă pentru client
     */
    public Adresa adaugaAdresa(Long clientId, Adresa adresa) {
        Utilizator client = utilizatorRepository.findUtilizatorById(clientId)
                .orElseThrow(() -> new RuntimeException("Client negăsit"));
        adresa.setUtilizator(client);
        return adresaRepository.save(adresa);
    }

    /**
     * Actualizează o adresă
     */
    public Adresa actualizeazaAdresa(Long adresaId, Adresa adresaNoua) {
        Adresa adresa = adresaRepository.findById(adresaId)
                .orElseThrow(() -> new RuntimeException("Adresa negăsită"));
        
        adresa.setOras(adresaNoua.getOras());
        adresa.setStrada(adresaNoua.getStrada());
        adresa.setNumar(adresaNoua.getNumar());
        adresa.setCodPostal(adresaNoua.getCodPostal());
        adresa.setDetaliiSuplimentare(adresaNoua.getDetaliiSuplimentare());
        adresa.setBloc(adresaNoua.getBloc());
        adresa.setScara(adresaNoua.getScara());
        adresa.setApartament(adresaNoua.getApartament());
        adresa.setJudet(adresaNoua.getJudet());
        adresa.setTara(adresaNoua.getTara());
        adresa.setPersoanaContact(adresaNoua.getPersoanaContact());
        adresa.setTelefonContact(adresaNoua.getTelefonContact());
        
        return adresaRepository.save(adresa);
    }

    /**
     * Șterge o adresă
     */
    public void stergeAdresa(Long adresaId) {
        adresaRepository.deleteById(adresaId);
    }

    // ==================== HELPERS ====================

    private String generateAwb() {
        return "AWB" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void generareFactura(Comanda comanda, List<ColetRequest> colete) {
        BigDecimal total = colete.stream()
                .map(c -> calculeazaPret(c.getTipServiciu(), c.getGreutateKg()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Factura factura = new Factura();
        factura.setComanda(comanda);
        factura.setSerieNumar("FACT-" + LocalDate.now().getYear() + "-" + String.format("%06d", comanda.getIdComanda()));
        factura.setSumaTotala(total);
        factura.setDataEmitere(LocalDate.now());
        factura.setDataScadenta(LocalDate.now().plusDays(30));
        factura.setStatusPlata("neachitat");
        
        facturaRepository.save(factura);
    }

    private BigDecimal calculeazaPret(String tipServiciu, BigDecimal greutate) {
        BigDecimal pretBaza = switch (tipServiciu) {
            case "express" -> new BigDecimal("25.00");
            case "overnight" -> new BigDecimal("35.00");
            default -> new BigDecimal("15.00"); // standard
        };
        
        // Adaugă cost pe kg
        BigDecimal costGreutate = greutate.multiply(new BigDecimal("2.00"));
        return pretBaza.add(costGreutate);
    }

    // ==================== INNER CLASSES (DTOs) ====================

    public record DashboardStats(long totalExpedieri, long inCurs, long livrate, BigDecimal totalFacturi) {}

    public static class ExpediereRequest {
        private String modalitatePlata;
        private List<ColetRequest> colete;

        public String getModalitatePlata() { return modalitatePlata; }
        public void setModalitatePlata(String modalitatePlata) { this.modalitatePlata = modalitatePlata; }
        public List<ColetRequest> getColete() { return colete; }
        public void setColete(List<ColetRequest> colete) { this.colete = colete; }
    }

    public static class ColetRequest {
        private BigDecimal greutateKg;
        private BigDecimal volumM3;
        private String tipServiciu;
        private BigDecimal pretDeclarat;
        private Long idAdresaExpeditor;
        private Long idAdresaDestinatar;

        public BigDecimal getGreutateKg() { return greutateKg; }
        public void setGreutateKg(BigDecimal greutateKg) { this.greutateKg = greutateKg; }
        public BigDecimal getVolumM3() { return volumM3; }
        public void setVolumM3(BigDecimal volumM3) { this.volumM3 = volumM3; }
        public String getTipServiciu() { return tipServiciu; }
        public void setTipServiciu(String tipServiciu) { this.tipServiciu = tipServiciu; }
        public BigDecimal getPretDeclarat() { return pretDeclarat; }
        public void setPretDeclarat(BigDecimal pretDeclarat) { this.pretDeclarat = pretDeclarat; }
        public Long getIdAdresaExpeditor() { return idAdresaExpeditor; }
        public void setIdAdresaExpeditor(Long idAdresaExpeditor) { this.idAdresaExpeditor = idAdresaExpeditor; }
        public Long getIdAdresaDestinatar() { return idAdresaDestinatar; }
        public void setIdAdresaDestinatar(Long idAdresaDestinatar) { this.idAdresaDestinatar = idAdresaDestinatar; }
    }
}
