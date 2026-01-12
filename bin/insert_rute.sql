-- Inserare rute pentru curieri cu caractere românești corecte
-- Curier1 (id=2) - rute din București
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'București', 'Constanța', 'București', 'Constanța', 1, 2);

INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'București', 'Brașov', 'București', 'Brașov', 2, 2);

-- Curier2 (id=3) - rute din Cluj-Napoca
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'Cluj-Napoca', 'Timișoara', 'Cluj', 'Timiș', 1, 3);

INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'Cluj-Napoca', 'Iași', 'Cluj', 'Iași', 2, 3);

-- Curier3 (id=4) - rute din Timișoara
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'Timișoara', 'București', 'Timiș', 'București', 1, 4);

INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'Timișoara', 'Brașov', 'Timiș', 'Brașov', 2, 4);

-- Adăugăm și rute către Cluj-Napoca pentru test
INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'București', 'Cluj-Napoca', 'București', 'Cluj', 1, 2);

INSERT INTO ruta_curier (activa, oras_origine, oras_destinatie, judet_origine, judet_destinatie, prioritate, id_curier)
VALUES (true, 'Timișoara', 'Cluj-Napoca', 'Timiș', 'Cluj', 1, 4);
