package com.curier_app.curier_app.service;

import com.curier_app.curier_app.model.*;
import com.curier_app.curier_app.repository.*;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
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

    @Autowired
    private ServiciuRepository serviciuRepository;

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

        // Determinăm statusul inițial bazat pe modalitatea de plată
        // Atât cash cât și card încep în asteptare_plata
        // - cash: curierul încasează la pickup
        // - card: clientul plătește online, apoi coletul devine in_asteptare
        String statusInitial = "asteptare_plata";

        // 3. Creăm coletul/coletele
        for (ColetRequest coletReq : request.getColete()) {
            Colet colet = new Colet();
            colet.setComanda(comanda);
            colet.setCodAwb(generateAwb());
            colet.setGreutateKg(coletReq.getGreutateKg());
            colet.setLungimeCm(coletReq.getLungimeCm());
            colet.setLatimeCm(coletReq.getLatimeCm());
            colet.setInaltimeCm(coletReq.getInaltimeCm());
            
            // Găsim serviciul după ID
            if (coletReq.getIdServiciu() != null) {
                Serviciu serviciu = serviciuRepository.findById(coletReq.getIdServiciu())
                        .orElseThrow(() -> new RuntimeException("Serviciu negăsit"));
                colet.setServiciu(serviciu);
            }
            
            colet.setPretDeclarat(coletReq.getPretDeclarat());
            colet.setStatusColet(statusInitial);

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
            
            // Mesaj diferit pentru plata cash vs card
            if ("cash".equals(request.getModalitatePlata())) {
                event.setStatus("Așteptare plată");
                event.setDescriere("Comanda înregistrată. Curierul va veni să încaseze plata înainte de preluare.");
            } else {
                event.setStatus("Comandă plasată");
                event.setDescriere("Comanda a fost înregistrată și așteaptă preluarea");
            }
            
            event.setLocatie(expeditor.getOras());
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

    /**
     * Marchează o factură ca plătită și actualizează statusul coletelor
     */
    public void platesteFactura(Long facturaId) {
        Optional<Factura> facturaOpt = facturaRepository.findFacturaById(facturaId);
        if (facturaOpt.isEmpty()) {
            throw new RuntimeException("Factura nu a fost găsită");
        }
        
        Factura factura = facturaOpt.get();
        if ("achitat".equals(factura.getStatusPlata())) {
            throw new RuntimeException("Factura este deja plătită");
        }
        
        // Actualizează statusul de plată
        facturaRepository.updateStatusPlata(facturaId, "achitat");
        
        // Actualizează statusul coletelor din comandă la in_asteptare (gata de ridicare)
        if (factura.getComanda() != null) {
            List<Colet> colete = coletRepository.findByComanda(factura.getComanda().getIdComanda());
            for (Colet colet : colete) {
                if ("asteptare_plata".equals(colet.getStatusColet())) {
                    colet.setStatusColet("in_asteptare");
                    coletRepository.save(colet);
                }
            }
        }
    }

    /**
     * Generează PDF pentru o factură
     */
    public byte[] generateFacturaPDF(Long facturaId) {
        Optional<Factura> facturaOpt = facturaRepository.findFacturaById(facturaId);
        if (facturaOpt.isEmpty()) {
            throw new RuntimeException("Factura nu a fost găsită");
        }
        
        Factura factura = facturaOpt.get();
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            
            // Header
            Paragraph header = new Paragraph("BEAK COURIER")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(20);
            document.add(header);
            
            Paragraph subtitle = new Paragraph("FACTURA FISCALA")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(14);
            document.add(subtitle);
            
            document.add(new Paragraph("\n"));
            
            // Info factura
            String serieNumar = factura.getSerieNumar() != null ? factura.getSerieNumar() : "N/A";
            String dataEmitere = factura.getDataEmitere() != null ? factura.getDataEmitere().toString() : "N/A";
            String dataScadenta = factura.getDataScadenta() != null ? factura.getDataScadenta().toString() : "N/A";
            String statusPlata = factura.getStatusPlata() != null ? factura.getStatusPlata() : "N/A";
            
            document.add(new Paragraph("Seria si numarul: " + serieNumar).setBold());
            document.add(new Paragraph("Data emiterii: " + dataEmitere));
            document.add(new Paragraph("Data scadentei: " + dataScadenta));
            document.add(new Paragraph("Status plata: " + statusPlata));
            
            document.add(new Paragraph("\n"));
            
            // Info client
            if (factura.getComanda() != null && factura.getComanda().getClient() != null) {
                Utilizator client = factura.getComanda().getClient();
                document.add(new Paragraph("CLIENT:").setBold());
                document.add(new Paragraph(client.getNume() + " " + client.getPrenume()));
                if (client.getEmail() != null) {
                    document.add(new Paragraph("Email: " + client.getEmail()));
                }
                if (client.getTelefon() != null) {
                    document.add(new Paragraph("Telefon: " + client.getTelefon()));
                }
            }
            
            document.add(new Paragraph("\n"));
            
            // Tabel cu detalii
            if (factura.getComanda() != null) {
                document.add(new Paragraph("DETALII COMANDA #" + factura.getComanda().getIdComanda()).setBold());
                
                Table table = new Table(3);
                table.addHeaderCell(new Cell().add(new Paragraph("Descriere").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Cantitate").setBold()));
                table.addHeaderCell(new Cell().add(new Paragraph("Valoare").setBold()));
                
                table.addCell("Servicii de curierat");
                table.addCell("1");
                String total = factura.getSumaTotala() != null ? factura.getSumaTotala().toString() + " RON" : "0.00 RON";
                table.addCell(total);
                
                document.add(table);
            }
            
            document.add(new Paragraph("\n"));
            
            // Total
            String totalText = factura.getSumaTotala() != null ? factura.getSumaTotala().toString() : "0.00";
            Paragraph totalParagraph = new Paragraph("TOTAL DE PLATA: " + totalText + " RON")
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBold()
                    .setFontSize(14);
            document.add(totalParagraph);
            
            document.add(new Paragraph("\n\n"));
            
            // Footer
            Paragraph footer = new Paragraph("Multumim pentru increderea acordata!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10);
            document.add(footer);
            
            document.close();
            
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Eroare la generarea PDF-ului: " + e.getMessage());
        }
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
        // Folosește costul calculat în frontend în loc de calculul backend
        BigDecimal total = colete.stream()
                .map(c -> c.getCostCalculat() != null ? c.getCostCalculat() : BigDecimal.ZERO)
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
        private BigDecimal lungimeCm;
        private BigDecimal latimeCm;
        private BigDecimal inaltimeCm;
        private Long idServiciu;
        private BigDecimal pretDeclarat;
        private BigDecimal costCalculat; // Costul calculat în frontend
        private Long idAdresaExpeditor;
        private Long idAdresaDestinatar;

        public BigDecimal getGreutateKg() { return greutateKg; }
        public void setGreutateKg(BigDecimal greutateKg) { this.greutateKg = greutateKg; }
        public BigDecimal getLungimeCm() { return lungimeCm; }
        public void setLungimeCm(BigDecimal lungimeCm) { this.lungimeCm = lungimeCm; }
        public BigDecimal getLatimeCm() { return latimeCm; }
        public void setLatimeCm(BigDecimal latimeCm) { this.latimeCm = latimeCm; }
        public BigDecimal getInaltimeCm() { return inaltimeCm; }
        public void setInaltimeCm(BigDecimal inaltimeCm) { this.inaltimeCm = inaltimeCm; }
        public Long getIdServiciu() { return idServiciu; }
        public void setIdServiciu(Long idServiciu) { this.idServiciu = idServiciu; }
        public BigDecimal getPretDeclarat() { return pretDeclarat; }
        public void setPretDeclarat(BigDecimal pretDeclarat) { this.pretDeclarat = pretDeclarat; }
        public BigDecimal getCostCalculat() { return costCalculat; }
        public void setCostCalculat(BigDecimal costCalculat) { this.costCalculat = costCalculat; }
        public Long getIdAdresaExpeditor() { return idAdresaExpeditor; }
        public void setIdAdresaExpeditor(Long idAdresaExpeditor) { this.idAdresaExpeditor = idAdresaExpeditor; }
        public Long getIdAdresaDestinatar() { return idAdresaDestinatar; }
        public void setIdAdresaDestinatar(Long idAdresaDestinatar) { this.idAdresaDestinatar = idAdresaDestinatar; }
    }
}
