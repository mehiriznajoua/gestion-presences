package com.stage.gestion_presences.service;

import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.repository.PresenceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PresenceService {

    private final PresenceRepository presenceRepository;

    public PresenceService(PresenceRepository presenceRepository) {
        this.presenceRepository = presenceRepository;
    }

    public List<Presence> getAllPresences() {
        return presenceRepository.findAll();
    }

    public Presence getPresenceById(Long id) {
        return presenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Présence non trouvée avec id : " + id));
    }

    public List<Presence> getPresencesByEmploye(Long employeId) {
        return presenceRepository.findByEmployeId(employeId);
    }

    public List<Presence> getPresencesByDate(LocalDate date) {
        return presenceRepository.findByDate(date);
    }

    public List<Presence> getPresencesByStatut(Presence.Statut statut) {
        return presenceRepository.findByStatut(statut);
    }

    public Presence createPresence(Presence presence) {
        boolean dejaEnregistre = !presenceRepository
                .findByEmployeIdAndDate(presence.getEmploye().getId(), presence.getDate())
                .isEmpty();

        if (dejaEnregistre) {
            throw new IllegalStateException("Une présence existe déjà pour cet employé à cette date");
        }

        return presenceRepository.save(presence);
    }

    public Presence updatePresence(Long id, Presence nouvellePresence) {
        Presence presence = getPresenceById(id);
        presence.setDate(nouvellePresence.getDate());
        presence.setHeureArrivee(nouvellePresence.getHeureArrivee());
        presence.setHeureDepart(nouvellePresence.getHeureDepart());
        presence.setStatut(nouvellePresence.getStatut());
        presence.setEmploye(nouvellePresence.getEmploye());
        return presenceRepository.save(presence);
    }

    public void deletePresence(Long id) {
        presenceRepository.deleteById(id);
    }
}