package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class StopDTO {
    private UUID stationId;
    private String name;
    private Double latitude;
    private Double longitude;
    private LocalDateTime exactArrivalTime;
    private List<String> facilities;
}
