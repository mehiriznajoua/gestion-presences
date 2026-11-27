package com.stage.gestion_presences.service;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.PresenceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class AbsenceSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(AbsenceSchedulerService.class);

    // Même fuseau que PresenceService et DashboardService
    private static final ZoneId FUSEAU = ZoneId.of("Africa/Casablanca");

    private final EmployeRepository employeRepository;
    private final PresenceRepository presenceRepository;

    public AbsenceSchedulerService(EmployeRepository employeRepository, PresenceRepository presenceRepository) {
        this.employeRepository = employeRepository;
        this.presenceRepository = presenceRepository;
    }

    // Tous les jours à 18h00, heure du Maroc
    @Scheduled(cron = "0 0 18 * * *", zone = "Africa/Casablanca")
    public void marquerAbsences() {
        LocalDate today = LocalDate.now(FUSEAU);

        // Personne n'est attendu le week-end
        if (today.getDayOfWeek() == DayOfWeek.SATURDAY || today.getDayOfWeek() == DayOfWeek.SUNDAY) {
            log.info("Week-end ({}) : aucune absence à marquer", today);
            return;
        }

        // Employés actifs, contrat en cours, sans aucune présence enregistrée aujourd'hui
        List<Employe> absents = employeRepository.findActifsSansPresence(today);

        int marques = 0;
        for (Employe employe : absents) {
            try {
                Presence presence = new Presence();
                presence.setEmploye(employe);
                presence.setDate(today);
                presence.setStatut(Presence.Statut.ABSENT);
                presenceRepository.save(presence);
                marques++;
            } catch (DataIntegrityViolationException e) {
                // L'employé vient de pointer à l'instant : sa présence existe déjà, on continue
                log.warn("Présence déjà enregistrée pour {} le {}", employe.getEmail(), today);
            }
        }

        log.info("{} absence(s) marquée(s) pour le {}", marques, today);
    }
}