package com.stage.gestion_presences.config;

import com.stage.gestion_presences.entity.Utilisateur;
import com.stage.gestion_presences.repository.UtilisateurRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String ADMIN_EMAIL = "admin@dbm.ma";

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final String motDePasseInitial;

    public DataSeeder(UtilisateurRepository utilisateurRepository,
                      PasswordEncoder passwordEncoder,
                      // Vide par défaut : jamais de mot de passe écrit dans le code
                      @Value("${admin.initial-password:}") String motDePasseInitial) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.motDePasseInitial = motDePasseInitial;
    }

    @Override
    public void run(String... args) {
        if (utilisateurRepository.existsByEmail(ADMIN_EMAIL)) {
            return; // le compte existe déjà
        }

        boolean genere = motDePasseInitial == null || motDePasseInitial.isBlank();
        String motDePasse = genere ? genererMotDePasse() : motDePasseInitial;

        Utilisateur admin = new Utilisateur();
        admin.setEmail(ADMIN_EMAIL);
        admin.setMotDePasse(passwordEncoder.encode(motDePasse)); // jamais en clair en base
        admin.setRole(Utilisateur.Role.ADMIN);
        admin.setMustChangePassword(true); // mot de passe temporaire : à changer dès la première connexion
        utilisateurRepository.save(admin);

        if (genere) {
            log.warn("Compte administrateur créé : {} | mot de passe temporaire : {} "
                    + "(affiché une seule fois, à changer à la première connexion)", ADMIN_EMAIL, motDePasse);
        } else {
            log.info("Compte administrateur créé : {} (mot de passe fourni par admin.initial-password)", ADMIN_EMAIL);
        }
    }

    // Mot de passe aléatoire de 16 caractères, avec au moins une lettre et un chiffre (règle de l'application)
    private static String genererMotDePasse() {
        String caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        SecureRandom random = new SecureRandom();
        String motDePasse;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 16; i++) {
                sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
            }
            motDePasse = sb.toString();
        } while (!motDePasse.matches(".*[A-Za-z].*") || !motDePasse.matches(".*\\d.*"));
        return motDePasse;
    }
}