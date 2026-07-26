package com.stage.gestion_presences.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String motDePasse;
}