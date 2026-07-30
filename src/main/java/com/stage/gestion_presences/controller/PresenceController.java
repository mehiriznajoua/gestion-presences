package com.stage.gestion_presences.controller;

import com.stage.gestion_presences.entity.Presence;
import com.stage.gestion_presences.service.PresenceService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/presences")
public class PresenceController {

    private final PresenceService presenceService;

    public PresenceController(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @GetMapping
    public List<Presence> getAll() {
        return presenceService.getAllPresences();
    }

    @GetMapping("/{id}")
    public Presence getById(@PathVariable Long id) {
        return presenceService.getPresenceById(id);
    }

    @GetMapping("/employe/{employeId}")
    public List<Presence> getByEmploye(@PathVariable Long employeId) {
        return presenceService.getPresencesByEmploye(employeId);
    }

    @GetMapping("/date/{date}")
    public List<Presence> getByDate(@PathVariable String date) {
        return presenceService.getPresencesByDate(LocalDate.parse(date));
    }

    @GetMapping("/statut/{statut}")
    public List<Presence> getByStatut(@PathVariable Presence.Statut statut) {
        return presenceService.getPresencesByStatut(statut);
    }

    @PostMapping
    public Presence create(@RequestBody Presence presence) {
        return presenceService.createPresence(presence);
    }

    @PostMapping("/pointer-arrivee")
    public Presence pointerArrivee(Authentication authentication) {
        return presenceService.pointerArrivee(authentication.getName());
    }

    @PostMapping("/pointer-depart")
    public Presence pointerDepart(Authentication authentication) {
        return presenceService.pointerDepart(authentication.getName());
    }

    @PutMapping("/{id}")
    public Presence update(@PathVariable Long id, @RequestBody Presence presence) {
        return presenceService.updatePresence(id, presence);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        presenceService.deletePresence(id);
    }
}