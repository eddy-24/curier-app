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
            ServiciuRepository serviciuRepo,
            DepozitRepository depozitRepo,
            StatusColetRepository statusColetRepo,
            MotivEsecRepository motivEsecRepo,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Verificăm dacă există deja date
            if (utilizatorRepo.count() > 0) {
                System.out.println("Baza de date are deja date. Actualizez parolele...");
                
                // Actualizăm parolele pentru toți utilizatorii existenți
                utilizatorRepo.findAll().forEach(user -> {
                    String parolaNoua;
                    switch (user.getRol()) {
                        case "admin":
                            parolaNoua = "admin123";
                            break;
                        case "operator":
                            parolaNoua = "operator123";
                            break;
                        case "curier":
                            parolaNoua = "curier123";
                            break;
                        default:
                            parolaNoua = "client123";
                    }
                    user.setParola(passwordEncoder.encode(parolaNoua));
                    utilizatorRepo.save(user);
                });
                System.out.println("✓ Parole actualizate pentru toti utilizatorii!");
                System.out.println("  - admin: admin123");
                System.out.println("  - operator: operator123");
                System.out.println("  - curier: curier123");
                System.out.println("  - client: client123");
                return;
            }

            System.out.println("Populăm baza de date cu date de test...");

            // 1. UTILIZATORI REALIȘTI
            List<Utilizator> utilizatori = new ArrayList<>();
            
            // 3 Clienti realiști
            Utilizator client1 = new Utilizator();
            client1.setUsername("andreea.popescu");
            client1.setParola(passwordEncoder.encode("pass123"));
            client1.setNume("Popescu");
            client1.setPrenume("Andreea");
            client1.setTelefon("0722123456");
            client1.setEmail("andreea.popescu@gmail.com");
            client1.setRol("client");
            utilizatori.add(utilizatorRepo.save(client1));

            Utilizator client2 = new Utilizator();
            client2.setUsername("mihai.ionescu");
            client2.setParola(passwordEncoder.encode("pass123"));
            client2.setNume("Ionescu");
            client2.setPrenume("Mihai");
            client2.setTelefon("0733654321");
            client2.setEmail("mihai.ionescu@yahoo.com");
            client2.setRol("client");
            utilizatori.add(utilizatorRepo.save(client2));

            Utilizator client3 = new Utilizator();
            client3.setUsername("elena.georgescu");
            client3.setParola(passwordEncoder.encode("pass123"));
            client3.setNume("Georgescu");
            client3.setPrenume("Elena");
            client3.setTelefon("0744987654");
            client3.setEmail("elena.georgescu@outlook.com");
            client3.setRol("client");
            utilizatori.add(utilizatorRepo.save(client3));

            // 3 Curieri realiști
            Utilizator curier1 = new Utilizator();
            curier1.setUsername("dan.curier");
            curier1.setParola(passwordEncoder.encode("pass123"));
            curier1.setNume("Marinescu");
            curier1.setPrenume("Dan");
            curier1.setTelefon("0755111222");
            curier1.setEmail("dan.marinescu@curierapp.ro");
            curier1.setRol("curier");
            utilizatori.add(utilizatorRepo.save(curier1));

            Utilizator curier2 = new Utilizator();
            curier2.setUsername("ana.transport");
            curier2.setParola(passwordEncoder.encode("pass123"));
            curier2.setNume("Stoica");
            curier2.setPrenume("Ana");
            curier2.setTelefon("0766333444");
            curier2.setEmail("ana.stoica@curierapp.ro");
            curier2.setRol("curier");
            utilizatori.add(utilizatorRepo.save(curier2));

            Utilizator curier3 = new Utilizator();
            curier3.setUsername("radu.livrator");
            curier3.setParola(passwordEncoder.encode("pass123"));
            curier3.setNume("Dobre");
            curier3.setPrenume("Radu");
            curier3.setTelefon("0777555666");
            curier3.setEmail("radu.dobre@curierapp.ro");
            curier3.setRol("curier");
            utilizatori.add(utilizatorRepo.save(curier3));

            // 1 Operator
            Utilizator operator = new Utilizator();
            operator.setUsername("maria.operator");
            operator.setParola(passwordEncoder.encode("pass123"));
            operator.setNume("Vasile");
            operator.setPrenume("Maria");
            operator.setTelefon("0788777888");
            operator.setEmail("maria.vasile@curierapp.ro");
            operator.setRol("operator");
            utilizatori.add(utilizatorRepo.save(operator));

            // Admin
            Utilizator admin = new Utilizator();
            admin.setUsername("admin.sistem");
            admin.setParola(passwordEncoder.encode("pass123"));
            admin.setNume("Administrator");
            admin.setPrenume("Sistem");
            admin.setTelefon("0700000000");
            admin.setEmail("admin@curierapp.ro");
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

            // 8. SERVICII
            List<Serviciu> servicii = new ArrayList<>();
            
            Serviciu standard = new Serviciu("Standard", "Livrare în 2-3 zile lucrătoare", 
                    BigDecimal.valueOf(15.00), BigDecimal.valueOf(2.00), "2-3 zile");
            servicii.add(serviciuRepo.save(standard));
            
            Serviciu express = new Serviciu("Express", "Livrare în 24 ore", 
                    BigDecimal.valueOf(25.00), BigDecimal.valueOf(3.50), "24 ore");
            servicii.add(serviciuRepo.save(express));
            
            Serviciu sameDay = new Serviciu("Same Day", "Livrare în aceeași zi", 
                    BigDecimal.valueOf(45.00), BigDecimal.valueOf(5.00), "4-6 ore");
            servicii.add(serviciuRepo.save(sameDay));
            
            Serviciu economic = new Serviciu("Economic", "Livrare în 5-7 zile lucrătoare", 
                    BigDecimal.valueOf(10.00), BigDecimal.valueOf(1.50), "5-7 zile");
            servicii.add(serviciuRepo.save(economic));
            
            System.out.println("✓ " + servicii.size() + " servicii create");

            // 9. DEPOZITE
            List<Depozit> depozite = new ArrayList<>();
            
            Depozit dep1 = new Depozit("Depozit Central București", 
                    "Șos. Pipera nr. 42", "București", "București");
            dep1.setTelefon("021-123-4567");
            dep1.setEmail("bucuresti@curierapp.com");
            dep1.setCapacitateMaxima(10000);
            depozite.add(depozitRepo.save(dep1));
            
            Depozit dep2 = new Depozit("Depozit Cluj", 
                    "Str. Fabricii nr. 15", "Cluj-Napoca", "Cluj");
            dep2.setTelefon("0264-123-456");
            dep2.setEmail("cluj@curierapp.com");
            dep2.setCapacitateMaxima(5000);
            depozite.add(depozitRepo.save(dep2));
            
            Depozit dep3 = new Depozit("Depozit Timișoara", 
                    "Calea Aradului nr. 88", "Timișoara", "Timiș");
            dep3.setTelefon("0256-123-456");
            dep3.setEmail("timisoara@curierapp.com");
            dep3.setCapacitateMaxima(4000);
            depozite.add(depozitRepo.save(dep3));
            
            System.out.println("✓ " + depozite.size() + " depozite create");

            // 10. STATUSURI COLET
            List<StatusColet> statusuri = new ArrayList<>();
            
            statusuri.add(statusColetRepo.save(new StatusColet("inregistrat", "Înregistrat", "#6b7280", 1)));
            statusuri.add(statusColetRepo.save(new StatusColet("preluat", "Preluat de curier", "#3b82f6", 2)));
            statusuri.add(statusColetRepo.save(new StatusColet("in_tranzit", "În tranzit", "#8b5cf6", 3)));
            statusuri.add(statusColetRepo.save(new StatusColet("in_depozit", "În depozit", "#f59e0b", 4)));
            statusuri.add(statusColetRepo.save(new StatusColet("in_livrare", "În livrare", "#06b6d4", 5)));
            statusuri.add(statusColetRepo.save(new StatusColet("livrat", "Livrat", "#22c55e", 6)));
            statusuri.add(statusColetRepo.save(new StatusColet("esuat", "Livrare eșuată", "#ef4444", 7)));
            statusuri.add(statusColetRepo.save(new StatusColet("retur", "Returnat", "#f97316", 8)));
            
            System.out.println("✓ " + statusuri.size() + " statusuri create");

            // 11. MOTIVE ESEC
            List<MotivEsec> motive = new ArrayList<>();
            
            motive.add(motivEsecRepo.save(new MotivEsec("absent", "Destinatar absent", true)));
            motive.add(motivEsecRepo.save(new MotivEsec("adresa_gresita", "Adresă incorectă/inexistentă", false)));
            motive.add(motivEsecRepo.save(new MotivEsec("refuzat", "Colet refuzat de destinatar", false)));
            motive.add(motivEsecRepo.save(new MotivEsec("deteriorat", "Colet deteriorat", false)));
            motive.add(motivEsecRepo.save(new MotivEsec("telefon_invalid", "Telefon invalid/fără răspuns", true)));
            motive.add(motivEsecRepo.save(new MotivEsec("reprogramat", "Reprogramat la cererea clientului", true)));
            motive.add(motivEsecRepo.save(new MotivEsec("acces_imposibil", "Acces imposibil la adresă", true)));
            
            System.out.println("✓ " + motive.size() + " motive eșec create");

            System.out.println("========================================");
            System.out.println("Date administrative:");
            System.out.println("  - " + servicii.size() + " servicii");
            System.out.println("  - " + depozite.size() + " depozite");
            System.out.println("  - " + statusuri.size() + " statusuri");
            System.out.println("  - " + motive.size() + " motive eșec");
            System.out.println("========================================");
            System.out.println("\nCredențiale utilizatori:");
            System.out.println("  Clienti: client1-5 / pass123");
            System.out.println("  Curieri: curier1-3 / pass123");
            System.out.println("  Soferi: sofer1-2 / pass123");
            System.out.println("  Operatori: operator1-2 / pass123");
            System.out.println("  Admin: admin / admin123");
            System.out.println("========================================\n");
        };
    }
}
