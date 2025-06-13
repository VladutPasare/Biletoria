package com.example.backend.repository;

import com.example.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    Optional<Schedule> findByRouteStation_Id(UUID routeStationId);
    Optional<Schedule> findByRouteStation_IdAndActualArrivalTime(UUID routeStationId, LocalDateTime actualArrivalTime);
}
