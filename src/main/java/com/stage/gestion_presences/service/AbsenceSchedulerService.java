package com.stage.gestion_presences.service;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.PresenceRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AbsenceSchedulerService {

    private final EmployeRepository employeRepository;
    private final PresenceRepository presenceRepository;

    public AbsenceSchedulerService(EmployeRepository employeRepository, PresenceRepository presenceRepository) {
        this.employeRepository = employeRepository;
        this.presenceRepository = presenceRepository;
    }

    @Scheduled(cron = "0 0 18 * * *")
    public void marquerAbsences() {
        LocalDate today = LocalDate.now();
        List<Employe> employesActifs = employeRepository.findByActifTrue();

        for (Employe employe : employesActifs) {
            boolean aPointe = !presenceRepository.findByEmployeIdAndDate(employe.getId(), today).isEmpty();

            if (!aPointe) {
                Presence presence = new Presence();
                presence.setEmploye(employe);
                presence.setDate(today);
                presence.setStatut(Presence.Statut.ABSENT);
                presenceRepository.save(presence);
            }
        }
    }
}
