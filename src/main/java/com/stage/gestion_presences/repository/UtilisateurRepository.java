package com.stage.gestion_presences.repository;

import com.stage.gestion_presences.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // Recherche par email sans tenir compte des majuscules, quelle que soit la configuration de MySQL
    @Query("select u from Utilisateur u where lower(u.email) = lower(:email)")
    Optional<Utilisateur> findByEmail(@Param("email") String email);

    @Query("select count(u) > 0 from Utilisateur u where lower(u.email) = lower(:email)")
    boolean existsByEmail(@Param("email") String email);
}