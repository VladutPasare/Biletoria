package com.example.backend.dto;

import com.example.backend.shared.PassengerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class BookTicketDTO {
    private UUID routeId;
    private String departureStationName;
    private String destinationStationName;
    private String firstName;
    private String lastName;
    private PassengerType passengerType;
    private LocalDateTime departureDate;
    private String email;
}
