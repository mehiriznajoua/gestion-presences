package com.stage.gestion_presences.entity;

import jakarta.persistence.*;
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

    private String nom;
    private String prenom;
    private String email;
    private String telephone;

    private String poste;
    private String departement;

    @Enumerated(EnumType.STRING)
    private TypeEmploye type;

    private LocalDate dateEmbauche;
    private LocalDate dateFinContrat;

    private Boolean actif;

    public enum TypeEmploye {
        EMPLOYE,
        STAGIAIRE
    }
}