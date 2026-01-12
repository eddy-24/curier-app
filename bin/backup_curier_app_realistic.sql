-- Backup Curier App - Date Realiste
-- Creat: 2026-01-11
-- Structură: 3 Clienți, 3 Curieri, 1 Admin, 1 Operator

-- Ștergem datele existente
TRUNCATE TABLE tracking_event CASCADE;
TRUNCATE TABLE factura CASCADE;
TRUNCATE TABLE colet CASCADE;
TRUNCATE TABLE comanda CASCADE;
TRUNCATE TABLE adresa CASCADE;
TRUNCATE TABLE utilizator CASCADE;
TRUNCATE TABLE ruta_curier CASCADE;

-- Reset sequences
ALTER SEQUENCE utilizator_id_utilizator_seq RESTART WITH 1;
ALTER SEQUENCE adresa_id_adresa_seq RESTART WITH 1;
ALTER SEQUENCE comanda_id_comanda_seq RESTART WITH 1;
ALTER SEQUENCE colet_id_colet_seq RESTART WITH 1;
ALTER SEQUENCE tracking_event_id_event_seq RESTART WITH 1;
ALTER SEQUENCE factura_id_factura_seq RESTART WITH 1;
ALTER SEQUENCE ruta_curier_id_ruta_seq RESTART WITH 1;

-- ===== UTILIZATORI =====

-- Clienți (parola: "client123")
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('andreea.popescu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Popescu', 'Andreea', '0722123456', 'andreea.popescu@gmail.com', 'client', true),
('mihai.ionescu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ionescu', 'Mihai', '0733654321', 'mihai.ionescu@yahoo.com', 'client', true),
('elena.georgescu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Georgescu', 'Elena', '0744987654', 'elena.georgescu@outlook.com', 'client', true);

-- Curieri (parola: "curier123")
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('dan.curier', '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm', 'Marinescu', 'Dan', '0755111222', 'dan.marinescu@curierapp.ro', 'curier', true),
('ana.transport', '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm', 'Stoica', 'Ana', '0766333444', 'ana.stoica@curierapp.ro', 'curier', true),
('radu.livrator', '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm', 'Dobre', 'Radu', '0777555666', 'radu.dobre@curierapp.ro', 'curier', true);

-- Operator (parola: "operator123")
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('maria.operator', '$2a$10$9nrZmJ1ViU8oXcOzV3pS/OTxvqJKElz2oqXkHr1wdSmHnpQiUmgky', 'Vasile', 'Maria', '0788777888', 'maria.vasile@curierapp.ro', 'operator', true);

-- Admin (parola: "admin123")
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('admin.sistem', '$2a$10$3gI6nP1GYSaKyN1Xb8vCNu5FZqJrC8kHzqKyE1oS2dY7VxJ9mKlP.', 'Administrator', 'Sistem', '0700000000', 'admin@curierapp.ro', 'admin', true);

-- ===== ADRESE =====

-- Adrese clienți (expeditori)
INSERT INTO adresa (id_utilizator, oras, strada, numar, cod_postal, detalii_suplimentare) VALUES
(1, 'București', 'Strada Aviatorilor', '15', '011853', 'Bloc A1, Ap. 23'),
(2, 'Cluj-Napoca', 'Strada Memorandumului', '8', '400114', 'Casa cu gard alb'),
(3, 'Timișoara', 'Bulevardul Revoluției', '42', '300041', 'Et. 3, Apartament 12');

-- Adrese destinatari
INSERT INTO adresa (oras, strada, numar, cod_postal, detalii_suplimentare, persoana_contact, telefon_contact) VALUES
('București', 'Calea Victoriei', '126', '010083', 'Intrarea A, Et. 2', 'Vasile Mureșan', '0721456789'),
('Constanța', 'Strada Mihai Viteazu', '33', '900001', 'Vila cu poartă verde', 'Carmen Nistor', '0732567890'),
('Iași', 'Bulevardul Carol I', '19', '700506', 'Bloc C2, Sc. B, Ap. 45', 'Florin Andrei', '0743678901'),
('Brașov', 'Strada Republicii', '67', '500030', 'Casa cu numărul roșu', 'Diana Popa', '0754789012'),
('Craiova', 'Strada Unirii', '91', '200585', 'Et. 1, Birou 15', 'Marian Cristea', '0765890123'),
('Galați', 'Strada Brăilei', '156', '800003', 'Depozit zona industrială', 'Sorin Rădulescu', '0776901234');

-- ===== COMENZI =====

INSERT INTO comanda (id_client, data_creare, modalitate_plata, status_comanda, id_curier_alocat) VALUES
(1, '2026-01-08 10:30:00', 'ramburs', 'asignata', 4),  -- Andreea -> Dan
(2, '2026-01-09 14:15:00', 'ramburs', 'asignata', 5),  -- Mihai -> Ana
(3, '2026-01-10 09:45:00', 'card', 'in_curs', 6),      -- Elena -> Radu
(1, '2026-01-10 16:20:00', 'ramburs', 'asignata', 4),  -- Andreea -> Dan (a doua comandă)
(2, '2026-01-11 08:10:00', 'ramburs', 'noua', NULL);   -- Mihai (neasignată încă)

-- ===== COLETE =====

INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier) VALUES
-- Comanda 1: Andreea -> București (Vasile)
(1, 'AWB2026010001', 2.5, 0.015, 'Standard', 150.00, false, 'in_livrare', 1, 4, 4),

-- Comanda 2: Mihai -> Constanța (Carmen)  
(2, 'AWB2026010002', 1.8, 0.008, 'Rapid', 89.50, false, 'in_tranzit', 2, 5, 5),

-- Comanda 3: Elena -> Iași (Florin) - plată cu cardul
(3, 'AWB2026010003', 3.2, 0.025, 'Standard', NULL, NULL, 'ridicat', 3, 6, 6),

-- Comanda 4: Andreea -> Brașov (Diana)
(4, 'AWB2026010004', 1.2, 0.005, 'Express', 245.00, false, 'preluat_curier', 1, 7, 4),

-- Comanda 5: Mihai -> Craiova (Marian) - încă neasignată
(5, 'AWB2026010005', 4.1, 0.035, 'Standard', 320.00, false, 'in_asteptare', 2, 8, NULL),

-- Colet suplimentar pentru comanda 2
(2, 'AWB2026010006', 0.8, 0.003, 'Document', 25.00, true, 'livrat', 2, 9, 5);

-- ===== TRACKING EVENTS =====

INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
-- AWB2026010001 - În livrare
(1, 'inregistrat', 'Depozit București', 'Colet preluat de la client și înregistrat în sistem', '2026-01-08 11:00:00', 7),
(1, 'preluat_curier', 'Depozit București', 'Colet asignat curierului Dan Marinescu', '2026-01-08 11:30:00', 4),
(1, 'in_tranzit', 'Șoseaua Nordului', 'Colet în transport către destinație', '2026-01-08 12:00:00', 4),
(1, 'in_livrare', 'Zona Aviatorilor', 'Curier în zona de livrare', '2026-01-11 09:30:00', 4),

-- AWB2026010002 - În tranzit  
(2, 'inregistrat', 'Depozit Cluj-Napoca', 'Colet preluat și înregistrat', '2026-01-09 14:45:00', 7),
(2, 'preluat_curier', 'Depozit Cluj-Napoca', 'Asignat curierului Ana Stoica', '2026-01-09 15:00:00', 5),
(2, 'in_tranzit', 'Autostrada A2', 'Transport către Constanța', '2026-01-10 07:30:00', 5),

-- AWB2026010003 - Ridicat
(3, 'inregistrat', 'Depozit Timișoara', 'Colet înregistrat - plată cu cardul', '2026-01-10 10:15:00', 7),
(3, 'preluat_curier', 'Depozit Timișoara', 'Asignat curierului Radu Dobre', '2026-01-10 10:45:00', 6),
(3, 'ridicat', 'Strada Revoluției 42', 'Colet ridicat de la expeditor', '2026-01-10 11:30:00', 6),

-- AWB2026010004 - Preluat curier
(4, 'inregistrat', 'Depozit București', 'Nou colet înregistrat', '2026-01-10 16:45:00', 7),
(4, 'preluat_curier', 'Depozit București', 'Asignat curierului Dan Marinescu', '2026-01-10 17:00:00', 4),

-- AWB2026010005 - În așteptare
(5, 'inregistrat', 'Depozit Cluj-Napoca', 'Colet înregistrat, așteptăm asignare curier', '2026-01-11 08:30:00', 7),

-- AWB2026010006 - Livrat cu ramburs încasat
(6, 'inregistrat', 'Depozit Cluj-Napoca', 'Document înregistrat', '2026-01-09 14:45:00', 7),
(6, 'preluat_curier', 'Depozit Cluj-Napoca', 'Asignat curierului Ana Stoica', '2026-01-09 15:00:00', 5),
(6, 'livrat', 'Strada Brăilei 156', 'Document livrat și ramburs încasat', '2026-01-10 14:20:00', 5);

-- ===== FACTURI =====

INSERT INTO factura (id_client, numar_factura, data_emitere, data_scadenta, suma_totala, suma_platita, status_plata, detalii) VALUES
(1, 'FACT-2026-001', '2026-01-08', '2026-01-22', 15.50, 15.50, 'achitat', 'Transport AWB2026010001 - București'),
(2, 'FACT-2026-002', '2026-01-09', '2026-01-23', 12.80, 12.80, 'achitat', 'Transport AWB2026010002 + AWB2026010006'),
(3, 'FACT-2026-003', '2026-01-10', '2026-01-24', 18.90, 18.90, 'achitat', 'Transport AWB2026010003 - Iași'),
(1, 'FACT-2026-004', '2026-01-10', '2026-01-24', 22.30, 0.00, 'neachitat', 'Transport AWB2026010004 - Brașov'),
(2, 'FACT-2026-005', '2026-01-11', '2026-01-25', 25.60, 0.00, 'neachitat', 'Transport AWB2026010005 - Craiova');

-- ===== RUTE CURIERI =====

INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
-- Dan Marinescu (București)
(true, 'București', 'Brașov', 'București', 'Brașov', 1, 4),
(true, 'București', 'Ploiești', 'București', 'Prahova', 2, 4),
(true, 'București', 'Giurgiu', 'București', 'Giurgiu', 3, 4),

-- Ana Stoica (Cluj-Napoca)  
(true, 'Cluj-Napoca', 'Constanța', 'Cluj', 'Constanța', 1, 5),
(true, 'Cluj-Napoca', 'Galați', 'Cluj', 'Galați', 2, 5),
(true, 'Cluj-Napoca', 'Satu Mare', 'Cluj', 'Satu Mare', 3, 5),

-- Radu Dobre (Timișoara)
(true, 'Timișoara', 'Iași', 'Timiș', 'Iași', 1, 6),
(true, 'Timișoara', 'Craiova', 'Timiș', 'Dolj', 2, 6),
(true, 'Timișoara', 'Arad', 'Timiș', 'Arad', 3, 6);

-- ===== CONFIRMARE =====
SELECT 'Backup completed successfully!' as status,
       (SELECT COUNT(*) FROM utilizator) as total_utilizatori,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'client') as clienti,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'curier') as curieri,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'operator') as operatori,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'admin') as admini,
       (SELECT COUNT(*) FROM adresa) as total_adrese,
       (SELECT COUNT(*) FROM comanda) as total_comenzi,
       (SELECT COUNT(*) FROM colet) as total_colete,
       (SELECT COUNT(*) FROM tracking_event) as total_events,
       (SELECT COUNT(*) FROM factura) as total_facturi;