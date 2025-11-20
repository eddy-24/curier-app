package com.curier_app.curier_app.service;

import com.curier_app.curier_app.model.Utilizator;
import com.curier_app.curier_app.repository.UtilizatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UtilizatorService {

    @Autowired
    private UtilizatorRepository utilizatorRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Verifică dacă un username există deja
    public boolean usernameExists(String username) {
        return utilizatorRepository.findByUsername(username).isPresent();
    }

    // Creează un nou utilizator cu parola criptată
    public Utilizator createUtilizator(Utilizator utilizator) {
        // Criptăm parola
        utilizator.setParola(passwordEncoder.encode(utilizator.getParola()));

        // Salvăm utilizatorul în DB
        return utilizatorRepository.save(utilizator);
    }

    // Găsim utilizator după username
    public Optional<Utilizator> findByUsername(String username) {
        return utilizatorRepository.findByUsername(username);
    }

    // Validăm parola
    public boolean validatePassword(Utilizator utilizator, String rawPassword) {
        return passwordEncoder.matches(rawPassword, utilizator.getParola());
    }
}
