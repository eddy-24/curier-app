-- =====================================================
-- POPULARE EXTINSĂ BAZA DE DATE CURIER APP (CORECTATĂ)
-- Script pentru adăugarea de date suplimentare realiste
-- Creat: 2026-01-12
-- =====================================================

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

-- Să obținem ID-urile comenzilor create pentru a le folosi în colete
DO $$
DECLARE
    cmd_id_1 INTEGER;
    cmd_id_2 INTEGER;
    cmd_id_3 INTEGER;
    cmd_id_4 INTEGER;
    cmd_id_5 INTEGER;
    cmd_id_6 INTEGER;
    cmd_id_7 INTEGER;
    cmd_id_8 INTEGER;
    cmd_id_9 INTEGER;
    cmd_id_10 INTEGER;
    cmd_id_11 INTEGER;
    cmd_id_12 INTEGER;
    cmd_id_13 INTEGER;
    cmd_id_14 INTEGER;
    cmd_id_15 INTEGER;
    cmd_id_16 INTEGER;
    cmd_id_17 INTEGER;
    cmd_id_18 INTEGER;
    cmd_id_19 INTEGER;
    cmd_id_20 INTEGER;
BEGIN
    -- Obținem ID-urile comenzilor recent create
    SELECT id_comanda INTO cmd_id_1 FROM comanda WHERE id_client = 18 AND data_creare = '2025-12-15 09:30:00';
    SELECT id_comanda INTO cmd_id_2 FROM comanda WHERE id_client = 19 AND data_creare = '2025-12-18 11:45:00';
    SELECT id_comanda INTO cmd_id_3 FROM comanda WHERE id_client = 20 AND data_creare = '2025-12-20 14:20:00';
    SELECT id_comanda INTO cmd_id_4 FROM comanda WHERE id_client = 21 AND data_creare = '2025-12-22 10:15:00';
    SELECT id_comanda INTO cmd_id_5 FROM comanda WHERE id_client = 22 AND data_creare = '2025-12-27 16:30:00';
    SELECT id_comanda INTO cmd_id_6 FROM comanda WHERE id_client = 18 AND data_creare = '2026-01-05 08:00:00';
    SELECT id_comanda INTO cmd_id_7 FROM comanda WHERE id_client = 19 AND data_creare = '2026-01-05 13:30:00';
    SELECT id_comanda INTO cmd_id_8 FROM comanda WHERE id_client = 23 AND data_creare = '2026-01-06 10:45:00';
    SELECT id_comanda INTO cmd_id_9 FROM comanda WHERE id_client = 24 AND data_creare = '2026-01-07 15:20:00';
    SELECT id_comanda INTO cmd_id_10 FROM comanda WHERE id_client = 25 AND data_creare = '2026-01-08 09:10:00';
    SELECT id_comanda INTO cmd_id_11 FROM comanda WHERE id_client = 20 AND data_creare = '2026-01-09 11:00:00';
    SELECT id_comanda INTO cmd_id_12 FROM comanda WHERE id_client = 26 AND data_creare = '2026-01-09 14:30:00';
    SELECT id_comanda INTO cmd_id_13 FROM comanda WHERE id_client = 21 AND data_creare = '2026-01-10 08:45:00';
    SELECT id_comanda INTO cmd_id_14 FROM comanda WHERE id_client = 27 AND data_creare = '2026-01-10 16:00:00';
    SELECT id_comanda INTO cmd_id_15 FROM comanda WHERE id_client = 22 AND data_creare = '2026-01-11 09:30:00';
    SELECT id_comanda INTO cmd_id_16 FROM comanda WHERE id_client = 23 AND data_creare = '2026-01-11 10:15:00';
    SELECT id_comanda INTO cmd_id_17 FROM comanda WHERE id_client = 24 AND data_creare = '2026-01-11 13:45:00';
    SELECT id_comanda INTO cmd_id_18 FROM comanda WHERE id_client = 25 AND data_creare = '2026-01-12 08:00:00';
    SELECT id_comanda INTO cmd_id_19 FROM comanda WHERE id_client = 26 AND data_creare = '2026-01-12 09:20:00';
    SELECT id_comanda INTO cmd_id_20 FROM comanda WHERE id_client = 27 AND data_creare = '2026-01-12 10:40:00';

    -- ===== COLETE SUPLIMENTARE =====
    
    -- Colete pentru comenzile vechi (livrate cu succes)
    INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
    (cmd_id_1, 'AWB2025121501', 3.5, 0.020, 'Standard', 220.00, NULL, 'livrat', 34, 15, 12, '2025-12-17 14:30:00'),
    (cmd_id_2, 'AWB2025121801', 2.1, 0.012, 'Express', 180.00, true, 'livrat', 35, 16, 13, '2025-12-19 11:20:00'),
    (cmd_id_3, 'AWB2025122001', 5.2, 0.035, 'Standard', 450.00, true, 'livrat', 36, 17, 14, '2025-12-23 16:45:00'),
    (cmd_id_4, 'AWB2025122201', 1.8, 0.008, 'Document', 95.00, NULL, 'livrat', 38, 18, 28, '2025-12-24 10:15:00'),
    (cmd_id_5, 'AWB2025122701', 4.3, 0.028, 'Rapid', 380.00, true, 'livrat', 39, 19, 29, '2025-12-29 15:00:00'),
    
    -- Colete din săptămâna trecută
    (cmd_id_6, 'AWB2026010501', 2.8, 0.015, 'Standard', 195.00, true, 'livrat', 34, 20, 12, '2026-01-07 13:45:00'),
    (cmd_id_7, 'AWB2026010502', 1.5, 0.007, 'Express', 125.00, NULL, 'livrat', 35, 21, 13, '2026-01-06 16:30:00'),
    (cmd_id_8, 'AWB2026010601', 3.9, 0.022, 'Standard', 275.00, true, 'livrat', 41, 22, 14, '2026-01-08 11:20:00'),
    (cmd_id_9, 'AWB2026010701', 2.2, 0.011, 'Rapid', 165.00, NULL, 'livrat', 42, 23, 28, '2026-01-09 14:10:00'),
    (cmd_id_10, 'AWB2026010801', 6.1, 0.040, 'Standard', 520.00, true, 'livrat', 43, 24, 29, '2026-01-10 10:45:00'),
    
    -- Colete în curs de livrare
    (cmd_id_11, 'AWB2026010901', 3.2, 0.018, 'Express', 285.00, false, 'in_livrare', 36, 25, 12, NULL),
    (cmd_id_12, 'AWB2026010902', 1.9, 0.009, 'Standard', 145.00, NULL, 'in_tranzit', 46, 26, 13, NULL),
    (cmd_id_13, 'AWB2026011001', 4.5, 0.030, 'Rapid', 395.00, false, 'preluat_curier', 38, 27, 14, NULL),
    (cmd_id_14, 'AWB2026011002', 2.7, 0.014, 'Express', 235.00, false, 'in_tranzit', 49, 28, 28, NULL),
    (cmd_id_15, 'AWB2026011101', 5.8, 0.038, 'Standard', 480.00, NULL, 'ridicat', 39, 29, 29, NULL),
    
    -- Colete noi (în așteptare)
    (cmd_id_16, 'AWB2026011102', 2.3, 0.013, 'Standard', 175.00, false, 'in_asteptare', 41, 30, NULL, NULL),
    (cmd_id_17, 'AWB2026011103', 1.6, 0.008, 'Document', 85.00, false, 'in_asteptare', 42, 31, NULL, NULL),
    (cmd_id_18, 'AWB2026011201', 3.8, 0.024, 'Express', 325.00, NULL, 'in_asteptare', 43, 32, NULL, NULL),
    (cmd_id_19, 'AWB2026011202', 4.9, 0.033, 'Rapid', 420.00, false, 'in_asteptare', 46, 33, NULL, NULL),
    (cmd_id_20, 'AWB2026011203', 2.1, 0.011, 'Standard', 160.00, false, 'in_asteptare', 49, 34, NULL, NULL);
    
    -- Colete suplimentare pentru comenzi multiple
    INSERT INTO colet (id_comanda, cod_awb, greutate_kg, volum_m3, tip_serviciu, pret_declarat, ramburs_incasat, status_colet, id_adresa_expeditor, id_adresa_destinatar, id_curier, data_livrare) VALUES
    (cmd_id_11, 'AWB2026010903', 1.4, 0.007, 'Document', 95.00, false, 'in_livrare', 36, 15, 12, NULL),
    (cmd_id_12, 'AWB2026010904', 2.8, 0.016, 'Standard', 210.00, NULL, 'in_tranzit', 46, 16, 13, NULL),
    (cmd_id_13, 'AWB2026011003', 1.1, 0.005, 'Express', 125.00, false, 'preluat_curier', 38, 17, 14, NULL);

    -- ===== TRACKING EVENTS =====
    
    -- Pentru AWB2025121501 (livrat)
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Ploiești', 'Colet înregistrat în sistem', '2025-12-15 10:00:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2025121501';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'preluat_curier', 'Depozit Ploiești', 'Preluat de curier Dan Marinescu', '2025-12-15 10:30:00', 12
    FROM colet c WHERE c.cod_awb = 'AWB2025121501';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'in_tranzit', 'DN1 - Autostrada Soarelui', 'Transport către București', '2025-12-16 08:00:00', 12
    FROM colet c WHERE c.cod_awb = 'AWB2025121501';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'in_livrare', 'București - Sector 1', 'Curier în zona de livrare', '2025-12-17 13:30:00', 12
    FROM colet c WHERE c.cod_awb = 'AWB2025121501';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'livrat', 'Strada Ion Brezoianu 33', 'Colet livrat cu succes', '2025-12-17 14:30:00', 12
    FROM colet c WHERE c.cod_awb = 'AWB2025121501';
    
    -- Pentru AWB2025121801 (livrat cu ramburs)
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Oradea', 'Colet înregistrat - Ramburs 180 RON', '2025-12-18 12:00:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2025121801';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'preluat_curier', 'Depozit Oradea', 'Preluat de curier Ana Stoica', '2025-12-18 12:30:00', 13
    FROM colet c WHERE c.cod_awb = 'AWB2025121801';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'in_tranzit', 'Autostrada Transilvania', 'Transport către Cluj-Napoca', '2025-12-19 07:00:00', 13
    FROM colet c WHERE c.cod_awb = 'AWB2025121801';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'in_livrare', 'Cluj-Napoca - Zona Plopilor', 'Curier în zona de livrare', '2025-12-19 10:30:00', 13
    FROM colet c WHERE c.cod_awb = 'AWB2025121801';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'livrat', 'Strada Plopilor 44', 'Colet livrat - Ramburs încasat', '2025-12-19 11:20:00', 13
    FROM colet c WHERE c.cod_awb = 'AWB2025121801';
    
    -- Pentru AWB2026010901 (în livrare)
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Sibiu', 'Colet înregistrat în sistem', '2026-01-09 11:30:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2026010901';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'preluat_curier', 'Depozit Sibiu', 'Preluat de curier Dan Marinescu', '2026-01-09 12:00:00', 12
    FROM colet c WHERE c.cod_awb = 'AWB2026010901';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'in_tranzit', 'DN1 spre București', 'Transport către destinație', '2026-01-10 08:00:00', 12
    FROM colet c WHERE c.cod_awb = 'AWB2026010901';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'in_livrare', 'București - Zona Unirii', 'Curier în zona de livrare', '2026-01-12 09:00:00', 12
    FROM colet c WHERE c.cod_awb = 'AWB2026010901';
    
    -- Pentru AWB2026010902 (în tranzit)
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Baia Mare', 'Colet înregistrat - plată cu cardul', '2026-01-09 15:00:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2026010902';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'preluat_curier', 'Depozit Baia Mare', 'Preluat de curier Ana Stoica', '2026-01-09 15:30:00', 13
    FROM colet c WHERE c.cod_awb = 'AWB2026010902';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'in_tranzit', 'DN1C spre Cluj', 'Transport către Cluj-Napoca', '2026-01-10 07:00:00', 13
    FROM colet c WHERE c.cod_awb = 'AWB2026010902';

    -- Pentru colete în așteptare (doar înregistrare)
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Arad', 'Colet înregistrat - așteptare asignare curier', '2026-01-11 10:45:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2026011102';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Suceava', 'Document înregistrat - așteptare asignare curier', '2026-01-11 14:15:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2026011103';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Satu Mare', 'Colet înregistrat - plată cu cardul', '2026-01-12 08:30:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2026011201';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Baia Mare', 'Colet înregistrat - așteptare asignare curier', '2026-01-12 09:50:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2026011202';
    
    INSERT INTO tracking_event (id_colet, status, locatie, descriere, data_event, id_utilizator) 
    SELECT c.id_colet, 'inregistrat', 'Depozit Târgu Mureș', 'Colet înregistrat - așteptare asignare curier', '2026-01-12 11:10:00', 15
    FROM colet c WHERE c.cod_awb = 'AWB2026011203';

    -- ===== FACTURI SUPLIMENTARE =====
    
    INSERT INTO factura (id_comanda, serie_numar, data_emitere, data_scadenta, suma_totala, status_plata) VALUES
    -- Facturi achitate (vechi)
    (cmd_id_1, 'FACT-2025-125', '2025-12-15', '2025-12-29', 18.50, 'achitat'),
    (cmd_id_2, 'FACT-2025-126', '2025-12-18', '2026-01-01', 22.80, 'achitat'),
    (cmd_id_3, 'FACT-2025-127', '2025-12-20', '2026-01-03', 35.40, 'achitat'),
    (cmd_id_4, 'FACT-2025-128', '2025-12-22', '2026-01-05', 14.90, 'achitat'),
    (cmd_id_5, 'FACT-2025-129', '2025-12-27', '2026-01-10', 28.60, 'achitat'),
    
    -- Facturi din săptămâna trecută (achitate)
    (cmd_id_6, 'FACT-2026-006', '2026-01-05', '2026-01-19', 16.30, 'achitat'),
    (cmd_id_7, 'FACT-2026-007', '2026-01-05', '2026-01-19', 19.50, 'achitat'),
    (cmd_id_8, 'FACT-2026-008', '2026-01-06', '2026-01-20', 24.70, 'achitat'),
    (cmd_id_9, 'FACT-2026-009', '2026-01-07', '2026-01-21', 21.40, 'achitat'),
    (cmd_id_10, 'FACT-2026-010', '2026-01-08', '2026-01-22', 42.80, 'achitat'),
    
    -- Facturi în curs (neachitate)
    (cmd_id_11, 'FACT-2026-011', '2026-01-09', '2026-01-23', 31.60, 'neachitat'),
    (cmd_id_12, 'FACT-2026-012', '2026-01-09', '2026-01-23', 27.50, 'neachitat'),
    (cmd_id_13, 'FACT-2026-013', '2026-01-10', '2026-01-24', 38.90, 'neachitat'),
    (cmd_id_14, 'FACT-2026-014', '2026-01-10', '2026-01-24', 26.70, 'neachitat'),
    (cmd_id_15, 'FACT-2026-015', '2026-01-11', '2026-01-25', 44.20, 'neachitat'),
    
    -- Facturi noi (neachitate)
    (cmd_id_16, 'FACT-2026-016', '2026-01-11', '2026-01-25', 19.80, 'neachitat'),
    (cmd_id_17, 'FACT-2026-017', '2026-01-11', '2026-01-25', 12.50, 'neachitat'),
    (cmd_id_18, 'FACT-2026-018', '2026-01-12', '2026-01-26', 33.40, 'neachitat'),
    (cmd_id_19, 'FACT-2026-019', '2026-01-12', '2026-01-26', 39.60, 'neachitat'),
    (cmd_id_20, 'FACT-2026-020', '2026-01-12', '2026-01-26', 18.20, 'neachitat');

END $$;

-- ===== RUTE CURIERI SUPLIMENTARE =====

INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier) VALUES
-- Cosmin Baciu (Curier 28) - zona Transilvania
(true, 'Târgu Mureș', 'Brașov', 'Mureș', 'Brașov', 1, 28),
(true, 'Târgu Mureș', 'Sibiu', 'Mureș', 'Sibiu', 2, 28),
(true, 'Târgu Mureș', 'Bistrița', 'Mureș', 'Bistrița-Năsăud', 3, 28),
(true, 'Târgu Mureș', 'Cluj-Napoca', 'Mureș', 'Cluj', 4, 28),

-- Alexandra Rusu (Curier 29) - zona Moldova  
(true, 'Bacău', 'Iași', 'Bacău', 'Iași', 1, 29),
(true, 'Bacău', 'Suceava', 'Bacău', 'Suceava', 2, 29),
(true, 'Bacău', 'Piatra Neamț', 'Bacău', 'Neamț', 3, 29),
(true, 'Bacău', 'Vaslui', 'Bacău', 'Vaslui', 4, 29),

-- Lucian Enache (Curier 30) - zona Vest
(true, 'Arad', 'Timișoara', 'Arad', 'Timiș', 1, 30),
(true, 'Arad', 'Oradea', 'Arad', 'Bihor', 2, 30),
(true, 'Arad', 'Deva', 'Arad', 'Hunedoara', 3, 30),

-- Simona Constantin (Curier 31) - zona Nord
(true, 'Satu Mare', 'Baia Mare', 'Satu Mare', 'Maramureș', 1, 31),
(true, 'Satu Mare', 'Cluj-Napoca', 'Satu Mare', 'Cluj', 2, 31),
(true, 'Satu Mare', 'Oradea', 'Satu Mare', 'Bihor', 3, 31);

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
