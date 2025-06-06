package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class RouteInfoDTO {
    private UUID id;
    private String departureLocation;
    private LocalDateTime departureTime;
    private String arrivalLocation;
    private LocalDateTime arrivalTime;
    private String company;
    private Integer availableSeats;
    private Double price;
}
