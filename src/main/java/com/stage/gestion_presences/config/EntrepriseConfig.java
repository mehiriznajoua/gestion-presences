package com.stage.gestion_presences.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class EntrepriseConfig {

    @Value("${entreprise.heure.debut}")
    private String heureDebutStr;

    @Value("${entreprise.heure.fin}")
    private String heureFinStr;

    @Value("${entreprise.tolerance.retard.minutes}")
    private int toleranceMinutes;

    // Une ou plusieurs adresses IP publiques, séparées par des virgules
    @Value("${entreprise.ip.autorisee}")
    private String ipAutorisee;

    // Fuseau horaire de l'entreprise (valeur par défaut : Maroc)
    @Value("${entreprise.fuseau:Africa/Casablanca}")
    private String fuseauStr;

    private LocalTime heureDebut;
    private LocalTime heureFin;
    private ZoneId fuseau;
    private Set<String> ipsAutorisees;

    // Lecture et contrôle des valeurs une seule fois, au démarrage :
    // une valeur incorrecte empêche l'application de démarrer, avec un message clair
    @PostConstruct
    void init() {
        heureDebut = LocalTime.parse(heureDebutStr.trim());
        heureFin = LocalTime.parse(heureFinStr.trim());
        fuseau = ZoneId.of(fuseauStr.trim());

        if (!heureFin.isAfter(heureDebut)) {
            throw new IllegalStateException("entreprise.heure.fin doit être postérieure à entreprise.heure.debut");
        }
        if (toleranceMinutes < 0) {
            throw new IllegalStateException("entreprise.tolerance.retard.minutes ne peut pas être négative");
        }

        ipsAutorisees = Arrays.stream(ipAutorisee.split(","))
                .map(String::trim)
                .filter(ip -> !ip.isEmpty())
                .collect(Collectors.toSet());
    }

    public LocalTime getHeureDebut() {
        return heureDebut;
    }

    public LocalTime getHeureFin() {
        return heureFin;
    }

    public int getToleranceMinutes() {
        return toleranceMinutes;
    }

    public ZoneId getFuseau() {
        return fuseau;
    }

    // Conservé pour compatibilité : la valeur brute de la propriété
    public String getIpAutorisee() {
        return ipAutorisee;
    }

    public boolean estIpAutorisee(String ip) {
        return ip != null && ipsAutorisees.contains(ip);
    }
}