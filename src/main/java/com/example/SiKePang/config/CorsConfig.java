package com.example.SiKePang.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // mengizinkan ngrok
        config.setAllowedOrigins(Arrays.asList(
                "https://5605-2404-8000-1024-4b21-7b21-bbe0-3e8c-715f.ngrok-free.app"));

        // Izinkan request dari origin manapun (berguna untuk testing lokal via IP,
        // 127.0.0.1, dll)
        config.setAllowedOriginPatterns(Arrays.asList("*"));

        // HTTP method yang diperbolehkan
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Header yang diperbolehkan dikirim oleh client
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "X-User-Id"));

        // Izinkan cookies / credentials (jika pakai session atau JWT di cookie)
        config.setAllowCredentials(true);

        // Cache preflight response selama 1 jam (3600 detik)
        config.setMaxAge(3600L);

        // Terapkan konfigurasi ke semua endpoint /api/**
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
