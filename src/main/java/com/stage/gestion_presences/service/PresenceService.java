package com.stage.gestion_presences.service;

import com.stage.gestion_presences.config.EntrepriseConfig;
import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.PresenceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PresenceService {

    // Les heures de pointage sont celles du Maroc, quel que soit le fuseau du serveur
    private static final ZoneId FUSEAU = ZoneId.of("Africa/Casablanca");

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
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Présence non trouvée avec id : " + id));
    }

    public List<Presence> getPresencesByEmploye(Long employeId) {
        return presenceRepository.findByEmployeId(employeId);
    }

    // Présences de l'utilisateur connecté (utilisé par GET /api/presences/me)
    public List<Presence> getPresencesByEmail(String email) {
        Employe employe = trouverEmploye(email);
        return presenceRepository.findByEmployeId(employe.getId());
    }

    public List<Presence> getPresencesByDate(LocalDate date) {
        return presenceRepository.findByDate(date);
    }

    public List<Presence> getPresencesByStatut(Presence.Statut statut) {
        return presenceRepository.findByStatut(statut);
    }

    public Presence createPresence(Presence presence) {
        if (presence.getEmploye() == null || presence.getEmploye().getId() == null || presence.getDate() == null) {
            throw new IllegalArgumentException("L'employé et la date sont obligatoires");
        }

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
        Employe employe = trouverEmploye(emailUtilisateur);

        LocalDate today = LocalDate.now(FUSEAU);

        List<Presence> dejaLa = presenceRepository.findByEmployeIdAndDate(employe.getId(), today);
        if (!dejaLa.isEmpty()) {
            boolean aDejaPointe = dejaLa.get(0).getHeureArrivee() != null;
            throw new IllegalStateException(aDejaPointe
                    ? "Vous avez déjà pointé votre arrivée aujourd'hui"
                    : "Vous êtes déjà enregistré(e) comme absent(e) aujourd'hui : contactez l'administration");
        }

        LocalTime maintenant = LocalTime.now(FUSEAU).truncatedTo(ChronoUnit.SECONDS);
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
        Employe employe = trouverEmploye(emailUtilisateur);

        LocalDate today = LocalDate.now(FUSEAU);

        // Il faut une vraie arrivée (une ligne d'absence n'a pas d'heure d'arrivée)
        Presence presence = presenceRepository.findByEmployeIdAndDate(employe.getId(), today)
                .stream().findFirst()
                .filter(p -> p.getHeureArrivee() != null)
                .orElseThrow(() -> new IllegalStateException("Aucune arrivée enregistrée aujourd'hui"));

        if (presence.getHeureDepart() != null) {
            throw new IllegalStateException("Vous avez déjà pointé votre départ aujourd'hui");
        }

        LocalTime maintenant = LocalTime.now(FUSEAU).truncatedTo(ChronoUnit.SECONDS);
        if (maintenant.isBefore(presence.getHeureArrivee())) {
            throw new IllegalStateException("L'heure de départ ne peut pas précéder l'heure d'arrivée");
        }

        presence.setHeureDepart(maintenant);
        return presenceRepository.save(presence);
    }

    // Retrouve la fiche employé liée au compte (par email), ou répond 404 avec un message clair
    private Employe trouverEmploye(String email) {
        return employeRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Aucune fiche employé liée à ce compte"));
    }
}