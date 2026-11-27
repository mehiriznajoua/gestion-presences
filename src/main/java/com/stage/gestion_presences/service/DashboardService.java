package com.stage.gestion_presences.service;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.PresenceRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    // Même fuseau que PresenceService : le "jour" est celui du Maroc, pas celui du serveur
    private static final ZoneId FUSEAU = ZoneId.of("Africa/Casablanca");

    private final PresenceRepository presenceRepository;
    private final EmployeRepository employeRepository;

    public DashboardService(PresenceRepository presenceRepository, EmployeRepository employeRepository) {
        this.presenceRepository = presenceRepository;
        this.employeRepository = employeRepository;
    }

    public Map<String, Object> getStatsToday() {
        LocalDate today = LocalDate.now(FUSEAU);
        boolean jourOuvre = today.getDayOfWeek() != DayOfWeek.SATURDAY
                && today.getDayOfWeek() != DayOfWeek.SUNDAY;

        long presents = presenceRepository.countByDateAndStatut(today, Presence.Statut.PRESENT);
        long retards = presenceRepository.countByDateAndStatut(today, Presence.Statut.RETARD);

        // Absents calculés en direct : les employés attendus aujourd'hui moins ceux déjà arrivés.
        // Le week-end, personne n'est attendu.
        long attendus = employeRepository.countActifsSousContrat(today);
        long absents = jourOuvre ? Math.max(0, attendus - (presents + retards)) : 0;

        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("date", today);
        stats.put("jourOuvre", jourOuvre);
        stats.put("presents", presents);
        stats.put("absents", absents);
        stats.put("retards", retards);
        stats.put("totalEnregistrements", presenceRepository.countByDate(today));

        // Totaux : seulement les employés actifs, donc stagiaires + permanents = actifs
        stats.put("totalEmployesActifs", employeRepository.countByActifTrue());
        stats.put("totalStagiaires", employeRepository.countByTypeAndActifTrue(Employe.TypeEmploye.STAGIAIRE));
        stats.put("totalEmployesPermanents", employeRepository.countByTypeAndActifTrue(Employe.TypeEmploye.EMPLOYE));

        return stats;
    }
}