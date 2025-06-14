package com.example.backend.repository;

import com.example.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    Optional<Schedule> findByRouteStation_Id(UUID routeStationId);
    Optional<Schedule> findByRouteStation_IdAndActualArrivalTime(UUID routeStationId, LocalDateTime actualArrivalTime);
}
