package com.curier_app.curier_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Criptarea parolei cu BCryptPasswordEncoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Dezactivăm CSRF pentru API-uri REST
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/utilizatori/register", "/api/utilizatori/login").permitAll()  // Permitem accesul la register și login
                .anyRequest().permitAll() // Permitem accesul la toate endpoint-urile (pentru development)
            );
        
        return http.build();
    }
}
