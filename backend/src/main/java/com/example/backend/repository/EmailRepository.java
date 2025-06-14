package com.example.backend.repository;

import com.example.backend.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailRepository extends JpaRepository<Email, UUID> {
    Optional<Email> findByEmail(String email);
    boolean existsByEmail(String email);
}
