package com.stage.gestion_presences.controller;

import com.stage.gestion_presences.config.EntrepriseConfig;
import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.service.PresenceService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/presences")
public class PresenceController {

    private final PresenceService presenceService;
    private final EntrepriseConfig entrepriseConfig;
    private final boolean autoriserLocalhost;

    public PresenceController(PresenceService presenceService,
                              EntrepriseConfig entrepriseConfig,
                              @Value("${entreprise.autoriser-localhost:false}") boolean autoriserLocalhost) {
        this.presenceService = presenceService;
        this.entrepriseConfig = entrepriseConfig;
        this.autoriserLocalhost = autoriserLocalhost;
    }

    //Lecture de l'historique : ADMIN et RH

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public List<Presence> getAll() {
        return presenceService.getAllPresences();
    }

    // Présences de l'utilisateur connecté : pas d'id dans l'URL,
    // l'identité vient du token JWT (impossible de lire celles d'un autre)
    @GetMapping("/me")
    public List<Presence> mesPresences(Authentication authentication) {
        return presenceService.getPresencesByEmail(authentication.getName());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public Presence getById(@PathVariable Long id) {
        return presenceService.getPresenceById(id);
    }

    @GetMapping("/employe/{employeId}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public List<Presence> getByEmploye(@PathVariable Long employeId) {
        return presenceService.getPresencesByEmploye(employeId);
    }

    // Spring convertit et valide la date : une date invalide donne un 400 automatiquement
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public List<Presence> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return presenceService.getPresencesByDate(date);
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasAnyRole('ADMIN','RH')")
    public List<Presence> getByStatut(@PathVariable Presence.Statut statut) {
        return presenceService.getPresencesByStatut(statut);
    }

    @PostMapping("/pointer-arrivee")
    public Presence pointerArrivee(Authentication authentication, HttpServletRequest request) {
        verifierIp(request);
        return presenceService.pointerArrivee(authentication.getName());
    }

    @PostMapping("/pointer-depart")
    public Presence pointerDepart(Authentication authentication, HttpServletRequest request) {
        verifierIp(request);
        return presenceService.pointerDepart(authentication.getName());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Presence create(@Valid @RequestBody Presence presence) {
        return presenceService.createPresence(presence);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Presence update(@PathVariable Long id, @Valid @RequestBody Presence presence) {
        return presenceService.updatePresence(id, presence);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        presenceService.deletePresence(id);
    }

    //Restriction par adresse IP

    private void verifierIp(HttpServletRequest request) {
        String ipClient = request.getRemoteAddr();

        // Exception réservée au développement : propriété entreprise.autoriser-localhost=true
        boolean local = "127.0.0.1".equals(ipClient) || "0:0:0:0:0:0:0:1".equals(ipClient);
        if (local && autoriserLocalhost) {
            return;
        }

        if (!ipClient.equals(entrepriseConfig.getIpAutorisee())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Pointage refusé : vous devez être connecté au WiFi de l'entreprise");
        }
    }
}