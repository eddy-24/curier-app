-- =====================================================
-- POPULARE COMPLETA BAZA DE DATE CURIER APP
-- Fara diacritice, parole in text clar
-- Creat: 2026-01-12
-- =====================================================

-- Stergem datele existente
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
-- ID-uri: 1-5 clienti originali, 6-8 curieri originali, 9 operator, 10 admin
-- ID-uri: 11-20 clienti noi, 21-24 curieri noi, 25-26 operatori noi

-- Clienti (parola: client123) - ID 1-5
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('andreea.popescu', 'client123', 'Popescu', 'Andreea', '0722123456', 'andreea.popescu@gmail.com', 'client', true),
('mihai.ionescu', 'client123', 'Ionescu', 'Mihai', '0733654321', 'mihai.ionescu@yahoo.com', 'client', true),
('elena.georgescu', 'client123', 'Georgescu', 'Elena', '0744987654', 'elena.georgescu@outlook.com', 'client', true),
('ion.popescu', 'client123', 'Popescu', 'Ion', '0755111222', 'ion.popescu@gmail.com', 'client', true),
('maria.stan', 'client123', 'Stan', 'Maria', '0766222333', 'maria.stan@yahoo.com', 'client', true);

-- Curieri (parola: curier123) - ID 6-8
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('dan.curier', 'curier123', 'Marinescu', 'Dan', '0755111222', 'dan.marinescu@curierapp.ro', 'curier', true),
('ana.transport', 'curier123', 'Stoica', 'Ana', '0766333444', 'ana.stoica@curierapp.ro', 'curier', true),
('radu.livrator', 'curier123', 'Dobre', 'Radu', '0777555666', 'radu.dobre@curierapp.ro', 'curier', true);

-- Operator (parola: operator123) - ID 9
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('maria.operator', 'operator123', 'Vasile', 'Maria', '0788777888', 'maria.vasile@curierapp.ro', 'operator', true);

-- Admin (parola: admin123) - ID 10
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('admin', 'admin123', 'Administrator', 'Sistem', '0700000000', 'admin@curierapp.ro', 'admin', true);

-- Clienti suplimentari (parola: client123) - ID 11-20
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
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

-- Curieri suplimentari (parola: curier123) - ID 21-24
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('cosmin.baciu', 'curier123', 'Baciu', 'Cosmin', '0788223344', 'cosmin.baciu@curierapp.ro', 'curier', true),
('alexandra.rusu', 'curier123', 'Rusu', 'Alexandra', '0799334455', 'alexandra.rusu@curierapp.ro', 'curier', true),
('lucian.enache', 'curier123', 'Enache', 'Lucian', '0755445566', 'lucian.enache@curierapp.ro', 'curier', true),
('simona.constantin', 'curier123', 'Constantin', 'Simona', '0766556677', 'simona.constantin@curierapp.ro', 'curier', true);

-- Operatori suplimentari (parola: operator123) - ID 25-26
INSERT INTO utilizator (username, parola, nume, prenume, telefon, email, rol, activ) VALUES
('ion.operatorul', 'operator123', 'Popa', 'Ion', '0799667788', 'ion.popa@curierapp.ro', 'operator', true),
('laura.coordonator', 'operator123', 'Mihai', 'Laura', '0744778899', 'laura.mihai@curierapp.ro', 'operator', true);

-- ===== ADRESE =====
-- Adrese expeditori (clienti) - ID 1-15
-- Adrese destinatari - ID 16-45

-- Adrese clienti originali (expeditori) - ID 1-5
INSERT INTO adresa (id_utilizator, oras, strada, numar, cod_postal, detalii_suplimentare) VALUES
(1, 'Bucuresti', 'Strada Aviatorilor', '15', '011853', 'Bloc A1, Ap. 23'),
(2, 'Cluj-Napoca', 'Strada Memorandumului', '8', '400114', 'Casa cu gard alb'),
(3, 'Timisoara', 'Bulevardul Revolutiei', '42', '300041', 'Et. 3, Apartament 12'),
(4, 'Brasov', 'Strada Republicii', '25', '500030', 'Vila cu gradina'),
(5, 'Constanta', 'Bulevardul Tomis', '78', '900178', 'Bloc Marine, Ap. 34');

-- Adrese clienti suplimentari - ID 6-15
INSERT INTO adresa (id_utilizator, oras, strada, numar, cod_postal, detalii_suplimentare) VALUES
(11, 'Ploiesti', 'Bulevardul Independentei', '55', '100015', 'Bloc D, Scara 1, Ap. 45'),
(12, 'Oradea', 'Strada Republicii', '78', '410073', 'Et. 4, Ap. 18'),
(13, 'Sibiu', 'Strada Nicolae Balcescu', '23', '550159', 'Apartament 7, Et. 2'),
(14, 'Pitesti', 'Bulevardul Petrochimistilor', '45', '110402', 'Bloc 7, Sc. B, Ap. 56'),
(15, 'Bacau', 'Strada Mihai Viteazu', '67', '600030', 'Et. 3, Ap. 23'),
(16, 'Arad', 'Bulevardul Revolutiei', '34', '310025', 'Bloc M, Ap. 8'),
(17, 'Suceava', 'Strada Stefan cel Mare', '101', '720224', 'Casa alba cu poarta neagra'),
(18, 'Satu Mare', 'Strada Horea', '23', '440026', 'Et. 2, Ap. 12'),
(19, 'Baia Mare', 'Strada Victoriei', '88', '430122', 'Vila cu gradina'),
(20, 'Targu Mures', 'Piata Trandafirilor', '12', '540026', 'Bloc modern, Et. 6, Ap. 90');

-- Adrese destinatari (fara utilizator) - ID 16-45
INSERT INTO adresa (oras, strada, numar, cod_postal, detalii_suplimentare, persoana_contact, telefon_contact) VALUES
('Bucuresti', 'Calea Victoriei', '126', '010083', 'Intrarea A, Et. 2', 'Vasile Muresan', '0721456789'),
('Constanta', 'Strada Mihai Viteazu', '33', '900001', 'Vila cu poarta verde', 'Carmen Nistor', '0732567890'),
('Iasi', 'Bulevardul Carol I', '19', '700506', 'Bloc C2, Sc. B, Ap. 45', 'Florin Andrei', '0743678901'),
('Brasov', 'Strada Republicii', '67', '500030', 'Casa cu numarul rosu', 'Diana Popa', '0754789012'),
('Craiova', 'Strada Unirii', '91', '200585', 'Et. 1, Birou 15', 'Marian Cristea', '0765890123'),
('Galati', 'Strada Brailei', '156', '800003', 'Depozit zona industriala', 'Sorin Radulescu', '0776901234'),
('Bucuresti', 'Strada Ion Brezoianu', '33', '010132', 'Bloc C, Sc. A, Ap. 12', 'Mihai Popescu', '0734111222'),
('Bucuresti', 'Calea Dorobanti', '156', '010573', 'Cladire birouri, Et. 7', 'Ana Ionescu', '0745222333'),
('Cluj-Napoca', 'Strada Plopilor', '44', '400157', 'Casa cu gard verde', 'Ioana Mures', '0767444555'),
('Cluj-Napoca', 'Bulevardul 21 Decembrie', '89', '400124', 'Bloc T, Et. 4, Ap. 88', 'Radu Pop', '0778555666'),
('Timisoara', 'Strada Martirilor', '67', '300086', 'Vila moderna', 'Cristian Dima', '0722666777'),
('Timisoara', 'Piata Libertatii', '23', '300077', 'Magazin parter', 'Simona Petre', '0733777888'),
('Iasi', 'Strada Lapusneanu', '91', '700057', 'Bloc H, Sc. B, Ap. 34', 'Andrei Pavel', '0744888999'),
('Brasov', 'Bulevardul Eroilor', '88', '500007', 'Et. 2, Cabinet stomatologic', 'Elena Dumitrescu', '0777111222'),
('Constanta', 'Strada Traian', '34', '900745', 'Casa cu piscina', 'Diana Stefan', '0799333444'),
('Craiova', 'Calea Bucuresti', '145', '200323', 'Birouri, Et. 3', 'Monica Enache', '0755555666'),
('Galati', 'Bulevardul Dunarii', '234', '800201', 'Vila cu etaj', 'Laura Constantin', '0777777888'),
('Ploiesti', 'Bulevardul Republicii', '89', '100026', 'Bloc P, Ap. 34', 'Bogdan Marin', '0788888999'),
('Oradea', 'Strada Episcopiei', '23', '410087', 'Et. 1, Ap. 5', 'Razvan Ene', '0722000111'),
('Sibiu', 'Piata Mare', '14', '550163', 'Magazin parter', 'Alexandru Pop', '0733111222'),
('Pitesti', 'Strada Victoriei', '11', '110017', 'Casa particulara', 'Mihaela Ion', '0744222333'),
('Bacau', 'Calea Marasesti', '120', '600017', 'Birouri, Et. 5', 'Cristian Radu', '0755333444'),
('Arad', 'Piata Avram Iancu', '6', '310131', 'Cabinet medical', 'Sorina Vasile', '0766444555'),
('Suceava', 'Bulevardul Ana Ipatescu', '56', '720043', 'Bloc P2, Ap. 34', 'Ionut Popa', '0777555666'),
('Targu Mures', 'Strada Gheorghe Doja', '56', '540077', 'Casa cu etaj', 'Marius Toma', '0788666777');

-- ===== COMENZI =====
-- Comenzi vechi finalizate: 1-10
-- Comenzi in curs: 11-18
-- Comenzi noi: 19-25

INSERT INTO comanda (id_client, data_creare, modalitate_plata, status_comanda, id_curier_alocat) VALUES
-- Comenzi vechi finalizate (decembrie 2025)
(1, '2025-12-05 10:30:00', 'ramburs', 'finalizata', 6),
(2, '2025-12-08 14:15:00', 'card', 'finalizata', 7),
(3, '2025-12-10 09:45:00', 'ramburs', 'finalizata', 8),
(4, '2025-12-12 16:20:00', 'card', 'finalizata', 6),
(5, '2025-12-15 08:10:00', 'ramburs', 'finalizata', 7),
(11, '2025-12-18 11:30:00', 'card', 'finalizata', 8),
(12, '2025-12-20 15:00:00', 'ramburs', 'finalizata', 21),
(13, '2025-12-22 09:00:00', 'card', 'finalizata', 22),
(14, '2025-12-27 14:30:00', 'ramburs', 'finalizata', 23),
(15, '2025-12-30 10:00:00', 'card', 'finalizata', 24),

-- Comenzi din saptamana trecuta (finalizate)
(1, '2026-01-05 09:30:00', 'ramburs', 'finalizata', 6),
(2, '2026-01-06 11:00:00', 'card', 'finalizata', 7),
(16, '2026-01-07 14:15:00', 'ramburs', 'finalizata', 8),

-- Comenzi in curs
(1, '2026-01-08 10:30:00', 'ramburs', 'asignata', 6),
(2, '2026-01-09 14:15:00', 'ramburs', 'asignata', 7),
(3, '2026-01-10 09:45:00', 'card', 'in_curs', 8),
(17, '2026-01-10 16:20:00', 'ramburs', 'asignata', 21),
(18, '2026-01-11 08:00:00', 'card', 'in_curs', 22),

-- Comenzi noi (neasignate)
(19, '2026-01-11 10:30:00', 'ramburs', 'noua', NULL),
(20, '2026-01-11 14:00:00', 'card', 'noua', NULL),
(4, '2026-01-12 08:15:00', 'ramburs', 'noua', NULL),
(5, '2026-01-12 09:00:00', 'ramburs', 'noua', NULL),
(11, '2026-01-12 09:30:00', 'card', 'noua', NULL),
(12, '2026-01-12 10:00:00', 'ramburs', 'noua', NULL),
(13, '2026-01-12 10:30:00', 'card', 'noua', NULL);

-- ===== COLETE =====

INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
-- Colete livrate (comenzi vechi)
(1, 'AWB2025120501', 2.5, 0.015, 'Standard', 150.00, true, 'livrat', 1, 21, 6, '2025-12-07 14:30:00'),
(2, 'AWB2025120801', 1.8, 0.008, 'Express', 280.00, NULL, 'livrat', 2, 22, 7, '2025-12-09 11:00:00'),
(3, 'AWB2025121001', 3.2, 0.025, 'Standard', 95.00, true, 'livrat', 3, 23, 8, '2025-12-12 16:45:00'),
(4, 'AWB2025121201', 4.5, 0.030, 'Rapid', 420.00, NULL, 'livrat', 4, 24, 6, '2025-12-14 10:15:00'),
(5, 'AWB2025121501', 2.1, 0.012, 'Standard', 175.00, true, 'livrat', 5, 25, 7, '2025-12-17 15:30:00'),
(6, 'AWB2025121801', 5.8, 0.040, 'Express', 550.00, NULL, 'livrat', 6, 26, 8, '2025-12-20 09:00:00'),
(7, 'AWB2025122001', 1.5, 0.008, 'Document', 85.00, true, 'livrat', 7, 27, 21, '2025-12-22 14:00:00'),
(8, 'AWB2025122201', 3.8, 0.025, 'Standard', 320.00, NULL, 'livrat', 8, 28, 22, '2025-12-24 11:30:00'),
(9, 'AWB2025122701', 2.3, 0.014, 'Rapid', 195.00, true, 'livrat', 9, 29, 23, '2025-12-29 16:00:00'),
(10, 'AWB2025123001', 4.1, 0.028, 'Express', 380.00, NULL, 'livrat', 10, 30, 24, '2026-01-02 10:45:00'),

-- Colete livrate (saptamana trecuta)
(11, 'AWB2026010501', 1.9, 0.011, 'Standard', 165.00, true, 'livrat', 1, 31, 6, '2026-01-07 15:20:00'),
(12, 'AWB2026010601', 3.4, 0.022, 'Express', 290.00, NULL, 'livrat', 2, 32, 7, '2026-01-08 12:00:00'),
(13, 'AWB2026010701', 2.7, 0.016, 'Rapid', 225.00, true, 'livrat', 11, 33, 8, '2026-01-09 14:30:00'),

-- Colete in curs de livrare
(14, 'AWB2026010801', 2.5, 0.015, 'Standard', 150.00, false, 'in_livrare', 1, 34, 6, NULL),
(15, 'AWB2026010901', 1.8, 0.008, 'Rapid', 89.50, false, 'in_tranzit', 2, 35, 7, NULL),
(16, 'AWB2026011001', 3.2, 0.025, 'Standard', NULL, NULL, 'ridicat', 3, 23, 8, NULL),
(17, 'AWB2026011002', 1.2, 0.005, 'Express', 245.00, false, 'preluat_curier', 12, 36, 21, NULL),
(18, 'AWB2026011101', 4.1, 0.035, 'Standard', 320.00, false, 'in_tranzit', 13, 37, 22, NULL),

-- Colete in asteptare (comenzi noi)
(19, 'AWB2026011102', 2.9, 0.018, 'Standard', 245.00, false, 'in_asteptare', 14, 38, NULL, NULL),
(20, 'AWB2026011103', 1.4, 0.007, 'Document', 75.00, NULL, 'in_asteptare', 15, 39, NULL, NULL),
(21, 'AWB2026011201', 3.6, 0.024, 'Express', 315.00, false, 'in_asteptare', 4, 40, NULL, NULL),
(22, 'AWB2026011202', 4.3, 0.029, 'Rapid', 395.00, false, 'in_asteptare', 5, 41, NULL, NULL),
(23, 'AWB2026011203', 2.2, 0.013, 'Standard', 185.00, NULL, 'in_asteptare', 6, 42, NULL, NULL),
(24, 'AWB2026011204', 1.8, 0.010, 'Express', 155.00, false, 'in_asteptare', 7, 43, NULL, NULL),
(25, 'AWB2026011205', 3.1, 0.020, 'Standard', 265.00, false, 'in_asteptare', 8, 44, NULL, NULL);

-- Colete suplimentare pentru comenzi cu multiple colete
INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
(14, 'AWB2026010802', 1.2, 0.006, 'Document', 65.00, false, 'in_livrare', 1, 21, 6, NULL),
(2, 'AWB2025120802', 0.8, 0.003, 'Document', 25.00, NULL, 'livrat', 2, 26, 7, '2025-12-09 11:30:00'),
(16, 'AWB2026011003', 2.4, 0.015, 'Standard', 205.00, NULL, 'ridicat', 3, 24, 8, NULL);

-- ===== TRACKING EVENTS =====

-- Evenimente pentru colete livrate (exemple)
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
-- AWB2025120501
(1, 'inregistrat', 'Depozit Bucuresti', 'Colet inregistrat in sistem', '2025-12-05 11:00:00', 9),
(1, 'preluat_curier', 'Depozit Bucuresti', 'Preluat de curier Dan Marinescu', '2025-12-05 11:30:00', 6),
(1, 'in_tranzit', 'Bucuresti - Sector 1', 'Transport catre destinatie', '2025-12-06 08:00:00', 6),
(1, 'in_livrare', 'Bucuresti - Zona Centrala', 'Curier in zona de livrare', '2025-12-07 13:30:00', 6),
(1, 'livrat', 'Strada Ion Brezoianu 33', 'Colet livrat cu succes - Ramburs incasat', '2025-12-07 14:30:00', 6),

-- AWB2025120801
(2, 'inregistrat', 'Depozit Cluj-Napoca', 'Colet inregistrat - plata card', '2025-12-08 15:00:00', 9),
(2, 'preluat_curier', 'Depozit Cluj-Napoca', 'Preluat de curier Ana Stoica', '2025-12-08 15:30:00', 7),
(2, 'in_livrare', 'Calea Dorobanti', 'Curier in zona de livrare', '2025-12-09 10:00:00', 7),
(2, 'livrat', 'Calea Dorobanti 156', 'Colet livrat cu succes', '2025-12-09 11:00:00', 7);

-- Evenimente pentru colete in curs
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
-- AWB2026010801 - In livrare
(14, 'inregistrat', 'Depozit Bucuresti', 'Colet preluat de la client si inregistrat in sistem', '2026-01-08 11:00:00', 9),
(14, 'preluat_curier', 'Depozit Bucuresti', 'Colet asignat curierului Dan Marinescu', '2026-01-08 11:30:00', 6),
(14, 'in_tranzit', 'Soseaua Nordului', 'Colet in transport catre destinatie', '2026-01-08 12:00:00', 6),
(14, 'in_livrare', 'Brasov - Zona Eroilor', 'Curier in zona de livrare', '2026-01-12 09:30:00', 6),

-- AWB2026010901 - In tranzit
(15, 'inregistrat', 'Depozit Cluj-Napoca', 'Colet preluat si inregistrat', '2026-01-09 14:45:00', 9),
(15, 'preluat_curier', 'Depozit Cluj-Napoca', 'Asignat curierului Ana Stoica', '2026-01-09 15:00:00', 7),
(15, 'in_tranzit', 'Autostrada A3', 'Transport catre Constanta', '2026-01-10 07:30:00', 7),

-- AWB2026011001 - Ridicat
(16, 'inregistrat', 'Depozit Timisoara', 'Colet inregistrat - plata cu cardul', '2026-01-10 10:15:00', 9),
(16, 'preluat_curier', 'Depozit Timisoara', 'Asignat curierului Radu Dobre', '2026-01-10 10:45:00', 8),
(16, 'ridicat', 'Bulevardul Revolutiei 42', 'Colet ridicat de la expeditor', '2026-01-10 11:30:00', 8),

-- AWB2026011002 - Preluat curier
(17, 'inregistrat', 'Depozit Oradea', 'Nou colet inregistrat', '2026-01-10 16:45:00', 9),
(17, 'preluat_curier', 'Depozit Oradea', 'Asignat curierului Cosmin Baciu', '2026-01-10 17:00:00', 21),

-- AWB2026011101 - In tranzit
(18, 'inregistrat', 'Depozit Sibiu', 'Colet inregistrat - Ramburs 320 RON', '2026-01-11 08:30:00', 9),
(18, 'preluat_curier', 'Depozit Sibiu', 'Asignat curierului Alexandra Rusu', '2026-01-11 09:00:00', 22),
(18, 'in_tranzit', 'DN1 spre Galati', 'Transport catre destinatie', '2026-01-11 14:00:00', 22);

-- Evenimente pentru colete in asteptare
INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(19, 'inregistrat', 'Depozit Pitesti', 'Colet inregistrat - asteptare asignare curier', '2026-01-11 11:00:00', 9),
(20, 'inregistrat', 'Depozit Bacau', 'Document inregistrat - asteptare asignare curier', '2026-01-11 14:30:00', 9),
(21, 'inregistrat', 'Depozit Brasov', 'Colet inregistrat - plata card', '2026-01-12 08:45:00', 9),
(22, 'inregistrat', 'Depozit Constanta', 'Colet inregistrat - asteptare asignare', '2026-01-12 09:15:00', 9),
(23, 'inregistrat', 'Depozit Ploiesti', 'Colet inregistrat - asteptare asignare', '2026-01-12 09:45:00', 9),
(24, 'inregistrat', 'Depozit Oradea', 'Colet inregistrat - plata card', '2026-01-12 10:15:00', 9),
(25, 'inregistrat', 'Depozit Sibiu', 'Colet inregistrat - asteptare asignare', '2026-01-12 10:45:00', 9);

-- ===== FACTURI =====

INSERT INTO factura (id_comanda, serie_numar, data_emitere, data_scadenta, suma_totala, status_plata) VALUES
-- Facturi achitate (comenzi vechi)
(1, 'FACT-2025-101', '2025-12-05', '2025-12-19', 15.50, 'achitat'),
(2, 'FACT-2025-102', '2025-12-08', '2025-12-22', 28.40, 'achitat'),
(3, 'FACT-2025-103', '2025-12-10', '2025-12-24', 12.80, 'achitat'),
(4, 'FACT-2025-104', '2025-12-12', '2025-12-26', 35.60, 'achitat'),
(5, 'FACT-2025-105', '2025-12-15', '2025-12-29', 18.90, 'achitat'),
(6, 'FACT-2025-106', '2025-12-18', '2026-01-01', 45.20, 'achitat'),
(7, 'FACT-2025-107', '2025-12-20', '2026-01-03', 11.50, 'achitat'),
(8, 'FACT-2025-108', '2025-12-22', '2026-01-05', 26.80, 'achitat'),
(9, 'FACT-2025-109', '2025-12-27', '2026-01-10', 19.50, 'achitat'),
(10, 'FACT-2025-110', '2025-12-30', '2026-01-13', 32.40, 'achitat'),

-- Facturi achitate (saptamana trecuta)
(11, 'FACT-2026-001', '2026-01-05', '2026-01-19', 17.90, 'achitat'),
(12, 'FACT-2026-002', '2026-01-06', '2026-01-20', 29.60, 'achitat'),
(13, 'FACT-2026-003', '2026-01-07', '2026-01-21', 22.80, 'achitat'),

-- Facturi neachitate (comenzi in curs)
(14, 'FACT-2026-004', '2026-01-08', '2026-01-22', 21.50, 'neachitat'),
(15, 'FACT-2026-005', '2026-01-09', '2026-01-23', 16.40, 'neachitat'),
(16, 'FACT-2026-006', '2026-01-10', '2026-01-24', 38.90, 'neachitat'),
(17, 'FACT-2026-007', '2026-01-10', '2026-01-24', 24.50, 'neachitat'),
(18, 'FACT-2026-008', '2026-01-11', '2026-01-25', 31.20, 'neachitat'),

-- Facturi noi
(19, 'FACT-2026-009', '2026-01-11', '2026-01-25', 24.50, 'neachitat'),
(20, 'FACT-2026-010', '2026-01-11', '2026-01-25', 9.80, 'neachitat'),
(21, 'FACT-2026-011', '2026-01-12', '2026-01-26', 31.20, 'neachitat'),
(22, 'FACT-2026-012', '2026-01-12', '2026-01-26', 36.80, 'neachitat'),
(23, 'FACT-2026-013', '2026-01-12', '2026-01-26', 19.40, 'neachitat'),
(24, 'FACT-2026-014', '2026-01-12', '2026-01-26', 15.90, 'neachitat'),
(25, 'FACT-2026-015', '2026-01-12', '2026-01-26', 27.60, 'neachitat');

-- ===== RUTE CURIERI =====

-- Dan Marinescu (ID 6) - zona Bucuresti si Sud
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Bucuresti', 'Brasov', 'Bucuresti', 'Brasov', 1, 6),
(true, 'Bucuresti', 'Ploiesti', 'Bucuresti', 'Prahova', 2, 6),
(true, 'Bucuresti', 'Pitesti', 'Bucuresti', 'Arges', 3, 6),
(true, 'Bucuresti', 'Constanta', 'Bucuresti', 'Constanta', 4, 6);

-- Ana Stoica (ID 7) - zona Cluj si Nord-Vest
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Cluj-Napoca', 'Oradea', 'Cluj', 'Bihor', 1, 7),
(true, 'Cluj-Napoca', 'Satu Mare', 'Cluj', 'Satu Mare', 2, 7),
(true, 'Cluj-Napoca', 'Baia Mare', 'Cluj', 'Maramures', 3, 7);

-- Radu Dobre (ID 8) - zona Timisoara si Vest
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Timisoara', 'Arad', 'Timis', 'Arad', 1, 8),
(true, 'Timisoara', 'Craiova', 'Timis', 'Dolj', 2, 8),
(true, 'Timisoara', 'Iasi', 'Timis', 'Iasi', 3, 8);

-- Cosmin Baciu (ID 21) - zona Transilvania
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Targu Mures', 'Brasov', 'Mures', 'Brasov', 1, 21),
(true, 'Targu Mures', 'Sibiu', 'Mures', 'Sibiu', 2, 21),
(true, 'Targu Mures', 'Cluj-Napoca', 'Mures', 'Cluj', 3, 21);

-- Alexandra Rusu (ID 22) - zona Moldova
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Bacau', 'Iasi', 'Bacau', 'Iasi', 1, 22),
(true, 'Bacau', 'Suceava', 'Bacau', 'Suceava', 2, 22),
(true, 'Bacau', 'Galati', 'Bacau', 'Galati', 3, 22);

-- Lucian Enache (ID 23) - zona Vest
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Arad', 'Timisoara', 'Arad', 'Timis', 1, 23),
(true, 'Arad', 'Oradea', 'Arad', 'Bihor', 2, 23);

-- Simona Constantin (ID 24) - zona Nord
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
(true, 'Satu Mare', 'Baia Mare', 'Satu Mare', 'Maramures', 1, 24),
(true, 'Satu Mare', 'Cluj-Napoca', 'Satu Mare', 'Cluj', 2, 24);

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

-- ===== REZUMAT PAROLE =====
-- admin: admin123
-- operatori: operator123
-- curieri: curier123
-- clienti: client123
