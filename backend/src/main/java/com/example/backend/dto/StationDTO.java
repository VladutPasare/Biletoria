package com.example.backend.dto;

import lombok.AllArgsConstructor;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class StationDTO {
    private String name;
    private double latitude;
    private double longitude;
}
