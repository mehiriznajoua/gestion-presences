package com.stage.gestion_presences.repository;

import com.stage.gestion_presences.entity.Employe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface EmployeRepository extends JpaRepository<Employe, Long> {

    List<Employe> findByType(Employe.TypeEmploye type);
    List<Employe> findByActifTrue();
    long countByActifTrue();
    long countByType(Employe.TypeEmploye type);
    Optional<Employe> findByEmail(String email);

}