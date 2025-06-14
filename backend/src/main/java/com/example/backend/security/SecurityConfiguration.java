package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
               .csrf(AbstractHttpConfigurer::disable)
               .cors(cors -> cors.configurationSource(corsConfigurationSource()))
               .authorizeHttpRequests(auth -> auth
                       .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                       .requestMatchers(HttpMethod.POST, "/authentication/login").permitAll()
                       .requestMatchers(HttpMethod.POST,"/authentication/register/passenger").permitAll()
                       .requestMatchers(HttpMethod.POST,"/authentication/register/company").permitAll()
                       .requestMatchers("/api/stations").permitAll()
                       .requestMatchers("/route/search").permitAll()
                       .requestMatchers("/route-station/stops").permitAll()
                       .requestMatchers(HttpMethod.POST,"/authentication/register/passenger/**").hasAuthority("PASSENGER")
                       .requestMatchers(HttpMethod.POST,"/authentication/register/company/**").hasAuthority("COMPANY_ADMIN")
                       .requestMatchers("/ticket").permitAll()
                       .requestMatchers(HttpMethod.POST,"/authentication/logout").permitAll()
                       .requestMatchers(HttpMethod.POST,"/authentication/me").permitAll()
                       .anyRequest().authenticated());

       return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}