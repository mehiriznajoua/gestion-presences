package com.stage.gestion_presences.service;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.PresenceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final PresenceRepository presenceRepository;
    private final EmployeRepository employeRepository;

    public DashboardService(PresenceRepository presenceRepository, EmployeRepository employeRepository) {
        this.presenceRepository = presenceRepository;
        this.employeRepository = employeRepository;
    }

    public Map<String, Object> getStatsToday() {
        LocalDate today = LocalDate.now();

        Map<String, Object> stats = new HashMap<>();

        stats.put("date", today);
        stats.put("presents", presenceRepository.countByDateAndStatut(today, Presence.Statut.PRESENT));
        stats.put("absents", presenceRepository.countByDateAndStatut(today, Presence.Statut.ABSENT));
        stats.put("retards", presenceRepository.countByDateAndStatut(today, Presence.Statut.RETARD));
        stats.put("totalEnregistrements", presenceRepository.countByDate(today));

        stats.put("totalEmployesActifs", employeRepository.countByActifTrue());
        stats.put("totalStagiaires", employeRepository.countByType(Employe.TypeEmploye.STAGIAIRE));
        stats.put("totalEmployesPermanents", employeRepository.countByType(Employe.TypeEmploye.EMPLOYE));

        return stats;
    }
}