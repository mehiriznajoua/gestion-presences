package com.stage.gestion_presences.controller;

import com.stage.gestion_presences.config.JwtUtil;
import com.stage.gestion_presences.dto.ChangePasswordRequest;
import com.stage.gestion_presences.dto.LoginRequest;
import com.stage.gestion_presences.dto.RegisterRequest;
import com.stage.gestion_presences.dto.ResetPasswordRequest;
import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Utilisateur;
import com.stage.gestion_presences.repository.UtilisateurRepository;
import com.stage.gestion_presences.service.EmployeService;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmployeService employeService;

    public AuthController(UtilisateurRepository utilisateurRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          EmployeService employeService) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.employeService = employeService;
    }

    //Création d'un compte : ADMIN et RH

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public String register(@RequestBody RegisterRequest request, Authentication auth) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        if (email.isEmpty()) {
            throw new IllegalArgumentException("L'email est obligatoire");
        }
        validerMotDePasse(request.getMotDePasse());

        // Le rôle vient du client, mais il est contrôlé par rapport au rôle de l'appelant
        Utilisateur.Role roleDemande = parseRole(request.getRole());
        if (roleDemande != Utilisateur.Role.EMPLOYE && roleAppelant(auth) != Utilisateur.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul un administrateur peut créer ce type de compte");
        }

        // Le compte doit correspondre à une fiche employé existante
        employeService.findByEmail(email).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Aucune fiche employé ne correspond à cet email"));

        if (utilisateurRepository.existsByEmail(email)) {
            throw new IllegalStateException("Un compte existe déjà pour cet employé");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(email);
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse())); // jamais en clair !
        utilisateur.setRole(roleDemande);
        utilisateur.setMustChangePassword(true); // mot de passe temporaire

        utilisateurRepository.save(utilisateur);
        log.info("Compte {} ({}) créé par {}", email, roleDemande, auth.getName());
        return "Utilisateur créé avec succès";
    }

    //Connexion : public

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Un employé désactivé ne peut plus se connecter (les comptes sans fiche, comme l'admin, restent autorisés)
        employeService.findByEmail(utilisateur.getEmail()).ifPresent(e -> {
            if (!Boolean.TRUE.equals(e.getActif())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Ce compte est désactivé : contactez l'administration");
            }
        });

        // Le sujet du token est l'email enregistré en base, pas celui tapé (majuscules...)
        String token = jwtUtil.generateToken(utilisateur.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", utilisateur.getRole().name());
        response.put("mustChangePassword", utilisateur.isMustChangePassword());
        return response;
    }

    //Changement de son propre mot de passe : tout utilisateur connecté

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public String changePassword(@RequestBody ChangePasswordRequest request, Authentication auth) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte introuvable"));

        // Erreur 400 (et non 401) : l'utilisateur est bien connecté, c'est la saisie qui est fausse
        if (request.getAncienMotDePasse() == null
                || !passwordEncoder.matches(request.getAncienMotDePasse(), utilisateur.getMotDePasse())) {
            throw new IllegalArgumentException("Mot de passe actuel incorrect");
        }
        validerMotDePasse(request.getNouveauMotDePasse());
        if (passwordEncoder.matches(request.getNouveauMotDePasse(), utilisateur.getMotDePasse())) {
            throw new IllegalArgumentException("Le nouveau mot de passe doit être différent de l'ancien");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(request.getNouveauMotDePasse()));
        utilisateur.setMustChangePassword(false);
        utilisateurRepository.save(utilisateur);
        return "Mot de passe modifié avec succès";
    }

    //Réinitialisation par l'administration : ADMIN et RH

    @PostMapping("/reset-password/{employeId}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public String resetPassword(@PathVariable Long employeId,
                                @RequestBody ResetPasswordRequest request,
                                Authentication auth) {
        Employe employe = employeService.getEmployeById(employeId);
        Utilisateur cible = utilisateurRepository.findByEmail(employe.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Aucun compte utilisateur lié à cet employé"));

        // Un RH ne peut réinitialiser que des comptes employés
        if (cible.getRole() != Utilisateur.Role.EMPLOYE && roleAppelant(auth) != Utilisateur.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul un administrateur peut réinitialiser ce compte");
        }

        validerMotDePasse(request.getNouveauMotDePasse());
        cible.setMotDePasse(passwordEncoder.encode(request.getNouveauMotDePasse()));
        cible.setMustChangePassword(true);
        utilisateurRepository.save(cible);

        log.info("Mot de passe de {} réinitialisé par {}", cible.getEmail(), auth.getName());
        return "Mot de passe réinitialisé";
    }

    //Méthodes utilitaires

    // Même règle que le front (src/utils/password.js) : le serveur ne fait jamais confiance au client
    private static void validerMotDePasse(String motDePasse) {
        if (motDePasse == null || motDePasse.length() < 8) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caractères");
        }
        if (!motDePasse.matches(".*[A-Za-z].*") || !motDePasse.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins une lettre et un chiffre");
        }
    }

    private static Utilisateur.Role parseRole(String role) {
        if (role == null || role.isBlank()) {
            return Utilisateur.Role.EMPLOYE;
        }
        try {
            return Utilisateur.Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rôle invalide");
        }
    }

    // Rôle de la personne qui fait la requête, lu en base (pas fourni par le client)
    private Utilisateur.Role roleAppelant(Authentication auth) {
        return utilisateurRepository.findByEmail(auth.getName())
                .map(Utilisateur::getRole)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Compte appelant introuvable"));
    }
}