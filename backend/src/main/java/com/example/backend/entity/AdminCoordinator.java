package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class AdminCoordinator {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "email_id", referencedColumnName = "id", nullable = false)
    private Email email;

    @Column(nullable = false)
    private String password;
}
