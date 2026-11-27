package com.stage.gestion_presences.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "utilisateurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    // Jamais affiché dans les logs (toString) ni renvoyé dans le JSON
    @ToString.Exclude
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // true quand le mot de passe est temporaire (compte créé ou réinitialisé par l'administration)
    @Column(nullable = false)
    private boolean mustChangePassword = false;

    // L'email est toujours stocké en minuscules, comme celui de la fiche employé :
    // c'est ce qui permet de relier le compte à sa fiche
    @PrePersist
    @PreUpdate
    private void normaliser() {
        if (email != null) email = email.trim().toLowerCase();
    }

    public enum Role {
        ADMIN,
        RH,
        EMPLOYE
    }
}