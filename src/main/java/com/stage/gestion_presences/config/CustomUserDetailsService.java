package com.stage.gestion_presences.config;

import com.stage.gestion_presences.entity.Utilisateur;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.UtilisateurRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    private final EmployeRepository employeRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository, EmployeRepository employeRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.employeRepository = employeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + email));

        // Un employé dont la fiche n'est pas explicitement active ne peut pas se connecter
        // (même règle que PresenceService). Un compte sans fiche, comme l'admin, reste autorisé.
        boolean actif = employeRepository.findByEmail(utilisateur.getEmail())
                .map(employe -> Boolean.TRUE.equals(employe.getActif()))
                .orElse(true);

        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotDePasse())
                .authorities(new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name()))
                .disabled(!actif)
                .build();
    }
}