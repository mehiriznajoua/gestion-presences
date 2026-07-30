package com.stage.gestion_presences.controller;

import com.stage.gestion_presences.config.JwtUtil;
import com.stage.gestion_presences.dto.LoginRequest;
import com.stage.gestion_presences.dto.RegisterRequest;
import com.stage.gestion_presences.entity.Utilisateur;
import com.stage.gestion_presences.repository.UtilisateurRepository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UtilisateurRepository utilisateurRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Cet email est déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse())); // jamais en clair !
        utilisateur.setRole(Utilisateur.Role.EMPLOYE); // rôle par défaut

        utilisateurRepository.save(utilisateur);
        return "Utilisateur créé avec succès";
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String token = jwtUtil.generateToken(request.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", utilisateur.getRole().name());
        return response;
    }
}