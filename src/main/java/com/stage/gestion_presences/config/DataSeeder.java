package com.stage.gestion_presences.config;

import com.stage.gestion_presences.entity.Utilisateur;
import com.stage.gestion_presences.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!utilisateurRepository.existsByEmail("admin@DBM.ma")) {
            Utilisateur admin = new Utilisateur();
            admin.setEmail("admin@DBM.ma");
            admin.setMotDePasse(passwordEncoder.encode("admin123"));
            admin.setRole(Utilisateur.Role.ADMIN);
            utilisateurRepository.save(admin);
        }
    }
}