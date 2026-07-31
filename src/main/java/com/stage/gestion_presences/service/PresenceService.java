package com.stage.gestion_presences.service;

import com.stage.gestion_presences.config.EntrepriseConfig;
import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.PresenceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class PresenceService {

    private final PresenceRepository presenceRepository;
    private final EmployeRepository employeRepository;
    private final EntrepriseConfig entrepriseConfig;

    public PresenceService(PresenceRepository presenceRepository, EmployeRepository employeRepository, EntrepriseConfig entrepriseConfig) {
        this.presenceRepository = presenceRepository;
        this.employeRepository = employeRepository;
        this.entrepriseConfig = entrepriseConfig;
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

    public Presence pointerArrivee(String emailUtilisateur) {
        Employe employe = employeRepository.findByEmail(emailUtilisateur)
                .orElseThrow(() -> new RuntimeException("Aucun employé associé à ce compte"));

        LocalDate today = LocalDate.now();

        boolean dejaPointe = !presenceRepository.findByEmployeIdAndDate(employe.getId(), today).isEmpty();
        if (dejaPointe) {
            throw new IllegalStateException("Vous avez déjà pointé votre arrivée aujourd'hui");
        }

        LocalTime maintenant = LocalTime.now();
        LocalTime heureLimite = entrepriseConfig.getHeureDebut().plusMinutes(entrepriseConfig.getToleranceMinutes());

        Presence.Statut statut = maintenant.isAfter(heureLimite) ? Presence.Statut.RETARD : Presence.Statut.PRESENT;

        Presence presence = new Presence();
        presence.setEmploye(employe);
        presence.setDate(today);
        presence.setHeureArrivee(maintenant);
        presence.setStatut(statut);

        return presenceRepository.save(presence);
    }

    public Presence pointerDepart(String emailUtilisateur) {
        Employe employe = employeRepository.findByEmail(emailUtilisateur)
                .orElseThrow(() -> new RuntimeException("Aucun employé associé à ce compte"));

        LocalDate today = LocalDate.now();

        Presence presence = presenceRepository.findByEmployeIdAndDate(employe.getId(), today)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Aucune arrivée enregistrée aujourd'hui"));

        presence.setHeureDepart(LocalTime.now());
        return presenceRepository.save(presence);
    }
}