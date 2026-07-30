package com.stage.gestion_presences.config;

import com.stage.gestion_presences.entity.Employe;
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

        boolean actif = employeRepository.findByEmail(email)
                .map(Employe::getActif)
                .orElse(true);

        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotDePasse())
                .authorities(new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name()))
                .disabled(!actif)
                .build();
    }
}