package com.stage.gestion_presences.repository;

import com.stage.gestion_presences.entity.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Long> {

    List<Employe> findByType(Employe.TypeEmploye type);
    List<Employe> findByActifTrue();
    long countByActifTrue();
    long countByType(Employe.TypeEmploye type);

    // Employés actifs d'un type donné (les totaux du dashboard ne doivent pas compter les inactifs)
    long countByTypeAndActifTrue(Employe.TypeEmploye type);

    // Recherche par email sans tenir compte des majuscules, quelle que soit la configuration de MySQL
    // (même nom de méthode qu'avant : les appels existants ne changent pas)
    @Query("select e from Employe e where lower(e.email) = lower(:email)")
    Optional<Employe> findByEmail(@Param("email") String email);

    // Pour signaler clairement un email déjà utilisé
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    // Employés qui doivent travailler à cette date : actifs, contrat commencé et pas terminé
    @Query("""
        select count(e) from Employe e
        where e.actif = true
          and e.dateEmbauche <= :date
          and (e.dateFinContrat is null or e.dateFinContrat >= :date)
        """)
    long countActifsSousContrat(@Param("date") LocalDate date);

    // Ceux d'entre eux qui n'ont aucune présence enregistrée à cette date (pour la tâche des absences)
    @Query("""
        select e from Employe e
        where e.actif = true
          and e.dateEmbauche <= :date
          and (e.dateFinContrat is null or e.dateFinContrat >= :date)
          and not exists (select p from Presence p where p.employe = e and p.date = :date)
        """)
    List<Employe> findActifsSansPresence(@Param("date") LocalDate date);
}