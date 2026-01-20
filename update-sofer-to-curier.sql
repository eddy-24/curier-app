-- Actualizare utilizatori de la rol sofer la curier
UPDATE utilizator SET rol = 'curier' WHERE rol = 'sofer';

-- Verificare
SELECT username, nume, prenume, rol FROM utilizator WHERE rol = 'curier' ORDER BY username;
