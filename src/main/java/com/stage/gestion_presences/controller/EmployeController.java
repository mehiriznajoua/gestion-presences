package com.stage.gestion_presences.controller;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.service.EmployeService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;


import java.util.List;

@RestController
@RequestMapping("/api/employes")
@PreAuthorize("hasAnyRole('ADMIN','RH')") // protège toute la classe par défaut
public class EmployeController {

    private final EmployeService employeService;

    public EmployeController(EmployeService employeService) {
        this.employeService = employeService;
    }

    @GetMapping
    public List<Employe> getAll() {
        return employeService.getAllEmployes();
    }

    // Profil de l'utilisateur connecté : pas d'id dans l'URL,
    // l'identité vient du token JWT (impossible de consulter un autre employé).
    // L'annotation de la méthode l'emporte sur celle de la classe.
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public Employe monProfil(Authentication auth) {
        return employeService.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Aucune fiche employé liée à ce compte"));
    }

    @GetMapping("/{id}")
    public Employe getById(@PathVariable Long id) {
        return employeService.getEmployeById(id);
    }

    @GetMapping("/type/{type}")
    public List<Employe> getByType(@PathVariable Employe.TypeEmploye type) {
        return employeService.getEmployesByType(type);
    }

    @GetMapping("/actifs")
    public List<Employe> getActifs() {
        return employeService.getEmployesActifs();
    }

    @PostMapping
    public Employe create(@Valid @RequestBody Employe employe) {
        return employeService.createEmploye(employe);
    }

    @PutMapping("/{id}")
    public Employe update(@PathVariable Long id, @Valid @RequestBody Employe employe) {
        return employeService.updateEmploye(id, employe);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        employeService.deleteEmploye(id);
    }
}