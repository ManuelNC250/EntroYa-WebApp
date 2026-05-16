package com.entroya.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // no se  necesita .cors() porque no hay peticiones cross-origen
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll() // Permite todo sin autenticación
                )
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF (necesario para APIs REST)
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); // Opcional: para H2 Console (si la usas)

        return http.build();
    }
}