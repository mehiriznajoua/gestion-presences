package com.stage.gestion_presences.controller;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.service.EmployeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
public class EmployeController {

    private final EmployeService employeService;

    public EmployeController(EmployeService employeService) {
        this.employeService = employeService;
    }

    @GetMapping
    public List<Employe> getAll() {
        return employeService.getAllEmployes();
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

    @GetMapping("/email/{email}")
    public ResponseEntity<Employe> getEmployeByEmail(@PathVariable String email) {
        return employeService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Employe create(@RequestBody Employe employe) {
        return employeService.createEmploye(employe);
    }

    @PutMapping("/{id}")
    public Employe update(@PathVariable Long id, @RequestBody Employe employe) {
        return employeService.updateEmploye(id, employe);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        employeService.deleteEmploye(id);
    }
}