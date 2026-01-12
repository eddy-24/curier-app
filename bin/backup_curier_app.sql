-- =====================================================
-- BACKUP CURIER APP - Date pentru testare
-- Rulează acest script în DBeaver - selectează tot și Execute Script (Alt+X)
-- =====================================================

-- Ștergem datele existente (în ordinea corectă pentru FK)
TRUNCATE TABLE tracking_event CASCADE;
TRUNCATE TABLE traseu_colet CASCADE;
TRUNCATE TABLE factura CASCADE;
TRUNCATE TABLE colet CASCADE;
TRUNCATE TABLE comanda CASCADE;
TRUNCATE TABLE vehicul CASCADE;
TRUNCATE TABLE adresa CASCADE;
TRUNCATE TABLE utilizator CASCADE;

-- =====================================================
-- 1. UTILIZATORI
-- =====================================================
-- Parola pentru toți (exceptând admin): pass123
-- Parola admin: admin123
-- Hash-urile sunt generate cu BCrypt

-- Clienți (5), Operatori (2), Curieri (3), Șoferi (2), Admin (1)
INSERT INTO utilizator (id_utilizator, username, parola, nume, prenume, telefon, email, rol) VALUES
(1, 'client1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Popescu', 'Ion', '0712345671', 'client1@example.com', 'client'),
(2, 'client2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Ionescu', 'Maria', '0712345672', 'client2@example.com', 'client'),
(3, 'client3', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Georgescu', 'Andrei', '0712345673', 'client3@example.com', 'client'),
(4, 'client4', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Marinescu', 'Elena', '0712345674', 'client4@example.com', 'client'),
(5, 'client5', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Constantinescu', 'Alexandru', '0712345675', 'client5@example.com', 'client'),
(6, 'operator1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Dumitrescu', 'Carmen', '0722345671', 'operator1@curierapp.com', 'operator'),
(7, 'operator2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Vasilescu', 'Mihai', '0722345672', 'operator2@curierapp.com', 'operator'),
(8, 'curier1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Popa', 'Vasile', '0732345671', 'curier1@curierapp.com', 'curier'),
(9, 'curier2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Stan', 'Gheorghe', '0732345672', 'curier2@curierapp.com', 'curier'),
(10, 'curier3', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Radu', 'Nicolae', '0732345673', 'curier3@curierapp.com', 'curier'),
(11, 'sofer1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Munteanu', 'Cosmin', '0742345671', 'sofer1@curierapp.com', 'sofer'),
(12, 'sofer2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBHGoiV6X6N6K5W6aLIzL2WqMZa', 'Stoica', 'Daniel', '0742345672', 'sofer2@curierapp.com', 'sofer'),
(13, 'admin', '$2a$10$EqKZvN8gR9FHjKJ8xT8YyeQMwS2PLu.B3W.JcV0i6aZ7w.TxH8K6O', 'Administrator', 'System', '0700000000', 'admin@curierapp.com', 'admin');

-- =====================================================
-- 2. ADRESE (pentru clienți - 2 adrese fiecare)
-- =====================================================
-- Client 1-5, câte 2 adrese fiecare
INSERT INTO adresa (id_adresa, id_utilizator, oras, strada, numar, cod_postal, detalii_suplimentare) VALUES
(1, 1, 'București', 'Calea Victoriei', '120', '010093', 'Apartament 15, Etaj 3'),
(2, 1, 'București', 'Strada Lipscani', '45', '030033', 'Bloc A, Scara B'),
(3, 2, 'Cluj-Napoca', 'Strada Memorandumului', '28', '400114', 'Casa cu grădină'),
(4, 2, 'Cluj-Napoca', 'Bulevardul Eroilor', '15', '400129', 'Etaj 2, Apt 8'),
(5, 3, 'Timișoara', 'Piața Victoriei', '7', '300030', 'Clădirea de birouri, Et 5'),
(6, 3, 'Timișoara', 'Strada Alba Iulia', '33', '300077', 'Apartament 22'),
(7, 4, 'Iași', 'Bulevardul Ștefan cel Mare', '89', '700028', 'Bloc B4, Scara A'),
(8, 4, 'Iași', 'Strada Cuza Vodă', '56', '700036', 'Casă particulară'),
(9, 5, 'Brașov', 'Strada Republicii', '12', '500030', 'Centrul Comercial, Et 1'),
(10, 5, 'Brașov', 'Aleea Parcului', '8', '500407', 'Vila 15');

-- =====================================================
-- 3. VEHICULE (pentru șoferi)
-- =====================================================
INSERT INTO vehicul (id_vehicul, numar_inmatriculare, marca, model, tip_vehicul, capacitate_kg, capacitate_volum_m3, status_vehicul) VALUES
(1, 'B-123-CUR', 'Mercedes', 'Sprinter', 'duba', 1500.00, 15.00, 'activ'),
(2, 'B-456-CUR', 'Renault', 'Master', 'duba', 1200.00, 12.00, 'activ'),
(3, 'CJ-789-EXP', 'Ford', 'Transit', 'duba', 1000.00, 10.00, 'activ'),
(4, 'TM-321-DLV', 'Fiat', 'Ducato', 'duba', 800.00, 8.00, 'in_service'),
(5, 'IS-654-PKG', 'Volkswagen', 'Crafter', 'camion', 1400.00, 14.00, 'activ');

-- =====================================================
-- 4. COMENZI (diverse statusuri pentru testare)
-- =====================================================
-- Comenzi: nou(3), in_lucru(2), problema(2), livrat(3)
INSERT INTO comanda (id_comanda, id_client, data_creare, status_comanda) VALUES
(1, 1, '2026-01-10 08:30:00', 'nou'),
(2, 2, '2026-01-10 09:15:00', 'nou'),
(3, 3, '2026-01-10 10:00:00', 'nou'),
(4, 1, '2026-01-09 14:00:00', 'in_lucru'),
(5, 4, '2026-01-09 16:30:00', 'in_lucru'),
(6, 2, '2026-01-08 11:00:00', 'problema'),
(7, 5, '2026-01-08 13:45:00', 'problema'),
(8, 3, '2026-01-07 09:00:00', 'livrat'),
(9, 4, '2026-01-06 10:30:00', 'livrat'),
(10, 1, '2026-01-05 08:00:00', 'livrat');

-- =====================================================
-- 5. COLETE (diverse tipuri și statusuri)
-- =====================================================
-- 13 colete cu diverse statusuri
INSERT INTO colet (id_colet, id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, status_colet, id_adresa_expeditor, id_adresa_destinatar) VALUES
(1, 1, 'AWB2026011001', 2.50, 0.05, 'standard', 150.00, 'in_asteptare', 1, 3),
(2, 1, 'AWB2026011002', 1.20, 0.02, 'express', 75.00, 'in_asteptare', 1, 5),
(3, 2, 'AWB2026011003', 5.00, 0.10, 'overnight', 500.00, 'in_asteptare', 3, 7),
(4, 3, 'AWB2026011004', 0.80, 0.01, 'standard', 50.00, 'in_asteptare', 5, 9),
(5, 4, 'AWB2026010901', 3.00, 0.06, 'express', 200.00, 'in_tranzit', 2, 4),
(6, 4, 'AWB2026010902', 4.50, 0.08, 'standard', 300.00, 'ridicat', 2, 6),
(7, 5, 'AWB2026010903', 2.00, 0.04, 'overnight', 180.00, 'in_tranzit', 8, 10),
(8, 6, 'AWB2026010801', 1.50, 0.03, 'standard', 100.00, 'respins', 3, 1),
(9, 7, 'AWB2026010802', 6.00, 0.12, 'express', 450.00, 'returnat', 9, 2),
(10, 8, 'AWB2026010701', 2.20, 0.04, 'standard', 120.00, 'livrat', 5, 7),
(11, 8, 'AWB2026010702', 1.00, 0.02, 'express', 80.00, 'livrat', 5, 8),
(12, 9, 'AWB2026010601', 3.50, 0.07, 'overnight', 250.00, 'livrat', 7, 9),
(13, 10, 'AWB2026010501', 0.50, 0.01, 'standard', 35.00, 'livrat', 1, 10);

-- =====================================================
-- 6. TRACKING EVENT (tracking history pentru colete)
-- =====================================================
-- 10 tracking events pentru coletele 5, 10 și 8
INSERT INTO tracking_event (id_event, id_colet, status, locatie, descriere, data_event, id_utilizator) VALUES
(1, 5, 'ridicat', 'București - Depozit Central', 'Colet preluat de la expeditor', '2026-01-09 14:30:00', 8),
(2, 5, 'in_tranzit', 'București - Hub Sortare', 'Colet în procesare la hub', '2026-01-09 18:00:00', 8),
(3, 5, 'in_tranzit', 'Cluj-Napoca - Hub Regional', 'Colet ajuns în orașul destinație', '2026-01-10 06:00:00', 9),
(4, 10, 'ridicat', 'Timișoara - Punct Ridicare', 'Colet preluat de la expeditor', '2026-01-07 09:30:00', 8),
(5, 10, 'in_tranzit', 'Timișoara - Hub Sortare', 'Colet în procesare', '2026-01-07 12:00:00', 9),
(6, 10, 'in_livrare', 'Iași - Depozit Local', 'Colet în livrare către destinatar', '2026-01-07 18:00:00', 10),
(7, 10, 'livrat', 'Iași - Adresa Destinatar', 'Colet livrat cu succes. Semnătură: M. Ionescu', '2026-01-07 20:15:00', 10),
(8, 8, 'ridicat', 'Cluj-Napoca - Sediu', 'Colet preluat', '2026-01-08 11:30:00', 8),
(9, 8, 'in_tranzit', 'Cluj-Napoca - Hub', 'Colet în tranzit', '2026-01-08 14:00:00', 9),
(10, 8, 'respins', 'București - Adresa Destinatar', 'Destinatar refuză recepția - colet deteriorat', '2026-01-09 10:00:00', 10);

-- =====================================================
-- 7. TRASEU COLET (rute vehicule - opțional)
-- =====================================================
-- Lăsăm gol pentru moment, se populează când se asignează șoferi

-- =====================================================
-- 8. FACTURI (pentru comenzile livrate)
-- =====================================================
INSERT INTO factura (id_factura, id_comanda, serie_numar, suma_totala, data_emitere, data_scadenta, status_plata) VALUES
(1, 8, 'CUR-2026-0001', 45.00, '2026-01-07', '2026-02-06', 'achitat'),
(2, 9, 'CUR-2026-0002', 65.00, '2026-01-06', '2026-02-05', 'achitat'),
(3, 10, 'CUR-2026-0003', 25.00, '2026-01-05', '2026-02-04', 'neachitat');

-- =====================================================
-- CREDENȚIALE PENTRU TESTARE:
-- =====================================================
-- 👤 Clienți:     client1-5 / pass123
-- 📋 Operatori:   operator1-2 / pass123
-- 🚚 Curieri:     curier1-3 / pass123
-- 🚗 Șoferi:      sofer1-2 / pass123
-- 🔧 Admin:       admin / admin123
-- =====================================================
