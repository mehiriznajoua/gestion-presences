package com.stage.gestion_presences.service;

import com.stage.gestion_presences.entity.Employe;
import com.stage.gestion_presences.repository.EmployeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeService {

    private final EmployeRepository employeRepository;

    public EmployeService(EmployeRepository employeRepository) {
        this.employeRepository = employeRepository;
    }

    public List<Employe> getAllEmployes() {
        return employeRepository.findAll();
    }

    public Employe getEmployeById(Long id) {
        return employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec id : " + id));
    }

    public List<Employe> getEmployesByType(Employe.TypeEmploye type) {
        return employeRepository.findByType(type);
    }

    public List<Employe> getEmployesActifs() {
        return employeRepository.findByActifTrue();
    }

    public Employe createEmploye(Employe employe) {
        return employeRepository.save(employe);
    }

    public Employe updateEmploye(Long id, Employe nouvelEmploye) {
        Employe employe = getEmployeById(id);
        employe.setNom(nouvelEmploye.getNom());
        employe.setPrenom(nouvelEmploye.getPrenom());
        employe.setEmail(nouvelEmploye.getEmail());
        employe.setTelephone(nouvelEmploye.getTelephone());
        employe.setPoste(nouvelEmploye.getPoste());
        employe.setDepartement(nouvelEmploye.getDepartement());
        employe.setType(nouvelEmploye.getType());
        employe.setDateEmbauche(nouvelEmploye.getDateEmbauche());
        employe.setDateFinContrat(nouvelEmploye.getDateFinContrat());
        employe.setActif(nouvelEmploye.getActif());
        return employeRepository.save(employe);
    }

    public void deleteEmploye(Long id) {
        employeRepository.deleteById(id);
    }
}