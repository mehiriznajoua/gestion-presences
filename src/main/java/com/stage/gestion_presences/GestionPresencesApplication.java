package com.stage.gestion_presences;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GestionPresencesApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionPresencesApplication.class, args);
    }

}