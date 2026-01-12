-- =====================================================
-- POPULARE EXTINSA BAZA DE DATE CURIER APP
-- Script pentru adaugarea de date suplimentare realiste
-- Fara diacritice, parole in text clar
-- Creat: 2026-01-12
-- =====================================================

-- Stergem datele existente pentru a evita conflicte
TRUNCATE TABLE tracking_event CASCADE;
TRUNCATE TABLE colet CASCADE;
TRUNCATE TABLE comanda CASCADE;
TRUNCATE TABLE factura CASCADE;
TRUNCATE TABLE ruta_curier CASCADE;
TRUNCATE TABLE adresa CASCADE;
TRUNCATE TABLE utilizator CASCADE;

-- Reset secvente
ALTER SEQUENCE utilizator_id_seq RESTART WITH 1;
ALTER SEQUENCE adresa_id_seq RESTART WITH 1;
ALTER SEQUENCE comanda_id_seq RESTART WITH 1;
ALTER SEQUENCE colet_id_seq RESTART WITH 1;
ALTER SEQUENCE tracking_event_id_seq RESTART WITH 1;
ALTER SEQUENCE factura_id_seq RESTART WITH 1;
ALTER SEQUENCE ruta_curier_id_seq RESTART WITH 1;

-- ===== UTILIZATORI =====

-- Admin (parola: admin123)
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('admin', 'admin123', 'Adminescu', 'Ion', '0700000001', 'admin@curierapp.ro', 'admin', true);

-- Operatori (parola: operator123)
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('maria.operator', 'operator123', 'Popescu', 'Maria', '0700000002', 'maria.operator@curierapp.ro', 'operator', true),
('ion.operatorul', 'operator123', 'Popa', 'Ion', '0799667788', 'ion.popa@curierapp.ro', 'operator', true),
('laura.coordonator', 'operator123', 'Mihai', 'Laura', '0744778899', 'laura.mihai@curierapp.ro', 'operator', true);

-- Curieri (parola: curier123)
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('dan.curier', 'curier123', 'Marinescu', 'Dan', '0722334455', 'dan.curier@curierapp.ro', 'curier', true),
('ana.transport', 'curier123', 'Stoica', 'Ana', '0733445566', 'ana.transport@curierapp.ro', 'curier', true),
('radu.livrator', 'curier123', 'Dobre', 'Radu', '0744556677', 'radu.livrator@curierapp.ro', 'curier', true),
('cosmin.baciu', 'curier123', 'Baciu', 'Cosmin', '0788223344', 'cosmin.baciu@curierapp.ro', 'curier', true),
('alexandra.rusu', 'curier123', 'Rusu', 'Alexandra', '0799334455', 'alexandra.rusu@curierapp.ro', 'curier', true),
('lucian.enache', 'curier123', 'Enache', 'Lucian', '0755445566', 'lucian.enache@curierapp.ro', 'curier', true),
('simona.constantin', 'curier123', 'Constantin', 'Simona', '0766556677', 'simona.constantin@curierapp.ro', 'curier', true);

-- Clienti (parola: client123)
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('ion.popescu', 'client123', 'Popescu', 'Ion', '0755111222', 'ion.popescu@gmail.com', 'client', true),
('elena.ionescu', 'client123', 'Ionescu', 'Elena', '0766222333', 'elena.ionescu@yahoo.com', 'client', true),
('mihai.georgian', 'client123', 'Georgian', 'Mihai', '0777333444', 'mihai.georgian@gmail.com', 'client', true),
('daniela.stan', 'client123', 'Stan', 'Daniela', '0755123456', 'daniela.stan@gmail.com', 'client', true),
('george.lungu', 'client123', 'Lungu', 'George', '0766234567', 'george.lungu@yahoo.com', 'client', true),
('ioana.dumitru', 'client123', 'Dumitru', 'Ioana', '0777345678', 'ioana.dumitru@gmail.com', 'client', true),
('adrian.marin', 'client123', 'Marin', 'Adrian', '0788456789', 'adrian.marin@outlook.com', 'client', true),
('cristina.barbu', 'client123', 'Barbu', 'Cristina', '0744567890', 'cristina.barbu@gmail.com', 'client', true),
('florin.tudor', 'client123', 'Tudor', 'Florin', '0733678901', 'florin.tudor@yahoo.com', 'client', true),
('monica.serban', 'client123', 'Serban', 'Monica', '0722789012', 'monica.serban@gmail.com', 'client', true),
('razvan.munteanu', 'client123', 'Munteanu', 'Razvan', '0755890123', 'razvan.munteanu@outlook.com', 'client', true),
('diana.ene', 'client123', 'Ene', 'Diana', '0766901234', 'diana.ene@gmail.com', 'client', true),
('bogdan.vlad', 'client123', 'Vlad', 'Bogdan', '0777012345', 'bogdan.vlad@yahoo.com', 'client', true);

-- ===== ADRESE =====

-- Adrese pentru clienti
INSERT INTO adresa (id_utilizator, oras, strada, numar, cod_postal, detalii_suplimentare) VALUES
-- Ion Popescu (ID 12)
(12, 'Bucuresti', 'Strada Victoriei', '45', '010061', 'Bloc A, Scara 2, Ap. 34'),
(12, 'Bucuresti', 'Bulevardul Unirii', '120', '030167', 'Cladire birouri, Et. 5'),

-- Elena Ionescu (ID 13)
(13, 'Cluj-Napoca', 'Strada Memorandumului', '28', '400114', 'Apartament 12, Et. 3'),
(13, 'Cluj-Napoca', 'Piata Mihai Viteazu', '5', '400150', 'Sediu firma'),

-- Mihai Georgian (ID 14)
(14, 'Timisoara', 'Bulevardul Revolutiei', '89', '300024', 'Vila cu gradina'),

-- Daniela Stan (ID 15)
(15, 'Ploiesti', 'Bulevardul Independentei', '55', '100015', 'Bloc D, Scara 1, Ap. 45'),
(15, 'Ploiesti', 'Strada Cuza Voda', '12', '100045', 'Casa cu gard metalic'),

-- George Lungu (ID 16)
(16, 'Oradea', 'Strada Republicii', '78', '410073', 'Et. 4, Ap. 18'),
(16, 'Oradea', 'Piata Unirii', '5', '410100', 'Sediu firma, biroul 202'),

-- Ioana Dumitru (ID 17)
(17, 'Sibiu', 'Strada Nicolae Balcescu', '23', '550159', 'Apartament 7, Et. 2'),
(17, 'Sibiu', 'Piata Mare', '14', '550163', 'Magazin parter'),

-- Adrian Marin (ID 18)
(18, 'Pitesti', 'Bulevardul Petrochimistilor', '45', '110402', 'Bloc 7, Sc. B, Ap. 56'),
(18, 'Pitesti', 'Strada Victoriei', '11', '110017', 'Casa particulara'),

-- Cristina Barbu (ID 19)
(19, 'Bacau', 'Strada Mihai Viteazu', '67', '600030', 'Et. 3, Ap. 23'),
(19, 'Bacau', 'Calea Marasesti', '120', '600017', 'Birouri, Et. 5'),

-- Florin Tudor (ID 20)
(20, 'Arad', 'Bulevardul Revolutiei', '34', '310025', 'Bloc M, Ap. 8'),
(20, 'Arad', 'Piata Avram Iancu', '6', '310131', 'Cabinet medical'),

-- Monica Serban (ID 21)
(21, 'Suceava', 'Strada Stefan cel Mare', '101', '720224', 'Casa alba cu poarta neagra'),
(21, 'Suceava', 'Bulevardul Ana Ipatescu', '56', '720043', 'Bloc P2, Ap. 34'),

-- Razvan Munteanu (ID 22)
(22, 'Satu Mare', 'Strada Horea', '23', '440026', 'Et. 2, Ap. 12'),
(22, 'Satu Mare', 'Piata 25 Octombrie', '9', '440097', 'Birou contabilitate'),

-- Diana Ene (ID 23)
(23, 'Baia Mare', 'Strada Victoriei', '88', '430122', 'Vila cu gradina'),
(23, 'Baia Mare', 'Bulevardul Traian', '45', '430212', 'Bloc A, Sc. 2, Ap. 67'),

-- Bogdan Vlad (ID 24)
(24, 'Targu Mures', 'Piata Trandafirilor', '12', '540026', 'Bloc modern, Et. 6, Ap. 90'),
(24, 'Targu Mures', 'Strada Gheorghe Doja', '56', '540077', 'Casa cu etaj');

-- Adrese destinatari (fara utilizator asociat)
INSERT INTO adresa (oras, strada, numar, cod_postal, detalii_suplimentare, persoana_contact, telefon_contact) VALUES
('Bucuresti', 'Strada Ion Brezoianu', '33', '010132', 'Bloc C, Sc. A, Ap. 12', 'Mihai Popescu', '0734111222'),
('Bucuresti', 'Calea Dorobanti', '156', '010573', 'Cladire birouri, Et. 7', 'Ana Ionescu', '0745222333'),
('Bucuresti', 'Bulevardul Unirii', '78', '030823', 'Bloc D5, Ap. 45', 'Victor Stan', '0756333444'),
('Cluj-Napoca', 'Strada Plopilor', '44', '400157', 'Casa cu gard verde', 'Ioana Mures', '0767444555'),
('Cluj-Napoca', 'Bulevardul 21 Decembrie', '89', '400124', 'Bloc T, Et. 4, Ap. 88', 'Radu Pop', '0778555666'),
('Timisoara', 'Strada Martirilor', '67', '300086', 'Vila moderna', 'Cristian Dima', '0722666777'),
('Timisoara', 'Piata Libertatii', '23', '300077', 'Magazin parter', 'Simona Petre', '0733777888'),
('Iasi', 'Strada Lapusneanu', '91', '700057', 'Bloc H, Sc. B, Ap. 34', 'Andrei Pavel', '0744888999'),
('Iasi', 'Bulevardul Independentei', '12', '700088', 'Casa particulara nr. 12', 'Maria Vasile', '0755999000'),
('Brasov', 'Strada Muresenilor', '45', '500030', 'Bloc 15, Ap. 23', 'George Lungu', '0766000111'),
('Brasov', 'Bulevardul Eroilor', '88', '500007', 'Et. 2, Cabinet stomatologic', 'Elena Dumitrescu', '0777111222'),
('Constanta', 'Bulevardul Tomis', '123', '900178', 'Bloc Marina, Ap. 56', 'Florin Matei', '0788222333'),
('Constanta', 'Strada Traian', '34', '900745', 'Casa cu piscina', 'Diana Stefan', '0799333444'),
('Craiova', 'Strada Alexandru Ioan Cuza', '67', '200585', 'Bloc C, Ap. 78', 'Adrian Radu', '0744444555'),
('Craiova', 'Calea Bucuresti', '145', '200323', 'Birouri, Et. 3', 'Monica Enache', '0755555666'),
('Galati', 'Strada Domneasca', '56', '800008', 'Bloc V, Sc. A, Ap. 12', 'Cosmin Barbu', '0766666777'),
('Galati', 'Bulevardul Dunarii', '234', '800201', 'Vila cu etaj', 'Laura Constantin', '0777777888'),
('Ploiesti', 'Bulevardul Republicii', '89', '100026', 'Bloc P, Ap. 34', 'Bogdan Marin', '0788888999'),
('Ploiesti', 'Strada Stefan cel Mare', '12', '100045', 'Casa de pe colt', 'Daniela Tudor', '0799999000'),
('Oradea', 'Strada Episcopiei', '23', '410087', 'Et. 1, Ap. 5', 'Razvan Ene', '0722000111');

-- ===== COMENZI =====

-- Comenzi vechi (finalizate)
INSERT INTO comanda (id_client, data_creare, modalitate_plata, status_comanda, id_curier_alocat) VALUES
(12, '2025-12-10 09:00:00', 'card', 'finalizata', 5),
(13, '2025-12-12 14:30:00', 'ramburs', 'finalizata', 6),
(14, '2025-12-15 11:00:00', 'card', 'finalizata', 7),
(15, '2025-12-18 10:15:00', 'ramburs', 'finalizata', 8),
(16, '2025-12-20 16:00:00', 'card', 'finalizata', 9),
(17, '2025-12-22 08:45:00', 'ramburs', 'finalizata', 10),
(18, '2025-12-27 13:30:00', 'card', 'finalizata', 11),

-- Comenzi din saptamana trecuta (finalizate)
(19, '2026-01-05 09:30:00', 'ramburs', 'finalizata', 5),
(20, '2026-01-06 11:00:00', 'card', 'finalizata', 6),
(21, '2026-01-07 14:15:00', 'ramburs', 'finalizata', 7),
(22, '2026-01-08 10:00:00', 'card', 'finalizata', 8),

-- Comenzi in curs
(23, '2026-01-09 08:30:00', 'ramburs', 'asignata', 9),
(24, '2026-01-09 15:00:00', 'card', 'in_curs', 10),
(12, '2026-01-10 09:45:00', 'ramburs', 'asignata', 11),
(13, '2026-01-10 16:30:00', 'ramburs', 'in_curs', 5),
(14, '2026-01-11 10:00:00', 'card', 'asignata', 6),

-- Comenzi noi (neasignate)
(15, '2026-01-11 11:30:00', 'ramburs', 'noua', NULL),
(16, '2026-01-11 14:00:00', 'card', 'noua', NULL),
(17, '2026-01-12 08:15:00', 'ramburs', 'noua', NULL),
(18, '2026-01-12 09:45:00', 'ramburs', 'noua', NULL),
(19, '2026-01-12 11:00:00', 'card', 'noua', NULL);

-- ===== COLETE =====

-- Colete livrate (comenzi vechi)
INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
(1, 'AWB2025121001', 2.5, 0.015, 'Standard', 150.00, NULL, 'livrat', 1, 25, 5, '2025-12-12 14:30:00'),
(2, 'AWB2025121201', 3.2, 0.020, 'Express', 280.00, true, 'livrat', 3, 26, 6, '2025-12-13 11:00:00'),
(3, 'AWB2025121501', 1.8, 0.010, 'Standard', 95.00, NULL, 'livrat', 5, 27, 7, '2025-12-17 16:45:00'),
(4, 'AWB2025121801', 4.5, 0.030, 'Rapid', 420.00, true, 'livrat', 6, 28, 8, '2025-12-20 10:15:00'),
(5, 'AWB2025122001', 2.1, 0.012, 'Standard', 175.00, NULL, 'livrat', 8, 29, 9, '2025-12-22 15:30:00'),
(6, 'AWB2025122201', 5.8, 0.040, 'Express', 550.00, true, 'livrat', 10, 30, 10, '2025-12-24 09:00:00'),
(7, 'AWB2025122701', 1.5, 0.008, 'Document', 85.00, NULL, 'livrat', 12, 31, 11, '2025-12-29 14:00:00'),

-- Colete livrate (saptamana trecuta)
(8, 'AWB2026010501', 3.8, 0.025, 'Standard', 320.00, true, 'livrat', 14, 32, 5, '2026-01-07 11:30:00'),
(9, 'AWB2026010601', 2.3, 0.014, 'Express', 195.00, NULL, 'livrat', 16, 33, 6, '2026-01-08 16:00:00'),
(10, 'AWB2026010701', 4.1, 0.028, 'Standard', 380.00, true, 'livrat', 18, 34, 7, '2026-01-09 10:45:00'),
(11, 'AWB2026010801', 1.9, 0.011, 'Rapid', 165.00, NULL, 'livrat', 20, 35, 8, '2026-01-10 15:20:00'),

-- Colete in curs de livrare
(12, 'AWB2026010901', 3.4, 0.022, 'Express', 290.00, false, 'in_livrare', 22, 36, 9, NULL),
(13, 'AWB2026010902', 2.7, 0.016, 'Standard', 225.00, NULL, 'in_tranzit', 24, 37, 10, NULL),
(14, 'AWB2026011001', 5.2, 0.035, 'Rapid', 480.00, false, 'preluat_curier', 1, 38, 11, NULL),
(15, 'AWB2026011002', 1.6, 0.009, 'Express', 140.00, false, 'in_tranzit', 3, 39, 5, NULL),
(16, 'AWB2026011101', 4.8, 0.032, 'Standard', 410.00, NULL, 'ridicat', 5, 40, 6, NULL),

-- Colete in asteptare (comenzi noi)
(17, 'AWB2026011102', 2.9, 0.018, 'Standard', 245.00, false, 'in_asteptare', 6, 41, NULL, NULL),
(18, 'AWB2026011103', 1.4, 0.007, 'Document', 75.00, NULL, 'in_asteptare', 8, 42, NULL, NULL),
(19, 'AWB2026011201', 3.6, 0.024, 'Express', 315.00, false, 'in_asteptare', 10, 43, NULL, NULL),
(20, 'AWB2026011202', 4.3, 0.029, 'Rapid', 395.00, false, 'in_asteptare', 12, 44, NULL, NULL),
(21, 'AWB2026011203', 2.2, 0.013, 'Standard', 185.00, NULL, 'in_asteptare', 14, 25, NULL, NULL);

-- Colete suplimentare pentru comenzi cu multiple colete
INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
(12, 'AWB2026010903', 1.2, 0.006, 'Document', 65.00, false, 'in_livrare', 22, 26, 9, NULL),
(14, 'AWB2026011003', 2.4, 0.015, 'Standard', 205.00, false, 'preluat_curier', 1, 27, 11, NULL),
(2, 'AWB2025121202', 1.8, 0.010, 'Standard', 145.00, true, 'livrat', 3, 28, 6, '2025-12-13 11:30:00');

-- ===== TRACKING EVENTS =====

-- Evenimente pentru AWB2025121001 (livrat)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(1, 'inregistrat', 'Depozit Bucuresti', 'Colet inregistrat in sistem', '2025-12-10 09:30:00', 2),
(1, 'preluat_curier', 'Depozit Bucuresti', 'Preluat de curier Dan Marinescu', '2025-12-10 10:00:00', 5),
(1, 'in_tranzit', 'Bucuresti - Sector 1', 'Transport catre destinatie', '2025-12-11 08:00:00', 5),
(1, 'in_livrare', 'Bucuresti - Zona Centrala', 'Curier in zona de livrare', '2025-12-12 13:30:00', 5),
(1, 'livrat', 'Strada Ion Brezoianu 33', 'Colet livrat cu succes', '2025-12-12 14:30:00', 5);

-- Evenimente pentru AWB2025121201 (livrat cu ramburs)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(2, 'inregistrat', 'Depozit Cluj-Napoca', 'Colet inregistrat - Ramburs 280 RON', '2025-12-12 15:00:00', 2),
(2, 'preluat_curier', 'Depozit Cluj-Napoca', 'Preluat de curier Ana Stoica', '2025-12-12 15:30:00', 6),
(2, 'in_livrare', 'Bucuresti', 'Curier in zona de livrare', '2025-12-13 10:00:00', 6),
(2, 'livrat', 'Calea Dorobanti 156', 'Colet livrat - Ramburs incasat', '2025-12-13 11:00:00', 6);

-- Evenimente pentru colete in curs
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(12, 'inregistrat', 'Depozit Baia Mare', 'Colet inregistrat in sistem', '2026-01-09 09:00:00', 2),
(12, 'preluat_curier', 'Depozit Baia Mare', 'Preluat de curier Lucian Enache', '2026-01-09 09:30:00', 9),
(12, 'in_tranzit', 'DN1C spre Cluj', 'Transport catre destinatie', '2026-01-10 07:00:00', 9),
(12, 'in_livrare', 'Galati - Zona Centrala', 'Curier in zona de livrare', '2026-01-12 09:00:00', 9);

INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(13, 'inregistrat', 'Depozit Targu Mures', 'Colet inregistrat - plata card', '2026-01-09 15:30:00', 2),
(13, 'preluat_curier', 'Depozit Targu Mures', 'Preluat de curier Simona Constantin', '2026-01-09 16:00:00', 10),
(13, 'in_tranzit', 'DN15 spre Brasov', 'Transport catre destinatie', '2026-01-10 08:00:00', 10);

INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(14, 'inregistrat', 'Depozit Bucuresti', 'Colet inregistrat - Ramburs 480 RON', '2026-01-10 10:15:00', 2),
(14, 'preluat_curier', 'Depozit Bucuresti', 'Preluat de curier Dan Marinescu', '2026-01-10 11:00:00', 11);

INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(15, 'inregistrat', 'Depozit Cluj-Napoca', 'Colet inregistrat - Ramburs 140 RON', '2026-01-10 17:00:00', 2),
(15, 'preluat_curier', 'Depozit Cluj-Napoca', 'Preluat de curier Dan Marinescu', '2026-01-10 17:30:00', 5),
(15, 'in_tranzit', 'Autostrada A3', 'Transport catre Iasi', '2026-01-11 06:00:00', 5);

INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(16, 'inregistrat', 'Depozit Timisoara', 'Colet inregistrat - plata card', '2026-01-11 10:30:00', 2),
(16, 'preluat_curier', 'Depozit Timisoara', 'Preluat de curier Ana Stoica', '2026-01-11 11:00:00', 6),
(16, 'ridicat', 'Bulevardul Revolutiei 34', 'Colet ridicat de la expeditor', '2026-01-11 11:45:00', 6);

-- Evenimente pentru colete in asteptare
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(17, 'inregistrat', 'Depozit Ploiesti', 'Colet inregistrat - asteptare asignare', '2026-01-11 12:00:00', 2),
(18, 'inregistrat', 'Depozit Oradea', 'Document inregistrat - asteptare asignare', '2026-01-11 14:30:00', 2),
(19, 'inregistrat', 'Depozit Sibiu', 'Colet inregistrat - plata card', '2026-01-12 08:45:00', 2),
(20, 'inregistrat', 'Depozit Pitesti', 'Colet inregistrat - asteptare asignare', '2026-01-12 10:15:00', 2),
(21, 'inregistrat', 'Depozit Bacau', 'Colet inregistrat - asteptare asignare', '2026-01-12 11:30:00', 2);

-- ===== FACTURI =====

-- Facturi achitate (comenzi vechi)
INSERT INTO factura (id_client, numar_factura, data_emitere, data_scadenta, suma_totala, suma_platita, status_plata, detalii) VALUES
(12, 'FACT-2025-101', '2025-12-10', '2025-12-24', 15.50, 15.50, 'achitat', 'Transport AWB2025121001 - Bucuresti'),
(13, 'FACT-2025-102', '2025-12-12', '2025-12-26', 28.40, 28.40, 'achitat', 'Transport AWB2025121201 + AWB2025121202'),
(14, 'FACT-2025-103', '2025-12-15', '2025-12-29', 12.80, 12.80, 'achitat', 'Transport AWB2025121501 - Timisoara'),
(15, 'FACT-2025-104', '2025-12-18', '2026-01-01', 35.60, 35.60, 'achitat', 'Transport AWB2025121801 - Ploiesti'),
(16, 'FACT-2025-105', '2025-12-20', '2026-01-03', 18.90, 18.90, 'achitat', 'Transport AWB2025122001 - Oradea'),
(17, 'FACT-2025-106', '2025-12-22', '2026-01-05', 45.20, 45.20, 'achitat', 'Transport AWB2025122201 - Sibiu'),
(18, 'FACT-2025-107', '2025-12-27', '2026-01-10', 11.50, 11.50, 'achitat', 'Transport AWB2025122701 - Pitesti'),

-- Facturi achitate (saptamana trecuta)
(19, 'FACT-2026-001', '2026-01-05', '2026-01-19', 26.80, 26.80, 'achitat', 'Transport AWB2026010501 - Bacau'),
(20, 'FACT-2026-002', '2026-01-06', '2026-01-20', 19.50, 19.50, 'achitat', 'Transport AWB2026010601 - Arad'),
(21, 'FACT-2026-003', '2026-01-07', '2026-01-21', 32.40, 32.40, 'achitat', 'Transport AWB2026010701 - Suceava'),
(22, 'FACT-2026-004', '2026-01-08', '2026-01-22', 17.90, 17.90, 'achitat', 'Transport AWB2026010801 - Satu Mare'),

-- Facturi in curs
(23, 'FACT-2026-005', '2026-01-09', '2026-01-23', 29.60, 15.00, 'partial', 'Transport AWB2026010901 + AWB2026010903'),
(24, 'FACT-2026-006', '2026-01-09', '2026-01-23', 22.80, 0.00, 'neachitat', 'Transport AWB2026010902'),
(12, 'FACT-2026-007', '2026-01-10', '2026-01-24', 54.20, 0.00, 'neachitat', 'Transport AWB2026011001 + AWB2026011003'),
(13, 'FACT-2026-008', '2026-01-10', '2026-01-24', 16.40, 0.00, 'neachitat', 'Transport AWB2026011002'),
(14, 'FACT-2026-009', '2026-01-11', '2026-01-25', 38.90, 0.00, 'neachitat', 'Transport AWB2026011101'),

-- Facturi noi
(15, 'FACT-2026-010', '2026-01-11', '2026-01-25', 24.50, 0.00, 'neachitat', 'Transport AWB2026011102'),
(16, 'FACT-2026-011', '2026-01-11', '2026-01-25', 9.80, 0.00, 'neachitat', 'Transport AWB2026011103'),
(17, 'FACT-2026-012', '2026-01-12', '2026-01-26', 31.20, 0.00, 'neachitat', 'Transport AWB2026011201'),
(18, 'FACT-2026-013', '2026-01-12', '2026-01-26', 36.80, 0.00, 'neachitat', 'Transport AWB2026011202'),
(19, 'FACT-2026-014', '2026-01-12', '2026-01-26', 19.40, 0.00, 'neachitat', 'Transport AWB2026011203');

-- ===== RUTE CURIERI =====

-- Dan Marinescu (ID 5) - zona Bucuresti si Sud
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Bucuresti', 'Ploiesti', 'Bucuresti', 'Prahova', 1, 5),
(true, 'Bucuresti', 'Pitesti', 'Bucuresti', 'Arges', 2, 5),
(true, 'Bucuresti', 'Craiova', 'Bucuresti', 'Dolj', 3, 5),
(true, 'Bucuresti', 'Constanta', 'Bucuresti', 'Constanta', 4, 5);

-- Ana Stoica (ID 6) - zona Vest
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Timisoara', 'Arad', 'Timis', 'Arad', 1, 6),
(true, 'Timisoara', 'Oradea', 'Timis', 'Bihor', 2, 6),
(true, 'Timisoara', 'Deva', 'Timis', 'Hunedoara', 3, 6);

-- Radu Dobre (ID 7) - zona Transilvania
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Cluj-Napoca', 'Sibiu', 'Cluj', 'Sibiu', 1, 7),
(true, 'Cluj-Napoca', 'Brasov', 'Cluj', 'Brasov', 2, 7),
(true, 'Cluj-Napoca', 'Targu Mures', 'Cluj', 'Mures', 3, 7);

-- Cosmin Baciu (ID 8) - zona Mures
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Targu Mures', 'Brasov', 'Mures', 'Brasov', 1, 8),
(true, 'Targu Mures', 'Sibiu', 'Mures', 'Sibiu', 2, 8),
(true, 'Targu Mures', 'Bistrita', 'Mures', 'Bistrita-Nasaud', 3, 8),
(true, 'Targu Mures', 'Cluj-Napoca', 'Mures', 'Cluj', 4, 8);

-- Alexandra Rusu (ID 9) - zona Moldova
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Bacau', 'Iasi', 'Bacau', 'Iasi', 1, 9),
(true, 'Bacau', 'Suceava', 'Bacau', 'Suceava', 2, 9),
(true, 'Bacau', 'Piatra Neamt', 'Bacau', 'Neamt', 3, 9),
(true, 'Bacau', 'Vaslui', 'Bacau', 'Vaslui', 4, 9);

-- Lucian Enache (ID 10) - zona Vest extins
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Arad', 'Timisoara', 'Arad', 'Timis', 1, 10),
(true, 'Arad', 'Oradea', 'Arad', 'Bihor', 2, 10),
(true, 'Arad', 'Deva', 'Arad', 'Hunedoara', 3, 10);

-- Simona Constantin (ID 11) - zona Nord
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Satu Mare', 'Baia Mare', 'Satu Mare', 'Maramures', 1, 11),
(true, 'Satu Mare', 'Cluj-Napoca', 'Satu Mare', 'Cluj', 2, 11),
(true, 'Satu Mare', 'Oradea', 'Satu Mare', 'Bihor', 3, 11);

-- ===== RAPORT FINAL =====
SELECT 'Date adaugate cu succes!' as status,
       (SELECT COUNT(*) FROM utilizator) as total_utilizatori,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'admin') as admini,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'operator') as operatori,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'curier') as curieri,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'client') as clienti,
       (SELECT COUNT(*) FROM adresa) as total_adrese,
       (SELECT COUNT(*) FROM comanda) as total_comenzi,
       (SELECT COUNT(*) FROM colet) as total_colete,
       (SELECT COUNT(*) FROM tracking_event) as total_evenimente,
       (SELECT COUNT(*) FROM factura) as total_facturi,
       (SELECT COUNT(*) FROM ruta_curier) as total_rute;
