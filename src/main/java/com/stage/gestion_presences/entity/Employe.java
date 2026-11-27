package com.stage.gestion_presences.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "employes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email n'est pas valide")
    @Column(nullable = false, unique = true)
    private String email;

    private String telephone;

    private String poste;
    private String departement;

    @NotNull(message = "Le type est obligatoire")
    @Enumerated(EnumType.STRING)
    private TypeEmploye type;

    @NotNull(message = "La date d'embauche est obligatoire")
    private LocalDate dateEmbauche;

    private LocalDate dateFinContrat;

    private Boolean actif = true; // actif par défaut

    // Nettoyage avant chaque enregistrement : l'email est toujours stocké en minuscules,
    // ce qui garantit le lien avec le compte de connexion
    @PrePersist
    @PreUpdate
    private void normaliser() {
        if (nom != null) nom = nom.trim();
        if (prenom != null) prenom = prenom.trim();
        if (email != null) email = email.trim().toLowerCase();
    }

    public enum TypeEmploye {
        EMPLOYE,
        STAGIAIRE
    }
}