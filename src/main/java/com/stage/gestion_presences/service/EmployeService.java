package com.stage.gestion_presences.service;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.entity.Utilisateur;
import com.stage.gestion_presences.repository.EmployeRepository;
import com.stage.gestion_presences.repository.PresenceRepository;
import com.stage.gestion_presences.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeService {

    private final EmployeRepository employeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PresenceRepository presenceRepository;

    public EmployeService(EmployeRepository employeRepository,
                          UtilisateurRepository utilisateurRepository,
                          PresenceRepository presenceRepository) {
        this.employeRepository = employeRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.presenceRepository = presenceRepository;
    }

    public List<Employe> getAllEmployes() {
        return employeRepository.findAll();
    }

    public Employe getEmployeById(Long id) {
        return employeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employé non trouvé avec id : " + id));
    }

    public List<Employe> getEmployesByType(Employe.TypeEmploye type) {
        return employeRepository.findByType(type);
    }

    public List<Employe> getEmployesActifs() {
        return employeRepository.findByActifTrue();
    }

    public Employe createEmploye(Employe employe) {
        employe.setId(null); // l'identifiant est toujours généré par la base, jamais fourni par le client

        String email = employe.getEmail() == null ? "" : employe.getEmail().trim();
        if (employeRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalStateException("Un employé avec cet email existe déjà");
        }
        if (employe.getActif() == null) {
            employe.setActif(true);
        }
        return employeRepository.save(employe);
    }

    @Transactional
    public Employe updateEmploye(Long id, Employe nouvelEmploye) {
        Employe employe = getEmployeById(id);
        verifierDroitsSur(employe.getEmail());

        if (nouvelEmploye.getEmail() == null) {
            throw new IllegalArgumentException("L'email est obligatoire");
        }
        String ancienEmail = employe.getEmail();
        String nouvelEmail = nouvelEmploye.getEmail().trim().toLowerCase();

        if (!nouvelEmail.equalsIgnoreCase(ancienEmail)) {
            if (employeRepository.existsByEmailIgnoreCaseAndIdNot(nouvelEmail, id)) {
                throw new IllegalStateException("Un employé avec cet email existe déjà");
            }
            // Le compte de connexion suit l'email de la fiche, sinon l'employé perd son profil
            utilisateurRepository.findByEmail(ancienEmail).ifPresent(compte -> {
                compte.setEmail(nouvelEmail);
                utilisateurRepository.save(compte);
            });
        }

        employe.setNom(nouvelEmploye.getNom());
        employe.setPrenom(nouvelEmploye.getPrenom());
        employe.setEmail(nouvelEmail);
        employe.setTelephone(nouvelEmploye.getTelephone());
        employe.setPoste(nouvelEmploye.getPoste());
        employe.setDepartement(nouvelEmploye.getDepartement());
        employe.setType(nouvelEmploye.getType());
        employe.setDateEmbauche(nouvelEmploye.getDateEmbauche());
        employe.setDateFinContrat(nouvelEmploye.getDateFinContrat());
        if (nouvelEmploye.getActif() != null) {
            employe.setActif(nouvelEmploye.getActif());
        }
        return employeRepository.save(employe);
    }

    @Transactional
    public void deleteEmploye(Long id) {
        Employe employe = getEmployeById(id);
        verifierDroitsSur(employe.getEmail());

        if (employe.getEmail().equalsIgnoreCase(emailAppelant())) {
            throw new IllegalStateException("Vous ne pouvez pas supprimer votre propre fiche");
        }
        if (presenceRepository.existsByEmployeId(id)) {
            throw new IllegalStateException("Impossible de supprimer cet employé : il a un historique de "
                    + "présences. Désactivez-le plutôt (décochez « Actif »).");
        }

        // Le compte de connexion disparaît avec la fiche
        utilisateurRepository.findByEmail(employe.getEmail()).ifPresent(utilisateurRepository::delete);
        employeRepository.delete(employe);
    }

    public Optional<Employe> findByEmail(String email) {
        return employeRepository.findByEmail(email);
    }

    // ---------- Méthodes utilitaires ----------

    // Un RH ne peut pas modifier ni supprimer la fiche d'un employé qui a un compte RH ou ADMIN
    // (même règle que pour la réinitialisation de mot de passe)
    private void verifierDroitsSur(String emailCible) {
        Utilisateur compte = utilisateurRepository.findByEmail(emailCible).orElse(null);
        if (compte == null || compte.getRole() == Utilisateur.Role.EMPLOYE) {
            return;
        }
        String emailAppelant = emailAppelant();
        Utilisateur appelant = emailAppelant == null
                ? null
                : utilisateurRepository.findByEmail(emailAppelant).orElse(null);
        if (appelant == null || appelant.getRole() != Utilisateur.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul un administrateur peut modifier la fiche d'un compte RH ou administrateur");
        }
    }

    private String emailAppelant() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth == null ? null : auth.getName();
    }
}