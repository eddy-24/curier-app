-- Update parole cu hash BCrypt
-- client123 = $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- curier123 = $2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm  
-- operator123 = $2a$10$9nrZmJ1ViU8oXcOzV3pS/OTxvqJKElz2oqXkHr1wdSmHnpQiUmgky
-- admin123 = $2a$10$3gI6nP1GYSaKyN1Xb8vCNu5FZqJrC8kHzqKyE1oS2dY7VxJ9mKlP.

UPDATE utilizator SET parola = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE rol = 'client';
UPDATE utilizator SET parola = '$2a$10$7E2lK2zVYoqArqR3aO8WkOu9QSYGgUbxBKnVqzxwCzGWiEZYkr.Wm' WHERE rol = 'curier';
UPDATE utilizator SET parola = '$2a$10$9nrZmJ1ViU8oXcOzV3pS/OTxvqJKElz2oqXkHr1wdSmHnpQiUmgky' WHERE rol = 'operator';
UPDATE utilizator SET parola = '$2a$10$3gI6nP1GYSaKyN1Xb8vCNu5FZqJrC8kHzqKyE1oS2dY7VxJ9mKlP.' WHERE rol = 'admin';

SELECT username, rol, LENGTH(parola) as len, LEFT(parola, 10) as hash_start FROM utilizator ORDER BY id_utilizator;
