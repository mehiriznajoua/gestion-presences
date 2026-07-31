package com.stage.gestion_presences.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
public class EntrepriseConfig {

    @Value("${entreprise.heure.debut}")
    private String heureDebutStr;

    @Value("${entreprise.heure.fin}")
    private String heureFinStr;

    @Value("${entreprise.tolerance.retard.minutes}")
    private int toleranceMinutes;

    @Value("${entreprise.ip.autorisee}")
    private String ipAutorisee;

    public LocalTime getHeureDebut() {
        return LocalTime.parse(heureDebutStr);
    }

    public LocalTime getHeureFin() {
        return LocalTime.parse(heureFinStr);
    }

    public int getToleranceMinutes() {
        return toleranceMinutes;
    }

    public String getIpAutorisee() {
        return ipAutorisee;
    }
}