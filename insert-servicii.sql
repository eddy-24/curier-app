-- Inserare servicii de livrare

INSERT INTO servicii (nume, descriere, pret_baza, pret_per_kg, timp_livrare, activ, created_at, updated_at) VALUES
('Standard', 'Livrare standard in 2-3 zile lucratoare', 15.00, 2.00, '2-3 zile', true, NOW(), NOW()),
('Express', 'Livrare rapida in 24 ore', 25.00, 3.00, '24 ore', true, NOW(), NOW()),
('Same Day', 'Livrare in aceeasi zi (comanda pana la ora 12:00)', 45.00, 5.00, 'Aceeasi zi', true, NOW(), NOW()),
('Economy', 'Livrare economica in 5-7 zile lucratoare', 10.00, 1.50, '5-7 zile', true, NOW(), NOW()),
('Weekend', 'Livrare sambata si duminica', 35.00, 4.00, 'Weekend', true, NOW(), NOW()),
('Overnight', 'Livrare peste noapte (dimineata urmatoare)', 40.00, 4.50, '8-12 ore', true, NOW(), NOW());
