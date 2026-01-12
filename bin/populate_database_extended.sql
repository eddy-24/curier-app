-- =====================================================
-- POPULARE EXTINSĂ BAZA DE DATE CURIER APP
-- Script pentru adăugarea de date suplimentare realiste
-- Creat: 2026-01-12
-- =====================================================

-- ===== UTILIZATORI SUPLIMENTARI =====

-- Mai mulți clienți (parola: "client123")
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('daniela.stan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Stan', 'Daniela', '0755123456', 'daniela.stan@gmail.com', 'client', true),
('george.lungu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lungu', 'George', '0766234567', 'george.lungu@yahoo.com', 'client', true),
('ioana.dumitru', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dumitru', 'Ioana', '0777345678', 'ioana.dumitru@gmail.com', 'client', true),
('adrian.marin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marin', 'Adrian', '0788456789', 'adrian.marin@outlook.com', 'client', true),
('cristina.barbu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Barbu', 'Cristina', '0744567890', 'cristina.barbu@gmail.com', 'client', true),
('florin.tudor', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tudor', 'Florin', '0733678901', 'florin.tudor@yahoo.com', 'client', true),
('monica.serban', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Șerban', 'Monica', '0722789012', 'monica.serban@gmail.com', 'client', true),
('razvan.munteanu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Munteanu', 'Răzvan', '0755890123', 'razvan.munteanu@outlook.com', 'client', true),
('diana.ene', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ene', 'Diana', '0766901234', 'diana.ene@gmail.com', 'client', true),
('bogdan.vlad', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vlad', 'Bogdan', '0777012345', 'bogdan.vlad@yahoo.com', 'client', true);

-- Mai mulți curieri (parola: "curier123")
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('cosmin.baciu', '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm', 'Baciu', 'Cosmin', '0788223344', 'cosmin.baciu@curierapp.ro', 'curier', true),
('alexandra.rusu', '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm', 'Rusu', 'Alexandra', '0799334455', 'alexandra.rusu@curierapp.ro', 'curier', true),
('lucian.enache', '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm', 'Enache', 'Lucian', '0755445566', 'lucian.enache@curierapp.ro', 'curier', true),
('simona.Constantin', '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm', 'Constantin', 'Simona', '0766556677', 'simona.constantin@curierapp.ro', 'curier', true);

-- Mai mulți operatori (parola: "operator123")
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('ion.operatorul', '$2a$10$9nrZmJ1ViU8oXcOzV3pS/OTxvqJKElz2oqXkHr1wdSmHnpQiUmgky', 'Popa', 'Ion', '0799667788', 'ion.popa@curierapp.ro', 'operator', true),
('laura.coordonator', '$2a$10$9nrZmJ1ViU8oXcOzV3pS/OTxvqJKElz2oqXkHr1wdSmHnpQiUmgky', 'Mihai', 'Laura', '0744778899', 'laura.mihai@curierapp.ro', 'operator', true);

-- ===== ADRESE SUPLIMENTARE =====

-- Adrese pentru noii clienți (câte 2-3 per client)
INSERT INTO adresa (id_utilizator, oras, strada, numar, cod_postal, detalii_suplimentare) VALUES
-- Client 10: Daniela Stan
(10, 'Ploiești', 'Bulevardul Independenței', '55', '100015', 'Bloc D, Scara 1, Ap. 45'),
(10, 'Ploiești', 'Strada Cuza Vodă', '12', '100045', 'Casa cu gard metalic'),

-- Client 11: George Lungu
(11, 'Oradea', 'Strada Republicii', '78', '410073', 'Et. 4, Ap. 18'),
(11, 'Oradea', 'Piața Unirii', '5', '410100', 'Sediu firmă, biroul 202'),

-- Client 12: Ioana Dumitru  
(12, 'Sibiu', 'Strada Nicolae Bălcescu', '23', '550159', 'Apartament 7, Et. 2'),
(12, 'Sibiu', 'Piața Mare', '14', '550163', 'Magazin parter'),
(12, 'Sibiu', 'Strada Avram Iancu', '89', '550180', 'Vila nr. 89'),

-- Client 13: Adrian Marin
(13, 'Pitești', 'Bulevardul Petrochimiștilor', '45', '110402', 'Bloc 7, Sc. B, Ap. 56'),
(13, 'Pitești', 'Strada Victoriei', '11', '110017', 'Casă particulară'),

-- Client 14: Cristina Barbu
(14, 'Bacău', 'Strada Mihai Viteazu', '67', '600030', 'Et. 3, Ap. 23'),
(14, 'Bacău', 'Calea Mărășești', '120', '600017', 'Birouri, Et. 5'),

-- Client 15: Florin Tudor
(15, 'Arad', 'Bulevardul Revoluției', '34', '310025', 'Bloc M, Ap. 8'),
(15, 'Arad', 'Piața Avram Iancu', '6', '310131', 'Cabinet medical'),

-- Client 16: Monica Șerban
(16, 'Suceava', 'Strada Ștefan cel Mare', '101', '720224', 'Casa albă cu poartă neagră'),
(16, 'Suceava', 'Bulevardul Ana Ipătescu', '56', '720043', 'Bloc P2, Ap. 34'),

-- Client 17: Răzvan Munteanu
(17, 'Satu Mare', 'Strada Horea', '23', '440026', 'Et. 2, Ap. 12'),
(17, 'Satu Mare', 'Piața 25 Octombrie', '9', '440097', 'Birou contabilitate'),

-- Client 18: Diana Ene
(18, 'Baia Mare', 'Strada Victoriei', '88', '430122', 'Vila cu gradina'),
(18, 'Baia Mare', 'Bulevardul Traian', '45', '430212', 'Bloc A, Sc. 2, Ap. 67'),

-- Client 19: Bogdan Vlad
(19, 'Târgu Mureș', 'Piața Trandafirilor', '12', '540026', 'Bloc modern, Et. 6, Ap. 90'),
(19, 'Târgu Mureș', 'Strada Gheorghe Doja', '56', '540077', 'Casă cu etaj');

-- Adrese destinatari suplimentari
INSERT INTO adresa (oras, strada, numar, cod_postal, detalii_suplimentare, persoana_contact, telefon_contact) VALUES
('București', 'Strada Ion Brezoianu', '33', '010132', 'Bloc C, Sc. A, Ap. 12', 'Mihai Popescu', '0734111222'),
('București', 'Calea Dorobanți', '156', '010573', 'Clădire birouri, Et. 7', 'Ana Ionescu', '0745222333'),
('București', 'Bulevardul Unirii', '78', '030823', 'Bloc D5, Ap. 45', 'Victor Stan', '0756333444'),
('Cluj-Napoca', 'Strada Plopilor', '44', '400157', 'Casa cu gard verde', 'Ioana Mureș', '0767444555'),
('Cluj-Napoca', 'Bulevardul 21 Decembrie', '89', '400124', 'Bloc T, Et. 4, Ap. 88', 'Radu Pop', '0778555666'),
('Timișoara', 'Strada Martirilor', '67', '300086', 'Vila modernă', 'Cristian Dima', '0722666777'),
('Timișoara', 'Piața Libertății', '23', '300077', 'Magazin parter', 'Simona Petre', '0733777888'),
('Iași', 'Strada Lăpușneanu', '91', '700057', 'Bloc H, Sc. B, Ap. 34', 'Andrei Pavel', '0744888999'),
('Iași', 'Bulevardul Independenței', '12', '700088', 'Casă particulară nr. 12', 'Maria Vasile', '0755999000'),
('Brașov', 'Strada Mureșenilor', '45', '500030', 'Bloc 15, Ap. 23', 'George Lungu', '0766000111'),
('Brașov', 'Bulevardul Eroilor', '88', '500007', 'Et. 2, Cabinet stomatologic', 'Elena Dumitrescu', '0777111222'),
('Constanța', 'Bulevardul Tomis', '123', '900178', 'Bloc Marina, Ap. 56', 'Florin Matei', '0788222333'),
('Constanța', 'Strada Traian', '34', '900745', 'Casa cu piscină', 'Diana Ștefan', '0799333444'),
('Craiova', 'Strada Alexandru Ioan Cuza', '67', '200585', 'Bloc C, Ap. 78', 'Adrian Radu', '0744444555'),
('Craiova', 'Calea București', '145', '200323', 'Birouri, Et. 3', 'Monica Enache', '0755555666'),
('Galați', 'Strada Domnească', '56', '800008', 'Bloc V, Sc. A, Ap. 12', 'Cosmin Barbu', '0766666777'),
('Galați', 'Bulevardul Dunării', '234', '800201', 'Vila cu etaj', 'Laura Constantin', '0777777888'),
('Ploiești', 'Bulevardul Republicii', '89', '100026', 'Bloc P, Ap. 34', 'Bogdan Marin', '0788888999'),
('Ploiești', 'Strada Ștefan cel Mare', '12', '100045', 'Casă de pe colț', 'Daniela Tudor', '0799999000'),
('Oradea', 'Strada Episcopiei', '23', '410087', 'Et. 1, Ap. 5', 'Răzvan Ene', '0722000111');

-- ===== COMENZI SUPLIMENTARE =====

INSERT INTO comanda (id_client, data_creare, modalitate_plata, status_comanda, id_curier_alocat) VALUES
-- Comenzi vechi (livrate)
(18, '2025-12-15 09:30:00', 'card', 'finalizata', 12),
(19, '2025-12-18 11:45:00', 'ramburs', 'finalizata', 13),
(20, '2025-12-20 14:20:00', 'ramburs', 'finalizata', 14),
(21, '2025-12-22 10:15:00', 'card', 'finalizata', 28),
(22, '2025-12-27 16:30:00', 'ramburs', 'finalizata', 29),

-- Comenzi din săptămâna trecută
(18, '2026-01-05 08:00:00', 'ramburs', 'finalizata', 12),
(19, '2026-01-05 13:30:00', 'card', 'finalizata', 13),
(23, '2026-01-06 10:45:00', 'ramburs', 'finalizata', 14),
(24, '2026-01-07 15:20:00', 'card', 'finalizata', 28),
(25, '2026-01-08 09:10:00', 'ramburs', 'finalizata', 29),

-- Comenzi în curs
(20, '2026-01-09 11:00:00', 'ramburs', 'asignata', 12),
(26, '2026-01-09 14:30:00', 'card', 'in_curs', 13),
(21, '2026-01-10 08:45:00', 'ramburs', 'asignata', 14),
(27, '2026-01-10 16:00:00', 'ramburs', 'in_curs', 28),
(22, '2026-01-11 09:30:00', 'card', 'asignata', 29),

-- Comenzi noi (nepreluate)
(23, '2026-01-11 10:15:00', 'ramburs', 'noua', NULL),
(24, '2026-01-11 13:45:00', 'ramburs', 'noua', NULL),
(25, '2026-01-12 08:00:00', 'card', 'noua', NULL),
(26, '2026-01-12 09:20:00', 'ramburs', 'noua', NULL),
(27, '2026-01-12 10:40:00', 'ramburs', 'noua', NULL);

-- ===== COLETE SUPLIMENTARE =====

-- Colete pentru comenzile vechi (livrate cu succes)
INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
(6, 'AWB2025121501', 3.5, 0.020, 'Standard', 220.00, NULL, 'livrat', 10, 15, 4, '2025-12-17 14:30:00'),
(7, 'AWB2025121801', 2.1, 0.012, 'Express', 180.00, true, 'livrat', 11, 16, 5, '2025-12-19 11:20:00'),
(8, 'AWB2025122001', 5.2, 0.035, 'Standard', 450.00, true, 'livrat', 12, 17, 6, '2025-12-23 16:45:00'),
(9, 'AWB2025122201', 1.8, 0.008, 'Document', 95.00, NULL, 'livrat', 13, 18, 14, '2025-12-24 10:15:00'),
(10, 'AWB2025122701', 4.3, 0.028, 'Rapid', 380.00, true, 'livrat', 14, 19, 15, '2025-12-29 15:00:00'),

-- Colete din săptămâna trecută
(11, 'AWB2026010501', 2.8, 0.015, 'Standard', 195.00, true, 'livrat', 10, 20, 4, '2026-01-07 13:45:00'),
(12, 'AWB2026010502', 1.5, 0.007, 'Express', 125.00, NULL, 'livrat', 11, 21, 5, '2026-01-06 16:30:00'),
(13, 'AWB2026010601', 3.9, 0.022, 'Standard', 275.00, true, 'livrat', 15, 22, 6, '2026-01-08 11:20:00'),
(14, 'AWB2026010701', 2.2, 0.011, 'Rapid', 165.00, NULL, 'livrat', 16, 23, 14, '2026-01-09 14:10:00'),
(15, 'AWB2026010801', 6.1, 0.040, 'Standard', 520.00, true, 'livrat', 17, 24, 15, '2026-01-10 10:45:00'),

-- Colete în curs de livrare
(16, 'AWB2026010901', 3.2, 0.018, 'Express', 285.00, false, 'in_livrare', 12, 25, 4, NULL),
(17, 'AWB2026010902', 1.9, 0.009, 'Standard', 145.00, NULL, 'in_tranzit', 18, 26, 5, NULL),
(18, 'AWB2026011001', 4.5, 0.030, 'Rapid', 395.00, false, 'preluat_curier', 13, 27, 6, NULL),
(19, 'AWB2026011002', 2.7, 0.014, 'Express', 235.00, false, 'in_tranzit', 19, 28, 14, NULL),
(20, 'AWB2026011101', 5.8, 0.038, 'Standard', 480.00, NULL, 'ridicat', 14, 29, 15, NULL),

-- Colete noi (în așteptare)
(21, 'AWB2026011102', 2.3, 0.013, 'Standard', 175.00, false, 'in_asteptare', 15, 30, NULL, NULL),
(22, 'AWB2026011103', 1.6, 0.008, 'Document', 85.00, false, 'in_asteptare', 16, 31, NULL, NULL),
(23, 'AWB2026011201', 3.8, 0.024, 'Express', 325.00, NULL, 'in_asteptare', 17, 32, NULL, NULL),
(24, 'AWB2026011202', 4.9, 0.033, 'Rapid', 420.00, false, 'in_asteptare', 18, 33, NULL, NULL),
(25, 'AWB2026011203', 2.1, 0.011, 'Standard', 160.00, false, 'in_asteptare', 19, 34, NULL, NULL);

-- Colete suplimentare pentru comenzi multiple
INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
(16, 'AWB2026010903', 1.4, 0.007, 'Document', 95.00, false, 'in_livrare', 12, 15, 4, NULL),
(17, 'AWB2026010904', 2.8, 0.016, 'Standard', 210.00, NULL, 'in_tranzit', 18, 16, 5, NULL),
(18, 'AWB2026011003', 1.1, 0.005, 'Express', 125.00, false, 'preluat_curier', 13, 17, 6, NULL);

-- ===== TRACKING EVENTS DETALIATE =====

-- Pentru AWB2025121501 (livrat)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(7, 'inregistrat', 'Depozit Ploiești', 'Colet înregistrat în sistem', '2025-12-15 10:00:00', 7),
(7, 'preluat_curier', 'Depozit Ploiești', 'Preluat de curier Dan Marinescu', '2025-12-15 10:30:00', 4),
(7, 'in_tranzit', 'DN1 - Autostrada Soarelui', 'Transport către București', '2025-12-16 08:00:00', 4),
(7, 'in_livrare', 'București - Sector 1', 'Curier în zona de livrare', '2025-12-17 13:30:00', 4),
(7, 'livrat', 'Strada Ion Brezoianu 33', 'Colet livrat cu succes', '2025-12-17 14:30:00', 4);

-- Pentru AWB2025121801 (livrat cu ramburs)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(8, 'inregistrat', 'Depozit Oradea', 'Colet înregistrat - Ramburs 180 RON', '2025-12-18 12:00:00', 7),
(8, 'preluat_curier', 'Depozit Oradea', 'Preluat de curier Ana Stoica', '2025-12-18 12:30:00', 5),
(8, 'in_tranzit', 'Autostrada Transilvania', 'Transport către Cluj-Napoca', '2025-12-19 07:00:00', 5),
(8, 'in_livrare', 'Cluj-Napoca - Zona Plopilor', 'Curier în zona de livrare', '2025-12-19 10:30:00', 5),
(8, 'livrat', 'Strada Plopilor 44', 'Colet livrat - Ramburs încasat', '2025-12-19 11:20:00', 5);

-- Pentru AWB2026010901 (în livrare)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(21, 'inregistrat', 'Depozit Sibiu', 'Colet înregistrat în sistem', '2026-01-09 11:30:00', 7),
(21, 'preluat_curier', 'Depozit Sibiu', 'Preluat de curier Dan Marinescu', '2026-01-09 12:00:00', 4),
(21, 'in_tranzit', 'DN1 spre București', 'Transport către destinație', '2026-01-10 08:00:00', 4),
(21, 'in_livrare', 'București - Zona Unirii', 'Curier în zona de livrare', '2026-01-12 09:00:00', 4);

-- Pentru AWB2026010902 (în tranzit)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(22, 'inregistrat', 'Depozit Baia Mare', 'Colet înregistrat - plată cu cardul', '2026-01-09 15:00:00', 7),
(22, 'preluat_curier', 'Depozit Baia Mare', 'Preluat de curier Ana Stoica', '2026-01-09 15:30:00', 5),
(22, 'in_tranzit', 'DN1C spre Cluj', 'Transport către Cluj-Napoca', '2026-01-10 07:00:00', 5);

-- Pentru AWB2026011001 (preluat curier)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(23, 'inregistrat', 'Depozit Pitești', 'Colet înregistrat - Ramburs 395 RON', '2026-01-10 09:15:00', 7),
(23, 'preluat_curier', 'Depozit Pitești', 'Preluat de curier Radu Dobre', '2026-01-10 10:00:00', 6);

-- Pentru AWB2026011002 (în tranzit)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(24, 'inregistrat', 'Depozit Târgu Mureș', 'Colet înregistrat - Ramburs 235 RON', '2026-01-10 16:30:00', 7),
(24, 'preluat_curier', 'Depozit Târgu Mureș', 'Preluat de curier Cosmin Baciu', '2026-01-10 17:00:00', 14),
(24, 'in_tranzit', 'DN15 spre Brașov', 'Transport către destinație', '2026-01-11 08:00:00', 14);

-- Pentru AWB2026011101 (ridicat)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(25, 'inregistrat', 'Depozit Bacău', 'Colet înregistrat - plată cu cardul', '2026-01-11 10:00:00', 7),
(25, 'preluat_curier', 'Depozit Bacău', 'Preluat de curier Alexandra Rusu', '2026-01-11 10:30:00', 15),
(25, 'ridicat', 'Calea Mărășești 120', 'Colet ridicat de la expeditor', '2026-01-11 11:15:00', 15);

-- Pentru colete în așteptare (doar înregistrare)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(26, 'inregistrat', 'Depozit Arad', 'Colet înregistrat - așteptare asignare curier', '2026-01-11 10:45:00', 7),
(27, 'inregistrat', 'Depozit Suceava', 'Document înregistrat - așteptare asignare curier', '2026-01-11 14:15:00', 7),
(28, 'inregistrat', 'Depozit Satu Mare', 'Colet înregistrat - plată cu cardul', '2026-01-12 08:30:00', 7),
(29, 'inregistrat', 'Depozit Baia Mare', 'Colet înregistrat - așteptare asignare curier', '2026-01-12 09:50:00', 7),
(30, 'inregistrat', 'Depozit Târgu Mureș', 'Colet înregistrat - așteptare asignare curier', '2026-01-12 11:10:00', 7);

-- ===== FACTURI SUPLIMENTARE =====

INSERT INTO factura (id_client, numar_factura, data_emitere, data_scadenta, suma_totala, suma_platita, status_plata, detalii) VALUES
-- Facturi achitate (vechi)
(10, 'FACT-2025-125', '2025-12-15', '2025-12-29', 18.50, 18.50, 'achitat', 'Transport AWB2025121501 - București'),
(11, 'FACT-2025-126', '2025-12-18', '2026-01-01', 22.80, 22.80, 'achitat', 'Transport AWB2025121801 - Cluj-Napoca'),
(12, 'FACT-2025-127', '2025-12-20', '2026-01-03', 35.40, 35.40, 'achitat', 'Transport AWB2025122001 - Timișoara'),
(13, 'FACT-2025-128', '2025-12-22', '2026-01-05', 14.90, 14.90, 'achitat', 'Transport AWB2025122201 - Iași'),
(14, 'FACT-2025-129', '2025-12-27', '2026-01-10', 28.60, 28.60, 'achitat', 'Transport AWB2025122701 - Brașov'),

-- Facturi din săptămâna trecută (achitate)
(10, 'FACT-2026-006', '2026-01-05', '2026-01-19', 16.30, 16.30, 'achitat', 'Transport AWB2026010501 - Constanța'),
(11, 'FACT-2026-007', '2026-01-05', '2026-01-19', 19.50, 19.50, 'achitat', 'Transport AWB2026010502 - Cluj-Napoca'),
(15, 'FACT-2026-008', '2026-01-06', '2026-01-20', 24.70, 24.70, 'achitat', 'Transport AWB2026010601 - Brașov'),
(16, 'FACT-2026-009', '2026-01-07', '2026-01-21', 21.40, 21.40, 'achitat', 'Transport AWB2026010701 - Iași'),
(17, 'FACT-2026-010', '2026-01-08', '2026-01-22', 42.80, 42.80, 'achitat', 'Transport AWB2026010801 - Galați'),

-- Facturi în curs (partial plătite sau neachitate)
(12, 'FACT-2026-011', '2026-01-09', '2026-01-23', 31.60, 15.00, 'partial', 'Transport AWB2026010901 + AWB2026010903'),
(18, 'FACT-2026-012', '2026-01-09', '2026-01-23', 27.50, 0.00, 'neachitat', 'Transport AWB2026010902 + AWB2026010904'),
(13, 'FACT-2026-013', '2026-01-10', '2026-01-24', 38.90, 0.00, 'neachitat', 'Transport AWB2026011001 + AWB2026011003'),
(19, 'FACT-2026-014', '2026-01-10', '2026-01-24', 26.70, 0.00, 'neachitat', 'Transport AWB2026011002'),
(14, 'FACT-2026-015', '2026-01-11', '2026-01-25', 44.20, 0.00, 'neachitat', 'Transport AWB2026011101'),

-- Facturi noi (neachitate)
(15, 'FACT-2026-016', '2026-01-11', '2026-01-25', 19.80, 0.00, 'neachitat', 'Transport AWB2026011102'),
(16, 'FACT-2026-017', '2026-01-11', '2026-01-25', 12.50, 0.00, 'neachitat', 'Transport AWB2026011103'),
(17, 'FACT-2026-018', '2026-01-12', '2026-01-26', 33.40, 0.00, 'neachitat', 'Transport AWB2026011201'),
(18, 'FACT-2026-019', '2026-01-12', '2026-01-26', 39.60, 0.00, 'neachitat', 'Transport AWB2026011202'),
(19, 'FACT-2026-020', '2026-01-12', '2026-01-26', 18.20, 0.00, 'neachitat', 'Transport AWB2026011203');

-- ===== RUTE CURIERI SUPLIMENTARE =====

INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
-- Cosmin Baciu (Curier 14) - zona Transilvania
(true, 'Târgu Mureș', 'Brașov', 'Mureș', 'Brașov', 1, 14),
(true, 'Târgu Mureș', 'Sibiu', 'Mureș', 'Sibiu', 2, 14),
(true, 'Târgu Mureș', 'Bistrița', 'Mureș', 'Bistrița-Năsăud', 3, 14),
(true, 'Târgu Mureș', 'Cluj-Napoca', 'Mureș', 'Cluj', 4, 14),

-- Alexandra Rusu (Curier 15) - zona Moldova  
(true, 'Bacău', 'Iași', 'Bacău', 'Iași', 1, 15),
(true, 'Bacău', 'Suceava', 'Bacău', 'Suceava', 2, 15),
(true, 'Bacău', 'Piatra Neamț', 'Bacău', 'Neamț', 3, 15),
(true, 'Bacău', 'Vaslui', 'Bacău', 'Vaslui', 4, 15),

-- Lucian Enache (Curier 16) - zona Vest
(true, 'Arad', 'Timișoara', 'Arad', 'Timiș', 1, 16),
(true, 'Arad', 'Oradea', 'Arad', 'Bihor', 2, 16),
(true, 'Arad', 'Deva', 'Arad', 'Hunedoara', 3, 16),

-- Simona Constantin (Curier 17) - zona Nord
(true, 'Satu Mare', 'Baia Mare', 'Satu Mare', 'Maramureș', 1, 17),
(true, 'Satu Mare', 'Cluj-Napoca', 'Satu Mare', 'Cluj', 2, 17),
(true, 'Satu Mare', 'Oradea', 'Satu Mare', 'Bihor', 3, 17);

-- ===== RAPOARTE STATISTICE =====
SELECT 'Date suplimentare adăugate cu succes!' as status,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'client') as total_clienti,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'curier') as total_curieri,
       (SELECT COUNT(*) FROM utilizator WHERE rol = 'operator') as total_operatori,
       (SELECT COUNT(*) FROM adresa WHERE id_utilizator IS NOT NULL) as adrese_clienti,
       (SELECT COUNT(*) FROM adresa WHERE id_utilizator IS NULL) as adrese_destinatari,
       (SELECT COUNT(*) FROM comanda) as total_comenzi,
       (SELECT COUNT(*) FROM colet) as total_colete,
       (SELECT COUNT(*) FROM colet WHERE status_colet = 'livrat') as colete_livrate,
       (SELECT COUNT(*) FROM colet WHERE status_colet IN ('in_tranzit', 'in_livrare', 'preluat_curier')) as colete_activ,
       (SELECT COUNT(*) FROM colet WHERE status_colet = 'in_asteptare') as colete_asteptare,
       (SELECT COUNT(*) FROM tracking_event) as total_evenimente,
       (SELECT COUNT(*) FROM factura) as total_facturi,
       (SELECT COUNT(*) FROM factura WHERE status_plata = 'achitat') as facturi_achitate,
       (SELECT COUNT(*) FROM factura WHERE status_plata = 'neachitat') as facturi_neachitate,
       (SELECT COUNT(*) FROM ruta_curier) as total_rute;

-- ===== NOTE =====
-- Acest script adaugă:
-- - 10 clienți noi (total: 13 clienți)
-- - 4 curieri noi (total: 7 curieri)
-- - 2 operatori noi (total: 3 operatori)
-- - 40+ adrese noi
-- - 20 comenzi noi (din decembrie 2025 până azi)
-- - 30+ colete noi cu diverse statusuri
-- - 50+ evenimente de tracking
-- - 20 facturi noi
-- - 15+ rute noi pentru curieri
-- Total: baza de date mult mai bogată și realistă!
