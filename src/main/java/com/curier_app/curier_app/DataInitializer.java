package com.curier_app.curier_app;

import com.curier_app.curier_app.model.*;
import com.curier_app.curier_app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UtilizatorRepository utilizatorRepo,
            AdresaRepository adresaRepo,
            VehiculRepository vehiculRepo,
            ComandaRepository comandaRepo,
            ColetRepository coletRepo,
            TraseuColetRepository traseuColetRepo,
            FacturaRepository facturaRepo,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Verificăm dacă există deja date
            if (utilizatorRepo.count() > 0) {
                System.out.println("Baza de date are deja date, nu populăm din nou.");
                return;
            }

            System.out.println("Populăm baza de date cu date de test...");

            // 1. UTILIZATORI (5 clienti, 3 curieri, 2 soferi, 1 admin)
            List<Utilizator> utilizatori = new ArrayList<>();
            
            // Clienti
            for (int i = 1; i <= 5; i++) {
                Utilizator client = new Utilizator();
                client.setUsername("client" + i);
                client.setParola(passwordEncoder.encode("pass123"));
                client.setNume("Popescu");
                client.setPrenume("Client" + i);
                client.setTelefon("071234567" + i);
                client.setEmail("client" + i + "@example.com");
                client.setRol("client");
                utilizatori.add(utilizatorRepo.save(client));
            }

            // Curieri
            for (int i = 1; i <= 3; i++) {
                Utilizator curier = new Utilizator();
                curier.setUsername("curier" + i);
                curier.setParola(passwordEncoder.encode("pass123"));
                curier.setNume("Ionescu");
                curier.setPrenume("Curier" + i);
                curier.setTelefon("072234567" + i);
                curier.setEmail("curier" + i + "@example.com");
                curier.setRol("curier");
                utilizatori.add(utilizatorRepo.save(curier));
            }

            // Soferi
            for (int i = 1; i <= 2; i++) {
                Utilizator sofer = new Utilizator();
                sofer.setUsername("sofer" + i);
                sofer.setParola(passwordEncoder.encode("pass123"));
                sofer.setNume("Georgescu");
                sofer.setPrenume("Sofer" + i);
                sofer.setTelefon("073234567" + i);
                sofer.setEmail("sofer" + i + "@example.com");
                sofer.setRol("sofer");
                utilizatori.add(utilizatorRepo.save(sofer));
            }

            // Admin
            Utilizator admin = new Utilizator();
            admin.setUsername("admin");
            admin.setParola(passwordEncoder.encode("admin123"));
            admin.setNume("Administrator");
            admin.setPrenume("System");
            admin.setTelefon("0700000000");
            admin.setEmail("admin@curierapp.com");
            admin.setRol("admin");
            utilizatori.add(utilizatorRepo.save(admin));

            System.out.println("✓ " + utilizatori.size() + " utilizatori creați");

            // 2. ADRESE (pentru primii 5 clienti - 2 adrese fiecare)
            List<Adresa> adrese = new ArrayList<>();
            String[] orase = {"București", "Cluj-Napoca", "Timișoara", "Iași", "Brașov"};
            String[] strazi = {"Calea Victoriei", "Strada Florilor", "Bulevardul Unirii", "Aleea Parcului", "Strada Libertății"};

            for (int i = 0; i < 5; i++) {
                // Adresa 1
                Adresa adresa1 = new Adresa();
                adresa1.setUtilizator(utilizatori.get(i));
                adresa1.setOras(orase[i]);
                adresa1.setStrada(strazi[i]);
                adresa1.setNumar(String.valueOf((i + 1) * 10));
                adresa1.setCodPostal("10000" + i);
                adresa1.setDetaliiSuplimentare("Apartament " + (i + 1));
                adrese.add(adresaRepo.save(adresa1));

                // Adresa 2
                Adresa adresa2 = new Adresa();
                adresa2.setUtilizator(utilizatori.get(i));
                adresa2.setOras(orase[i]);
                adresa2.setStrada("Strada Nouă " + (i + 1));
                adresa2.setNumar(String.valueOf((i + 1) * 20));
                adresa2.setCodPostal("20000" + i);
                adresa2.setDetaliiSuplimentare("Bloc " + (i + 1) + ", Scara A");
                adrese.add(adresaRepo.save(adresa2));
            }

            System.out.println("✓ " + adrese.size() + " adrese create");

            // 3. VEHICULE (5 vehicule)
            List<Vehicul> vehicule = new ArrayList<>();
            String[] tipuriVehicul = {"scuter", "duba", "camion", "duba", "scuter"};
            String[] marci = {"Yamaha", "Mercedes", "MAN", "Ford", "Honda"};
            String[] modele = {"NMAX", "Sprinter", "TGX", "Transit", "PCX"};

            for (int i = 1; i <= 5; i++) {
                Vehicul vehicul = new Vehicul();
                vehicul.setNumarInmatriculare("B-" + (100 + i) + "-ABC");
                vehicul.setMarca(marci[i - 1]);
                vehicul.setModel(modele[i - 1]);
                vehicul.setTipVehicul(tipuriVehicul[i - 1]);
                vehicul.setCapacitateKg(new BigDecimal(i * 500));
                vehicul.setCapacitateVolumM3(new BigDecimal(i * 2));
                vehicul.setStatusVehicul("activ");
                vehicule.add(vehiculRepo.save(vehicul));
            }

            System.out.println("✓ " + vehicule.size() + " vehicule create");

            // 4. COMENZI (5 comenzi)
            List<Comanda> comenzi = new ArrayList<>();
            String[] modalitatiPlata = {"card", "cash", "card", "cash", "transfer"};
            String[] statusuriComanda = {"noua", "in_procesare", "finalizata", "noua", "in_procesare"};

            for (int i = 0; i < 5; i++) {
                Comanda comanda = new Comanda();
                comanda.setClient(utilizatori.get(i)); // Primii 5 sunt clienti
                if (i < 3) {
                    comanda.setCurier(utilizatori.get(5 + i % 3)); // Alocăm curieri
                }
                comanda.setDataCreare(LocalDateTime.now().minusDays(i));
                comanda.setModalitatePlata(modalitatiPlata[i]);
                comanda.setStatusComanda(statusuriComanda[i]);
                comenzi.add(comandaRepo.save(comanda));
            }

            System.out.println("✓ " + comenzi.size() + " comenzi create");

            // 5. COLETE (2 colete per comandă = 10 colete)
            List<Colet> colete = new ArrayList<>();
            String[] tipuriServiciu = {"standard", "express", "standard", "express", "overnight"};
            String[] statusuriColet = {"in_asteptare", "in_tranzit", "livrat", "in_asteptare", "in_tranzit"};

            int coletIndex = 0;
            for (int i = 0; i < 5; i++) {
                for (int j = 0; j < 2; j++) {
                    Colet colet = new Colet();
                    colet.setComanda(comenzi.get(i));
                    colet.setCodAwb("AWB" + String.format("%08d", coletIndex + 1));
                    colet.setGreutateKg(new BigDecimal((j + 1) * 2.5));
                    colet.setVolumM3(new BigDecimal((j + 1) * 0.5));
                    colet.setTipServiciu(tipuriServiciu[i]);
                    colet.setPretDeclarat(new BigDecimal((j + 1) * 100));
                    colet.setStatusColet(statusuriColet[i]);
                    colet.setAdresaExpeditor(adrese.get(i * 2));
                    colet.setAdresaDestinatar(adrese.get(i * 2 + 1));
                    colete.add(coletRepo.save(colet));
                    coletIndex++;
                }
            }

            System.out.println("✓ " + colete.size() + " colete create");

            // 6. TRASEE COLETE (5 trasee)
            List<TraseuColet> trasee = new ArrayList<>();
            String[] statusuriSegment = {"planificat", "in_curs", "finalizat", "planificat", "in_curs"};

            for (int i = 0; i < 5; i++) {
                TraseuColet traseu = new TraseuColet();
                traseu.setColet(colete.get(i));
                traseu.setVehicul(vehicule.get(i));
                traseu.setSofer(utilizatori.get(8 + i % 2)); // Soferii
                traseu.setDataIncarcare(LocalDateTime.now().minusDays(i + 1));
                if (i % 2 == 0) {
                    traseu.setDataDescarcare(LocalDateTime.now().minusDays(i));
                }
                traseu.setLocatieStart(adrese.get(i * 2).getOras());
                traseu.setLocatieStop(adrese.get(i * 2 + 1).getOras());
                traseu.setStatusSegment(statusuriSegment[i]);
                trasee.add(traseuColetRepo.save(traseu));
            }

            System.out.println("✓ " + trasee.size() + " trasee create");

            // 7. FACTURI (5 facturi)
            List<Factura> facturi = new ArrayList<>();
            String[] statusuriPlata = {"achitat", "neachitat", "achitat", "partial_achitat", "neachitat"};

            for (int i = 0; i < 5; i++) {
                Factura factura = new Factura();
                factura.setComanda(comenzi.get(i));
                factura.setSerieNumar("FACT-2025-" + String.format("%04d", i + 1));
                factura.setSumaTotala(new BigDecimal((i + 1) * 150.50));
                factura.setDataEmitere(LocalDate.now().minusDays(i));
                factura.setDataScadenta(LocalDate.now().plusDays(30 - i));
                factura.setStatusPlata(statusuriPlata[i]);
                facturi.add(facturaRepo.save(factura));
            }

            System.out.println("✓ " + facturi.size() + " facturi create");

            System.out.println("\n========================================");
            System.out.println("✅ Baza de date populată cu succes!");
            System.out.println("========================================");
            System.out.println("Total:");
            System.out.println("  - " + utilizatori.size() + " utilizatori");
            System.out.println("  - " + adrese.size() + " adrese");
            System.out.println("  - " + vehicule.size() + " vehicule");
            System.out.println("  - " + comenzi.size() + " comenzi");
            System.out.println("  - " + colete.size() + " colete");
            System.out.println("  - " + trasee.size() + " trasee");
            System.out.println("  - " + facturi.size() + " facturi");
            System.out.println("========================================");
            System.out.println("\nCredențiale utilizatori:");
            System.out.println("  Clienti: client1-5 / pass123");
            System.out.println("  Curieri: curier1-3 / pass123");
            System.out.println("  Soferi: sofer1-2 / pass123");
            System.out.println("  Admin: admin / admin123");
            System.out.println("========================================\n");
        };
    }
}
