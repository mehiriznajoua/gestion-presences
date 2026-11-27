package com.stage.gestion_presences.repository;

import com.stage.gestion_presences.entity.Presence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface PresenceRepository extends JpaRepository<Presence, Long> {

    List<Presence> findByEmployeId(Long employeId);

    // Historique d'un employé, du plus récent au plus ancien
    List<Presence> findByEmployeIdOrderByDateDesc(Long employeId);

    List<Presence> findByDate(LocalDate date);

    List<Presence> findByStatut(Presence.Statut statut);

    List<Presence> findByEmployeIdAndDate(Long employeId, LocalDate date);

    long countByStatut(Presence.Statut statut);
    long countByDateAndStatut(LocalDate date, Presence.Statut statut);
    long countByDate(LocalDate date);

    // Employés arrivés ce jour-là (PRESENT ou RETARD) : sert au calcul des absents en direct
    long countByDateAndStatutIn(LocalDate date, Collection<Presence.Statut> statuts);

    boolean existsByEmployeId(Long employeId);
}