package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusCompany {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false, unique=true)
    private String name;

    @Column
    private String imageUrl;

    @OneToMany(mappedBy = "busCompany", cascade = CascadeType.ALL)
    private List<Route> routes;
}
