package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Station {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false, unique=true)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    private List<StationFacility> stationFacilities = new ArrayList<>();

    @OneToMany(mappedBy = "station" , cascade = CascadeType.ALL)
    private List<RouteStation> stationRoutes;

    public List<Facility> getFacilities() {
        return stationFacilities.stream()
                .map(StationFacility::getFacility)
                .collect(Collectors.toList());
    }
}
