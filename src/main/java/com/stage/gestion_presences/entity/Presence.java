package com.stage.gestion_presences.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
    name = "presences",
    // Une seule présence par employé et par jour, garantie par la base elle-même
    uniqueConstraints = @UniqueConstraint(
        name = "uk_presence_employe_date",
        columnNames = {"employe_id", "date"}
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Presence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date est obligatoire")
    private LocalDate date;

    private LocalTime heureArrivee;
    private LocalTime heureDepart;

    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    private Statut statut;

    // Dans le JSON, on n'expose que l'id, le nom, le prénom et le type de l'employé
    @NotNull(message = "L'employé est obligatoire")
    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    @JsonIgnoreProperties({"email", "telephone", "poste", "departement",
                           "dateEmbauche", "dateFinContrat", "actif"})
    private Employe employe;

    public enum Statut {
        PRESENT,
        ABSENT,
        RETARD
    }
}