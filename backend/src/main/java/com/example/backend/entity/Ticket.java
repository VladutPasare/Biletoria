package com.example.backend.entity;

import com.example.backend.shared.PassengerType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne
    @JoinColumn(name = "departure_schedule_id", nullable = false)
    private Schedule departureSchedule;

    @ManyToOne
    @JoinColumn(name = "destination_schedule_id", nullable = false)
    private Schedule destinationSchedule;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PassengerType passengerType;

    @Column(nullable = false)
    private String email;
}
