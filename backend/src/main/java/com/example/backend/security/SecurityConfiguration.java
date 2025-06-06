package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       /*http
               .authorizeHttpRequests(auth -> auth
                       .requestMatchers("/api").permitAll()
                       .anyRequest().authenticated()
               )
               .formLogin(form -> form.loginPage("/login").permitAll())
               .httpBasic().disable();*/
       return http.build();
    }
}
