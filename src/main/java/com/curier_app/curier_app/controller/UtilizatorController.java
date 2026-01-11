package com.curier_app.curier_app.controller;

import com.curier_app.curier_app.model.Utilizator;
import com.curier_app.curier_app.service.UtilizatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilizatori")
public class UtilizatorController {

    @Autowired
    private UtilizatorService utilizatorService;

    // Endpoint pentru a înregistra un utilizator
    @PostMapping("/register")
    public ResponseEntity<String> registerUtilizator(@RequestBody Utilizator utilizator) {
        // Verificăm dacă există deja un utilizator cu același username
        if (utilizatorService.usernameExists(utilizator.getUsername())) {
            return new ResponseEntity<>("Username deja folosit!", HttpStatus.BAD_REQUEST);
        }

        // Salvăm utilizatorul
        utilizatorService.createUtilizator(utilizator);
        return new ResponseEntity<>("Utilizator înregistrat cu succes!", HttpStatus.CREATED);
    }

    // Endpoint pentru login (verifică username-ul și parola)
    @PostMapping("/login")
    public ResponseEntity<?> loginUtilizator(@RequestBody Utilizator utilizator) {
        Optional<Utilizator> optUtilizator = utilizatorService.findByUsername(utilizator.getUsername());

        if (optUtilizator.isEmpty()) {
            return new ResponseEntity<>("Utilizator neexistent!", HttpStatus.NOT_FOUND);
        }

        Utilizator existingUser = optUtilizator.get();

        // Verificăm parola
        if (!utilizatorService.validatePassword(existingUser, utilizator.getParola())) {
            return new ResponseEntity<>("Parolă incorectă!", HttpStatus.UNAUTHORIZED);
        }

        // Returnăm datele utilizatorului (fără parolă)
        Map<String, Object> response = new HashMap<>();
        response.put("id", existingUser.getIdUtilizator());
        response.put("username", existingUser.getUsername());
        response.put("rol", existingUser.getRol());
        response.put("nume", existingUser.getNume());
        response.put("prenume", existingUser.getPrenume());
        response.put("email", existingUser.getEmail());
        response.put("telefon", existingUser.getTelefon());
        response.put("message", "Login cu succes!");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
